/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { loginService } from "@/services/auth.service";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    const result = await loginService(email);

    return NextResponse.json({
      message: "OTP sent",
      data: result,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }
}