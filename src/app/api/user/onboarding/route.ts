import { createClient } from "@/lib/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // Extract payload from request stream matching want_to_pass structural mapping format
    const body = await request.json();
    
    const { email, name, preference, google_linked } = body;

    // Validate incoming payload existence assertions
    if (!email || !preference) {
      return NextResponse.json(
        { message: "Malformed request. Missing email or onboarding preferences data fields." }, 
        { status: 400 }
      );
    }

    // Initialize Server Supabase client context safe from client token injection tampering
    const supabase = await createClient();

    // Verify user session instantiated at step 1 auth layer
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { message: "Authentication required. Missing active session metadata container." }, 
        { status: 401 }
      );
    }

    // Persist the structured layout directly into the single jsonb "preference" table property column
    const { data, error: dbError } = await supabase
      .from("users_profile")
      .upsert({
        id: user.id,          // Primary key references Auth user GUID instance
        email: email,
        name: name,      // Maps name property text string parameter cleanly
        preference: preference, // Saves complete processed nested json structure directly to jsonb column
        // updated_at: new Date().toISOString(),
		google_linked: google_linked,
		created_at: new Date().toISOString(),
		role:'user',
      }, { onConflict: 'id' })
      .select()
      .single();

    if (dbError) {
      console.error("Supabase engine operation failed:", dbError);
      return NextResponse.json(
        { message: `Database persistence layer crash: ${dbError.message}` }, 
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        success: true, 
        message: "Ecosystem deployment config updated successfully.", 
        record: data 
      }, 
      { status: 200 }
    );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Global endpoint processing runtime crash:", error);
    return NextResponse.json(
      { message: error.message || "Internal server processing failure exceptions." }, 
      { status: 500 }
    );
  }
}