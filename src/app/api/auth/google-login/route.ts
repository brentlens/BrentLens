/* eslint-disable @typescript-eslint/no-explicit-any */
import jwt from "jsonwebtoken";
import crypto from "crypto";

import { NextResponse } from "next/server";

import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { createClient } from "@/lib/server";

export async function GET(req: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return NextResponse.redirect(
        new URL(
          "/login",
          process.env.NEXT_PUBLIC_API_URL
        )
      );
    }

    const email =
      user.email?.toLowerCase();

    if (!email) {
      throw new Error(
        "Email not received from Google"
      );
    }

    let { data: dbUser } =
      await supabaseAdmin
        .from("users")
        .select("*")
        .eq("email", email)
        .single();

    if (!dbUser) {
      const {
        data: newUser,
        error: createError,
      } = await supabaseAdmin
        .from("users")
        .insert([
          {
            email,
            name:
              user.user_metadata
                ?.full_name || email,
            role: "user",
            is_verified: true,
            google_linked: true,
          },
        ])
        .select()
        .single();

      if (createError) {
        throw createError;
      }

      dbUser = newUser;
    } else {
      await supabaseAdmin
        .from("users")
        .update({
          google_linked: true,
        })
        .eq("id", dbUser.id);
    }

    const sessionId =
      crypto.randomUUID();

    await supabaseAdmin
      .from("user_login_record")
      .update({
        is_active: false,
      })
      .eq("user_id", dbUser.id);

    const token = jwt.sign(
      {
        userId: dbUser.id,
        role: dbUser.role,
        email: email,
        sessionId,
      },
      process.env.JWT_SECRET!,
      {
        expiresIn: "2h",
      }
    );

    const forwardedFor =
      req.headers.get("x-forwarded-for");

    const ip =
      forwardedFor?.split(",")[0]
        ?.trim() || "unknown";

    const userAgent =
      req.headers.get("user-agent") || "";

    await supabaseAdmin
      .from("user_login_record")
      .insert({
        user_id: dbUser.id,
        current_session_id:
          sessionId,
        ip_address: ip,
        user_agent: userAgent,
        is_active: true,
        session_expiry:
          new Date(
            Date.now() +
              2 * 60 * 60 * 1000
          ).toISOString(),
      });

    const response =
      NextResponse.redirect(
        new URL(
         "/home",
          process.env
            .NEXT_PUBLIC_API_URL
        )
      );

    response.cookies.set(
      "auth-token",
      token,
      {
        httpOnly: true,
        secure:
          process.env.NODE_ENV ===
          "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 2,
      }
    );

    return response;
  } catch (error) {
    console.error(
      "Google Login Error:",
      error
    );

    return NextResponse.redirect(
      new URL(
        "/login",
        process.env.NEXT_PUBLIC_API_URL
      )
    );
  }
}