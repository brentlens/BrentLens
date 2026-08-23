import { createClient } from "@/lib/server";
import { IUserSetting } from "@/types/onboarding";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const id = searchParams.get("id");
    //  console.log("iddddddddddddd === ", id)
    if (!id) {
      return NextResponse.json(
        { message: "Unable to find user id" },
        { status: 400 }
      );
    }
    const supabase = await createClient();

    // const { data: { user }, error: authError } = await supabase.auth.getUser();

    // if (authError || !user) {
    //   return NextResponse.json(
    //     { message: "Authentication required. Missing active session metadata container." }, 
    //     { status: 401 }
    //   );
    // }

    const { data, error: dbError } = await supabase
      .from("users_profile")
      .select('preference').eq('id', id)
      .single();

    const { data: dataBrent, error: dbErrorBrent } = await supabase
      .from("brentLens_brent_crude")
      .select("changes,price,formatted")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (dbErrorBrent) {
      return NextResponse.json(
        { message: `Database crash: ${dbErrorBrent.message}` },
        { status: 500 }
      );
    }
    //   console.log("brent changes ------",dataBrent)

    if (dbError) {
      return NextResponse.json(
        { message: `Database crash: ${dbError.message}` },
        { status: 500 }
      );
    }

    const modData = {
      country: data.preference.country.value,
      sector: data.preference.industry.value,
      spendBucket: data.preference.fuelSpend.value,
      brent30Days: dataBrent.changes,
      currentPrice: dataBrent.price,
      formattedPrice: dataBrent.formatted
    }

    //   console.log("brent changes ------",modData)


    return NextResponse.json(
      {
        success: true,
        message: "Fetched data",
        record: modData
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