/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabase } from "@/lib/supabaseClient";
import { WaitlistFormData } from "@/types/onboarding";
import { ApiError } from "@/utils/ApiError";

export const getWaitListEmail = async () => {
  const { data, error } = await supabase
    .from("brent_waitlistUsers")
    .select("current_email_step,last_email_sent_at,")
    .eq("user_email", "") // add userid later
    .limit(1);

  if (error) {
    console.error("Error fetching email logs:", error);
    return [];
  }

  return data || [];
};


export const insertWaitListEmail = async (
  values: WaitlistFormData & { authMethod?: 'google' | 'email' }
) => {
  const isOAuth = values.authMethod === 'google';

  // Basic validation
  if (!values.email) {
    throw new ApiError("Email is required", 400, "INVALID_EMAIL");
  }
  if (!values.fullName) {
    throw new ApiError("Full name is required", 400, "INVALID_NAME");
  }
  // Only require password for regular email signups
  if (!isOAuth && !values.password) {
    throw new ApiError("Password is required", 400, "INVALID_PASSWORD");
  }

  // Check if user already exists
  const { data: existing, error: existingErr } = await supabase
    .from("brent_waitlistUsers")
    .select("user_email")
    .eq("user_email", values.email)
    .maybeSingle();

  if (existingErr) {
    console.error("Supabase lookup error:", existingErr);
    throw new ApiError(
      "Unable to check whether the email already exists",
      500,
      "DATABASE_ERROR"
    );
  }
  if (existing) {
    throw new ApiError("This email is already on the waitlist", 409, "USER_EXISTS");
  }

  const obj = {
    user_pass: isOAuth ? null : values.password, // Set to null (or "" if column is NOT NULL)
    user_name: values.fullName,
    user_email: values.email,
  };

  const { data, error } = await supabase
    .from("brent_waitlistUsers")
    .insert(obj)
    .select("id,user_email,isRegistered,user_name")
    .single();

  if (error) {
    console.error("Supabase insert error:", error);
    throw new ApiError("Unable to add user to the waitlist", 500, "DATABASE_ERROR");
  }

  return data;
};

// const res = await axiosInstance.get(`/api/incidentsList`);
// return res.data;