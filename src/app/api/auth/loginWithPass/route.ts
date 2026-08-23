/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { passwordVerifyService } from "@/services/auth.service";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    console.log("json hai ", body);

    const { email, password, isSignUp } = body;

    const result = await passwordVerifyService(email,password,"127.0.0.1",isSignUp);

     const response = NextResponse.json({
      message: "Login successful",
      data: result,
    });

    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 401 }
      );
    }

    if(!isSignUp){
      response.cookies.set("auth-token", result?.token || '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 2, // 2 hours (in seconds) to match your JWT expiration
      });
    }

    return response;

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    );
  }
}