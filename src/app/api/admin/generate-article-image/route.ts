/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { GoogleGenAI } from "@google/genai";
import sharp from "sharp";
import crypto from "crypto";

const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY!,
});

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

const MAX_IMAGE_SIZE = 1024 * 1024; // 1MB

function buildPromptRules() {
  return `
You are an expert editorial image prompt engineer.

Generate a highly accurate editorial image prompt from article content.

STRICT RULES:
- photorealistic editorial quality
- realistic news/media composition
- cinematic lighting
- strong storytelling
- no text
- no watermark
- no logos
- no stock-photo style
- 16:9 landscape composition
- focus on central subject
- realistic human expressions if relevant
- return ONLY prompt text
`;
}

async function compressImage(buffer: Buffer): Promise<Buffer> {
  let quality = 85;
  let width = 1280;
  let height = 720;

  while (quality >= 35) {
    const compressed = await sharp(buffer)
      .resize(width, height, {
        fit: "cover",
      })
      .webp({ quality })
      .toBuffer();

    if (compressed.length <= MAX_IMAGE_SIZE) {
      return compressed;
    }

    quality -= 10;

    if (quality < 50) {
      width = 1024;
      height = 576;
    }
  }

  throw new Error("Unable to compress below 1MB");
}

async function generateGeminiImage(prompt: string): Promise<Buffer> {
  const response: any = await ai.models.generateContent({
    model: "gemini-2.5-flash-image",
    contents: prompt,
    config: {
      responseModalities: ["IMAGE"],
    },
  });

  const parts = response?.candidates?.[0]?.content?.parts || [];

  const imagePart = parts.find(
    (part: any) => part.inlineData?.data
  );

  if (!imagePart?.inlineData?.data) {
    console.log("Gemini response:", JSON.stringify(response, null, 2));
    throw new Error("No image returned from Gemini");
  }

  return Buffer.from(imagePart.inlineData.data, "base64");
}
export async function POST(req: NextRequest) {
  try {
    const { cleanTitle, shortSummary, fullContent } = await req.json();

    if (!cleanTitle || !shortSummary || !fullContent) {
      return NextResponse.json(
        { error: "Missing article content" },
        { status: 400 }
      );
    }

    const articleHash = crypto
      .createHash("sha256")
      .update(`${cleanTitle}${shortSummary}`)
      .digest("hex");

    const claudeResponse = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 500,
      temperature: 0.2,
      system: buildPromptRules(),
      messages: [
        {
          role: "user",
          content: `
Article Title:
${cleanTitle}

Short Summary:
${shortSummary}

Full Content:
${fullContent.slice(0, 7000)}
          `,
        },
      ],
    });

    const prompt =
      claudeResponse.content?.[0]?.type === "text"
        ? claudeResponse.content[0].text
        : "";

    if (!prompt) {
      throw new Error("Prompt generation failed");
    }

    const rawImageBuffer = await generateGeminiImage(prompt);
    const compressed = await compressImage(rawImageBuffer);

    return NextResponse.json({
      success: true,
      image: `data:image/webp;base64,${compressed.toString("base64")}`,
      prompt,
      articleHash,
    });
  } catch (error: any) {
    console.error("Generate article image error:", error);

    return NextResponse.json(
      {
        error: error?.message || "Failed to generate article image",
      },
      { status: 500 }
    );
  }
}