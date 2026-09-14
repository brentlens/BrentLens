import { createClient } from "@/lib/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        const supabase = await createClient();

        const { data, error: dbError } = await supabase
            .from("promotions")
            .select('id,max_limit,claimed_count')
            .eq("is_active", true);

        if (dbError) {
            return NextResponse.json(
                { message: `Database crash: ${dbError.message}` },
                { status: 500 }
            );
        }
        let recs = data[0].max_limit > 0 ? data : []
        return NextResponse.json(
            {
                success: true,
                message: "Fetched data",
                record: recs
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