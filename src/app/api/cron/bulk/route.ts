/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const BASE_API_URL = "https://api.oilpriceapi.com/v1/prices/historical";
const AUTH_TOKEN = process.env.BRENT_API_AUTH_TOKEN!;

export async function POST(request: NextRequest) {
  // Protect bulk seed endpoint using CRON_SECRET or custom secret
  const authHeader = request.headers.get("authorization");
  if (
    process.env.CRON_SECRET &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // 1. Calculate start date for past 6 months
    const startDateObj = new Date();
    startDateObj.setMonth(startDateObj.getMonth() - 6);
    const startDate = startDateObj.toISOString().split("T")[0]; // YYYY-MM-DD

    // Fetch daily historical data starting from past 6 months
    const url = `${BASE_API_URL}?by_code=BRENT_CRUDE_USD&start_date=2026-01-01&interval=daily`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Token ${AUTH_TOKEN}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(
        `OilPriceAPI error HTTP ${response.status}: ${response.statusText}`
      );
    }

    const result = await response.json();
    const records = result?.data?.prices || result?.data;

    if (!Array.isArray(records) || records.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No records returned from API.",
        recordsInserted: 0,
      });
    }

    const sortedRecords = [...records].sort((a: any, b: any) => {
	return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
	});

	// 2. Format records using your exact target schema
	const rowsToInsert = sortedRecords.map((item: any) => ({
	created_at: item.created_at,
	code: item.code || "BRENT_CRUDE_USD",
	price: item.price,
	source: "oilpriceapi",
	type: item.type || "spot_price",
	currency: item.currency || "USD",
	formatted: item.formatted || `$${item.price}`,
	unit: item.unit || "per barrel",
	updated_at: item.created_at || item.updated_at || new Date().toISOString(),
	changes: item.changes || null,
	}));

	// 3. Direct single-shot insert into Supabase without batch limits
	const { error: insertError } = await supabaseAdmin
	.from("brentLens_brent_crude")
	.insert(rowsToInsert);

    if (insertError) {
      console.error("Supabase bulk insert error:", insertError);
      return NextResponse.json(
        { error: "Database bulk insert failed", details: insertError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      resultRec: rowsToInsert,
      message: `Bulk insertion complete from ${startDate}`,
      recordsInserted: rowsToInsert.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Seed execution error:", error.message);
    return NextResponse.json(
      { error: "Internal Server Error", message: error.message },
      { status: 500 }
    );
  }
}