/* eslint-disable prefer-const */
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import jwt from "jsonwebtoken";

export const loginService = async (email: string) => {
  email = email.toLowerCase();

  let isNewUser = false;

  // 1. Check user
  let { data: user, error: userError } = await supabaseAdmin
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  // 2. If NOT exists → create user
  if (!user || userError) {
    const { data: newUser, error: createError } = await supabaseAdmin
      .from("users")
      .insert([
        {
          email,
          name: email, // you can update later
          role: "user", // IMPORTANT for your proxy
          is_verified: false,
          // pass: passwo
        },
      ])
      .select()
      .single();

    if (createError) {
      throw new Error(createError.message);
    }

    user = newUser;
    isNewUser = true;

    return {
      user,
      isNewUser, // ✅ IMPORTANT
    };

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


export const verifyOtpService = async (otp_id: string, otp: string, ip: string) => {
  // 1. Get OTP
  const { data: otpData, error } = await supabaseAdmin
    .from("user_otp")
    .select("*")
    .eq("id", otp_id)
    .single();

  if (!otpData || error) throw new Error("OTP not found");

  if (otpData.is_used) {
    throw new Error("OTP already used");
  }

  const now = new Date().toISOString();

  if (now > otpData.otp_expiry) {
    await supabaseAdmin
      .from("user_otp")
      .update({ is_used: true })
      .eq("id", otp_id);
    throw new Error("OTP expired");
  }

  if (otpData.otp != otp) {
    throw new Error("Invalid OTP");
  }

  // 2. Mark OTP used
  await supabaseAdmin
    .from("user_otp")
    .update({ is_used: true })
    .eq("id", otp_id);

  // 3. Get user
  const { data: user } = await supabaseAdmin
    .from("users")
    .select("*")
    .eq("email", otpData.email)
    .single();

  // 4. Create JWT
  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role, //"user",
      portal: "user"
    },
    process.env.JWT_SECRET!,
    { expiresIn: "2h" }
  );

  // 5. Save login record
  await supabaseAdmin.from("user_login_record").insert([
    {
      user_id: user.id,
      ip_address: ip,
      user_agent: "web",
      login_time: new Date(),
    },
  ]);

  return {
    token,
    user,
  };
};

export const passwordVerifyService = async (email: string, pass: string, ip: string,isSignUp:boolean=false) => {

  let isNewUser = false

  const { data: user, error } = await supabaseAdmin
    .from("users")
    .select("id,email,role")
    .eq("email", email.toLowerCase())
    .eq("pass", pass)
    .single();

    console.log("sign up hai",user, "email ",email, "pass ",pass)

    if (!user && isSignUp) {
    const { data: newUser, error: createError } = await supabaseAdmin
      .from("users")
      .insert([
        {
          email,
          name: email, // you can update later
          role: "user", // IMPORTANT for your proxy
          is_verified: false,
          pass: pass
        },
      ])
      .select("id,email,role")
      .single();

    if (createError) {
      throw new Error(createError.message);
    }

    let user = newUser;
    isNewUser = true;

    return {
      user,
      isNewUser, // ✅ IMPORTANT
    };

  }

  if (error || !user) {
    return { error: "User not found" };
  }

  ///////// for encrypted pass check using bcrypt ///////////

  // const isPasswordValid = await bcrypt.compare(pass, user.hashed_password);
  // if (!isPasswordValid) {
  //   return { error: "Invalid email or password" };
  // }

  let redirectTo = user.role == "admin" ? "admin": ""
  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      portal: redirectTo
    },
    process.env.JWT_SECRET!,
    { expiresIn: "2h" }
  );

  recordLogin(user.id, ip)

  return {
    token,
    user,
  };
};



const recordLogin = async (userid: string, ip: string) => {
  const { error: recordError } = await supabaseAdmin.from("user_login_record").insert([
    {
      user_id: userid,
      ip_address: ip,
    },
  ]);

  if (recordError) {
    console.error("Failed to save login record:", recordError.message);
  }

}