/* eslint-disable @typescript-eslint/no-explicit-any */
import { verifyOtpService } from "@/services/auth.service";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { otp_id, otp } = await req.json();

    const result = await verifyOtpService(otp_id, otp, "127.0.0.1");

    const response = NextResponse.json({
      message: "Login successful",
      data: result,
    });

    response.cookies.set("auth-token", result.token, {
      httpOnly: true,
      secure: true,
      path: "/",
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }
}