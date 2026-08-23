/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";
import { Anthropic } from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY!,
});

/* ---------------- HELPERS ---------------- */

const fetchDiffbot = async (url: string) => {

  try {
    const res = await fetch(
      `https://api.diffbot.com/v3/article?token=${process.env.DIFFBOT_TOKEN}&url=${encodeURIComponent(
        url
      )}`
    );
    if (!res.ok) {
      throw new Error("Diffbot request failed");
    }
    const data = await res.json();
    const article = data.objects?.[0];
	
    return {
      fullContent: article?.text || null,
      image_url: article?.images?.[0]?.url || null,
      title: article?.title || null,
    };
  } catch (error) {
    console.error("Diffbot error:", error);
    return null;
  }

};

const getCoordinates = async (location: string) => {
  try {
    if (!location || location === "Global" || location === "Unknown") {
      return null;
    }
    const res = await fetch(
      `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
        location
      )}&key=${process.env.OPENCAGE_API_KEY}&limit=1`
    );
    if (!res.ok) {
      throw new Error("OpenCage request failed");
    }
    const data = await res.json();
    if (data.results?.length) {
      return {
        lat: data.results[0].geometry.lat,
        lng: data.results[0].geometry.lng,
      };
    }
    return null;
  } catch (error) {
    console.error("OpenCage error:", error);
    return null;
  }
};

const parseClaudeJSON = (text: string) => {
  try {
    return JSON.parse(
      text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim()
      );
  } catch {
    return null;
  }
};

const processWithClaude = async (
  title: string,
  content: string,
  location?: string
) => {
  const prompt = `
You are an expert news editorial processor and translator.

Analyze, translate, and clean this article.

CRITICAL TRANSLATION RULE:
- If the title, summary, or article content is in any language other than English, you MUST translate them completely into English. All output values in the JSON must be in English.

CRITICAL LENGTH & FORMAT RULES:
- The "cleanFullContent" MUST maintain the same approximate length as the original ARTICLE text provided below.
- The "cleanFullContent" MUST maintain the exact same number of paragraphs as the original ARTICLE text. Do not condense multiple paragraphs into one.

Return STRICT VALID JSON ONLY.
NO markdown.
NO code blocks.
NO explanations.

Required JSON structure:
{
  "rephrasedTitle": "",
  "shortSummary": "",
  "exactLocation": "",
  "state": "",
  "country": "",
  "locationConfidence": "high",
  "cleanFullContent": "",
  "incidentType": "",
  "targetCommunity": ""
}

Rules:
- Rephrase title professionally in English.
- Remove publisher noise/clickbait.
- shortSummary = exactly 2 neutral sentences in English.
- exactLocation = most specific real place (city/town/village).
- state = the specific state or province where the incident occurred. If unknown, return an empty string "".
- country = the country where the incident occurred. If unknown, return an empty string "".
- if exactLocation is unknown return "Global".
- cleanFullContent = rewrite entire article in clean editorial format in English, preserving original paragraph breaks and length.
- preserve facts.
- remove junk/html/boilerplate.
- incidentType must be one of:
  "Demolition"
  "Violence"
  "Vandalism"
  "Arrest"
  "Lynching"
  "Forced Conversion"
  "Other"
- targetCommunity must be exactly ONE word identifying the primary community affected by the incident. It must be chosen from this list if applicable:
  "Christian"
  "Muslim"
  "Dalit"
  "Sikh"
  "Adivasi"
  "Other"
  If the community cannot be determined from the text, return "Other".

TITLE:
${title}

KNOWN LOCATION:
${location || "Unknown"}

ARTICLE:
${content}
`;

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 4000,
    temperature: 0.2,
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  const textBlock = response.content.find(
    (block) => block.type === "text"
  );

  if (!textBlock || textBlock.type !== "text") {
    throw new Error("Claude returned empty response");
  }

  const parsed = parseClaudeJSON(textBlock.text);

  if (!parsed) {
    throw new Error("Claude JSON parsing failed");
  }

  return parsed;
};

/* ---------------- API ---------------- */

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: incidentId } = await context.params;

    if (!incidentId) {
      return NextResponse.json(
        {
          success: false,
          message: "incidentId is required",
        },
        { status: 400 }
      );
    }

    console.log("STEP 1: Fetching incident from DB");

    const { data: incident, error } = await supabase
      .from("incidents")
      .select("*")
      .eq("id", incidentId)
      .single();

    if (error || !incident) {
      console.error(error);

      return NextResponse.json(
        {
          success: false,
          message: "Incident not found",
        },
        { status: 404 }
      );
    }

    let fullContent = incident.fullContent || "";
    let image_url = incident.image_url || null;
    let cleanTitle = incident.cleanTitle || incident.title || "";
    let shortSummary = incident.shortSummary || "";
    let location = incident.location || "Unknown";
    let locationConfidence = incident.locationConfidence || "low";
    let incidentType = "Other";
    
    // Initialize the new fields with existing database values or default fallbacks
    let community = incident.targetCommunity || "Other";
    let state = incident.state || "";
    let country = incident.country || "";

    /* STEP 2 */
    if (incident.originalLink) {
      console.log("STEP 2: Diffbot fetch");

      const diffbotData = await fetchDiffbot(incident.originalLink);

      if (diffbotData?.fullContent) {
        fullContent = diffbotData.fullContent;
      }

      if (diffbotData?.image_url) {
        image_url = diffbotData.image_url;
      }

      if (!cleanTitle && diffbotData?.title) {
        cleanTitle = diffbotData.title;
      }
    }

    if (!fullContent?.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "No article content available",
        },
        { status: 400 }
      );
    }

    /* STEP 3 */
    console.log("STEP 3: Claude processing");

    const aiData = await processWithClaude(
      cleanTitle,
      fullContent,
      location
    );
	
    cleanTitle = aiData.rephrasedTitle || cleanTitle;
    shortSummary = aiData.shortSummary || shortSummary;
    location = aiData.exactLocation || location;
    locationConfidence =
      aiData.locationConfidence || locationConfidence;
    fullContent = aiData.cleanFullContent || fullContent;
    incidentType = aiData.incidentType || "Other";
    
    // Extract the new variables from Claude's response payload
    community = aiData.targetCommunity || community;
    state = aiData.state || state;
    country = aiData.country || country;
      
    /* STEP 4 */
    const coordinates =
      (await getCoordinates(location)) ||
      incident.coordinates ||
      null;
      
    console.log(aiData);
    console.log(coordinates);
    
    return NextResponse.json({
      success: true,
      data: {
        ...incident,
        cleanTitle,
        shortSummary,
        fullContent,
        location,
        locationConfidence,
        incidentType,
        community, // Included in response
        state,           // Included in response
        country,         // Included in response
        coordinates,
        image_url,
      },
    });
  } catch (error: any) {
    console.error("Approve API error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Internal server error",
      },
      { status: 500 }
    );
  }
}