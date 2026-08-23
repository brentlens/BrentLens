"use client";
import React, { useState, useEffect } from 'react';
import CustomInput from '@/components/CustomInput';
import CustomButton from '@/components/CustomButton';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function LoginPage() {

  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);

  // Email Validation Effect
  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsEmailValid(emailRegex.test(email));
  }, [email]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSendEmail = async () => {
    if (!isEmailValid) return;
    if (password.length < 3) return;
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/loginWithPass", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password,isSignUp:false }),
      });

      const data = await res.json();
      console.log("with pass" + data)
      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }
      console.log("Is New User:", data.data.isNewUser);
      toast.success("Login successful")
      router.push("/admin/dashboard")

    } catch (err: any) {
	  toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md bg-background border border-gray-200 dark:border-neutral-800 p-8 rounded-2xl shadow-xl">

        <div className="text-center animate-in fade-in slide-in-from-left-4">
          <p className="text-foreground/80 mb-8 text-lg">
            Please enter your email address and password.
          </p>
          <CustomInput
            label="Email Address"
            placeholder="example@domain.com"
            value={email}
            onChange={setEmail}
            disabled={isLoading}
            error={email.length > 0 && !isEmailValid ? "Please enter a valid email." : ""}
          />

        </div>

        {/* password field */}
        <div className="text-center animate-in fade-in slide-in-from-left-4">
          <CustomInput
            label="Password"
            placeholder=""
            value={password}
            onChange={setPassword}
            disabled={isLoading}
            type='password'
          />
        </div>


        <div className="mt-6">
          <CustomButton
            label="Verify & login"
            onClick={handleSendEmail}
            isLoading={isLoading}
            disabled={!isEmailValid} // Prevent clicking if invalid
          />
        </div>

      </div>
    </main>
  );
}