import { createClient } from "@supabase/supabase-js";
import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());

// index.js
/// run command ---- npx tsx src/scripts/brent_crude.ts
const API_URL = "https://api.oilpriceapi.com/v1/prices/latest?by_code=BRENT_CRUDE_USD";
const AUTH_TOKEN = "cfb21b917d7b7a6754ee2a23daadfa2878c625c0effe31fb72675f4e30da3795";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Use service role only on the server
);


// async function fetchData() {
//   try {
//     const response = await fetch(API_URL, {
//       method: "GET",
//       headers: {
//         Authorization: `Bearer ${AUTH_TOKEN}`,
//         "Content-Type": "application/json",
//       },
//     });

//     if (!response.ok) {
//       throw new Error(`HTTP ${response.status}: ${response.statusText}`);
//     }

//     const data = await response.json();

//     console.log("API Response:");
//     console.dir(data, { depth: null });
//   } catch (error:any) {
//     console.error("Error fetching data:", error.message);
//   }
// }


export async function fetchBrentData() {
  try {


    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${AUTH_TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const oil = await response.json();

    console.log("API Response:");
    console.dir(oil.data, { depth: null });

    const { error } = await supabase
      .from("brentLens_brent_crude")
      .insert({
        code: oil.data.code,
        price: oil.data.price,
        source: oil.data.source,
        type: oil.data.type,
        currency: oil.data.currency,
        formatted: oil.data.formatted,
        unit: oil.data.unit,
        updated_at: oil.data.updated_at,
        changes: oil.data.changes
      });

    if (error) {
      console.error("Supabase insert error:", error);
      return;
    }

    console.log("Data inserted successfully");
  } catch (error: any) {
    console.error("Error:", error.message);
  }
}


// fetchBrentData();