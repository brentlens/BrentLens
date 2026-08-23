import { createClient } from "@/lib/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    // const { searchParams } = new URL(request.url);
    const id = 'lifetime_founding';
    if (!id) {
      return NextResponse.json(
        { message: "Unable to find promotion quota" },
        { status: 400 }
      );
    }
    const supabase = await createClient();

     const { data, error:dbError } = await supabase
      .from("promotion_plan_prices")
      .select(`
        *,
        promotions!inner(),
        plans!inner(
        description, currency,price,name
        )
      `)
      .eq("promotions.is_active", true)
      .eq("plans.is_active", true);

    if (dbError) {
      return NextResponse.json(
        { message: `Database crash: ${dbError.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Fetched data",
        record: data
      },
      { status: 200 }
    );

  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || "Internal server processing failure exceptions." },
      { status: 500 }
    );
  }
}