/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from '@/lib/supabaseAdmin';

const API_URL = process.env.BRENT_API_URL!;
const AUTH_TOKEN = process.env.BRENT_API_AUTH_TOKEN!;

export async function GET(request: NextRequest) {
  // Protect route with CRON_SECRET (Vercel automatically sends this header)
  const authHeader = request.headers.get("authorization");
  if (
    process.env.CRON_SECRET &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${AUTH_TOKEN}`,
        "Content-Type": "application/json",
      },
      // Disable caching so every cron run gets fresh market data
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`External API HTTP ${response.status}: ${response.statusText}`);
    }

    const oil = await response.json();

    if (!oil?.data) {
      throw new Error("Invalid payload format received from oil API");
    }

    const { error: insertError } = await supabaseAdmin
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
        changes: oil.data.changes,
      });

    if (insertError) {
      console.error("Supabase insert error:", insertError);
      return NextResponse.json(
        { error: "Database insertion failed", details: insertError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Brent crude data fetched and inserted successfully",
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Cron execution error:", error.message);
    return NextResponse.json(
      { error: "Internal Server Error", message: error.message },
      { status: 500 }
    );
  }
}