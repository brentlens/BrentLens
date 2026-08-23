/* eslint-disable prefer-const */
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import jwt from "jsonwebtoken";

export const signupService = async (email: string,password:string) => {
  email = email.toLowerCase();

  let isNewUser = false;

  // 1. Check user
  let { data: user, error: userError } = await supabaseAdmin
    .from("users")
    .select("*")
    .eq("email", email)
    .eq("password",password)
    .single();

  // 2. If NOT exists → create user
  if (!user || userError) {
    const { data: newUser, error: createError } = await supabaseAdmin
      .from("users")
      .insert([
        {
          email,
          name: "", // you can update later
          role: "user", // IMPORTANT for your proxy
          is_verified: false,
        },
      ])
      .select()
      .single();

    if (createError) {
      throw new Error(createError.message);
    }

    user = newUser;
    isNewUser = true;
  }

  // 3. Expire old OTPs
  await supabaseAdmin
    .from("user_otp")
    .update({ is_used: true })
    .eq("email", email);

  // 4. Generate OTP
  const otp = Math.floor(1000 + Math.random() * 9000);

  const { data: otpData, error: otpError } = await supabaseAdmin
    .from("user_otp")
    .insert([
      {
        email,
        otp,
        is_used: false,
        otp_expiry: new Date(Date.now() + 5 * 60 * 1000),
      },
    ])
    .select()
    .single();

  if (otpError) throw new Error(otpError.message);

  // 👉 Replace with email service later
  console.log("OTP:", otp);

  return {
    user,
    otp_id: otpData.id,
    isNewUser, // ✅ IMPORTANT
  };
};