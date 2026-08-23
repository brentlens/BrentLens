import { createClient } from "@/lib/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    // Replaces the temporary authorization code token for a live secure user cookie session
    await supabase.auth.exchangeCodeForSession(code);
  }

  // Redirect the authenticated browser context back onto the primary multi-step form view dashboard
  return NextResponse.redirect(new URL("/onboarding", request.url));
}