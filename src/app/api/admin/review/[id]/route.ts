import { supabase } from "@/lib/supabaseClient";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { status } = await req.json();
    const { id } = await context.params;

    const { error } = await supabase
      .from("incidents")
      .update({
        status,
      })
      .eq("id", id);

    if (error) {
      console.error(error);

      return NextResponse.json(
        {
          success: false,
          message: "Failed to update incident",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Incident updated successfully",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}