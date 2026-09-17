/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect } from 'react';
import { StepProps } from '@/types/onboarding';
import { validateEmail } from '@/utils/validation';
import { createClient } from '@/lib/client';
import { usePreRegistration } from '@/contexts/PreRegOnboardingContext';
import { checkEmailExists } from '@/services/user.service';

interface ExtendedStepProps extends StepProps {
  onUserExists?: (email: string) => void;
}

export const StepOneAuth: React.FC<ExtendedStepProps> = ({ onValidStateChange, onUserExists }) => {
  const { state, updateState }: any = usePreRegistration();
  const [method, setMethod] = useState<'google' | 'email' | null>(state.auth.method);
  const [showEmail, setShowEmail] = useState(state.auth.method === 'email');
  const [email, setEmail] = useState(state.auth.email || '');
  const [name, setName] = useState(state.auth.user_name || '');
  const [password, setPassword] = useState(state.auth.password || '');
  const [showPassword, setShowPassword] = useState(false);
  const [isCheckingOAuth, setIsCheckingOAuth] = useState(false);

  // Field interaction tracking to avoid premature error alerts
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false,
  });

  // Track if user has a persistent authenticated OAuth session present
  const isOAuthVerified = state.auth.method === 'google' && !!state.auth.email;

  // Validation conditions
  const isNameValid = name.trim().length > 0;
  const isEmailValid = typeof validateEmail === "function" ? validateEmail(email) : /\S+@\S+\.\S+/.test(email);
  const isPasswordValid = 
    password.length >= 8 &&
    password.length <= 10 &&
    !/\s/.test(password) &&
    /[A-Z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(password);

  useEffect(() => {
    if (isOAuthVerified) {
      onValidStateChange(true);
    } else if (method === 'email') {
      onValidStateChange(isEmailValid && isNameValid && isPasswordValid);
    } else {
      onValidStateChange(false);
    }
  }, [method, isEmailValid, isNameValid, isPasswordValid, isOAuthVerified, onValidStateChange]);

  // Read Supabase Client Session data on mount if user returned from Google Callback
  useEffect(() => {
    const checkActiveOAuthUser = async () => {
      // If already verified in local context, skip
      if (state.auth.method === 'google' && state.auth.email) return;

      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        const fetchedEmail = user.email || '';
        const fetchedName = user.user_metadata?.full_name || user.user_metadata?.name || '';

        if (!fetchedEmail) return;

        setIsCheckingOAuth(true);
        const exists = await checkEmailExists(fetchedEmail);
        setIsCheckingOAuth(false);

        if (exists) {
          // Disconnect Supabase session to prevent automatic login lock
          await supabase.auth.signOut();

          // Reset context auth state so UI does not get locked
          updateState({
            auth: {
              method: null,
              email: '',
              user_name: '',
              password: '',
            },
          });
          setMethod(null);
          setEmail('');
          setName('');
          setPassword('');

          // Trigger User Exists Modal in parent component
          if (onUserExists) {
            onUserExists(fetchedEmail);
          }
          return;
        }

        // Email does not exist: proceed to bind active OAuth session
        setMethod('google');
        setShowEmail(false);
        updateState({
          auth: {
            method: 'google',
            email: fetchedEmail,
            user_name: fetchedName,
            password: '',
          },
        });
      }
    };

    checkActiveOAuthUser();
  }, [updateState, state.auth.method, state.auth.email, onUserExists]);

  const handleGoogleAuthClick = async () => {
    if (isOAuthVerified) {
      alert("Already authenticated via linked corporate Google account profile.");
      return;
    }

    const supabase = createClient();
    updateState({ auth: { method: 'google', email: '', user_name: '', password: '' } });

    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?pageRoute=/onboarding`,
        queryParams: {
          prompt: "select_account",
          access_type: "offline",
        },
      },
    });
  };

  const toggleEmailFields = () => {
    if (isOAuthVerified) {
      alert("Account locked via active identity session verification layer.");
      return;
    }
    const nextState = !showEmail;
    setShowEmail(nextState);
    if (nextState) {
      setMethod('email');
      updateState((prev: any) => ({ auth: { ...prev.auth, method: 'email' } }));
    } else {
      setMethod(null);
      updateState((prev: any) => ({ auth: { ...prev.auth, method: null } }));
    }
  };

  const handleBlur = (field: 'name' | 'email' | 'password') => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setEmail(val);
    updateState((prev: any) => ({ auth: { ...prev.auth, email: val } }));
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setName(val);
    updateState((prev: any) => ({ auth: { ...prev.auth, user_name: val } }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleanVal = e.target.value.replace(/\s/g, '').slice(0, 10);
    setPassword(cleanVal);
    updateState((prev: any) => ({ auth: { ...prev.auth, password: cleanVal } }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="step-view active w-full animate-[fadeIn_0.25s_ease]">
      <h2 className="mb-2 text-[clamp(20px,5vw,28px)] font-extrabold leading-[1.2] tracking-[-0.04em] text-[var(--ink)]">
        Create your account
      </h2>

      <p className="mb-5 text-[13px] leading-[1.65] text-[var(--ink3)] sm:text-[14px] sm:leading-[1.7]">
        {isOAuthVerified
          ? `Authenticated securely as ${state.auth.email}. Proceed to the next step.`
          : isCheckingOAuth
          ? "Verifying Google account details..."
          : "Sign in with Google or enter your work email. Takes 30 seconds."}
      </p>

      {/* Google Authentication Button */}
      <button
        type="button"
        disabled={isOAuthVerified || isCheckingOAuth}
        onClick={handleGoogleAuthClick}
        className={`mb-3 flex w-full items-center justify-center gap-2.5 rounded-[var(--r)] border-[1.5px] p-3 sm:p-[14px_20px] text-[14px] sm:text-[15px] font-semibold text-[var(--ink)] transition-all duration-[180ms] ${
          isOAuthVerified
            ? "cursor-not-allowed border-[var(--green)] bg-[var(--surf2)] opacity-65"
            : isCheckingOAuth
            ? "cursor-wait border-[var(--bd2)] bg-[var(--surf2)] opacity-75"
            : "border-[var(--bd2)] bg-[var(--card-bg)] hover:-translate-y-[1px] hover:border-[var(--pur2)] hover:bg-[var(--card-h)] hover:shadow-[var(--sh)]"
        }`}
      >
        <svg className="h-5 w-5 shrink-0" viewBox="0 0 20 20">
          <path d="M19.6 10.23c0-.68-.06-1.36-.17-2H10v3.79h5.39a4.6 4.6 0 01-2 3.02v2.51h3.23c1.89-1.74 2.98-4.3 2.98-7.32z" fill="#4285F4" />
          <path d="M10 20c2.7 0 4.96-.9 6.62-2.45l-3.23-2.51c-.9.6-2.04.96-3.39.96-2.6 0-4.81-1.76-5.6-4.12H1.07v2.6A10 10 0 0010 20z" fill="#34A853" />
          <path d="M4.4 11.88A6.01 6.01 0 014.09 10c0-.65.11-1.28.31-1.88V5.52H1.07A10 10 0 000 10c0 1.61.38 3.14 1.07 4.48l3.33-2.6z" fill="#FBBC04" />
          <path d="M10 3.96c1.47 0 2.79.5 3.82 1.5l2.86-2.86C14.95 1 12.69 0 10 0A10 10 0 001.07 5.52l3.33 2.6C5.19 5.72 7.4 3.96 10 3.96z" fill="#EA4335" />
        </svg>

        <span className="truncate">
          {isCheckingOAuth
            ? "Verifying account..."
            : isOAuthVerified
            ? "Identity Verified"
            : "Continue with Google"}
        </span>
      </button>

      {/* Divider */}
      {!isOAuthVerified && (
        <div className="my-4 flex items-center gap-2.5 text-center text-[11px] text-[var(--ink3)] before:h-px before:flex-1 before:bg-[var(--bd)] before:content-[''] after:h-px after:flex-1 after:bg-[var(--bd)] after:content-[''] sm:gap-3 sm:text-[12px]">
          <span className="shrink-0">or enter details manually</span>
        </div>
      )}

      {/* Email / Password Fields */}
      {showEmail && !isOAuthVerified && (
        <div className="mb-3 block animate-[fadeIn_0.25s_ease] space-y-3.5">
          <div className="flex w-full flex-col gap-3 sm:flex-row sm:gap-4">
            {/* Full Name */}
            <div className="flex w-full flex-col">
              <label
                className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.06em] text-[var(--ink3)] sm:text-[11px]"
                style={{ fontFamily: "var(--S)" }}
              >
                Full name <span className="text-red-500 ml-0.5" aria-hidden="true">*</span>
              </label>

              <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={handleNameChange}
                onBlur={() => handleBlur('name')}
                aria-invalid={touched.name && !isNameValid}
                aria-describedby="name-error"
                className={`w-full rounded-[var(--r2)] border-[1.5px] bg-[var(--input-bg)] p-3 text-[14px] text-[var(--ink)] transition-all duration-[160ms] focus:outline-none ${
                  touched.name && !isNameValid
                    ? "border-red-500 focus:border-red-500 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.15)]"
                    : "border-[var(--bd2)] focus:border-[var(--pur2)] focus:shadow-[0_0_0_3px_var(--ps)]"
                }`}
              />
              {touched.name && !isNameValid && (
                <div id="name-error" className="mt-1.5 flex items-center gap-1.5 text-[11px] font-medium text-red-500 sm:text-[12px]">
                  <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span>Please enter your full name.</span>
                </div>
              )}
            </div>

            {/* Work Email */}
            <div className="flex w-full flex-col">
              <label
                className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.06em] text-[var(--ink3)] sm:text-[11px]"
                style={{ fontFamily: "var(--S)" }}
              >
                Work email <span className="text-red-500 ml-0.5" aria-hidden="true">*</span>
              </label>

              <input
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={handleEmailChange}
                onBlur={() => handleBlur('email')}
                aria-invalid={touched.email && !isEmailValid}
                aria-describedby="email-error"
                className={`w-full rounded-[var(--r2)] border-[1.5px] bg-[var(--input-bg)] p-3 text-[14px] text-[var(--ink)] transition-all duration-[160ms] focus:outline-none ${
                  touched.email && !isEmailValid
                    ? "border-red-500 focus:border-red-500 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.15)]"
                    : "border-[var(--bd2)] focus:border-[var(--pur2)] focus:shadow-[0_0_0_3px_var(--ps)]"
                }`}
              />
              {touched.email && !isEmailValid && (
                <div id="email-error" className="mt-1.5 flex items-center gap-1.5 text-[11px] font-medium text-red-500 sm:text-[12px]">
                  <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span>{email.trim().length === 0 ? "Email address is required." : "Enter a valid email address."}</span>
                </div>
              )}
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.06em] text-[var(--ink3)] sm:text-[11px]">
              Password <span className="text-red-500 ml-0.5" aria-hidden="true">*</span>
            </label>

            <div className="relative flex items-center">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="8-10 chars (1 uppercase, 1 number, 1 symbol)"
                maxLength={10}
                value={password}
                onChange={handlePasswordChange}
                onKeyDown={(e) => {
                  if (e.key === " ") {
                    e.preventDefault();
                  }
                }}
                onBlur={() => handleBlur('password')}
                aria-invalid={touched.password && !isPasswordValid}
                aria-describedby="password-error"
                className={`w-full rounded-[var(--r2)] border-[1.5px] bg-[var(--input-bg)] p-[12px_40px_12px_15px] text-[14px] text-[var(--ink)] transition-all focus:outline-none ${
                  touched.password && !isPasswordValid
                    ? "border-red-500 focus:border-red-500 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.15)]"
                    : "border-[var(--bd2)] focus:border-[var(--pur2)] focus:shadow-[0_0_0_3px_var(--ps)]"
                }`}
              />

              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 flex items-center justify-center p-1 text-[var(--ink3)] hover:text-[var(--ink2)] focus:outline-none"
                aria-label="Toggle password visibility"
              >
                {showPassword ? (
                  <svg className="h-[18px] w-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.45 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1l22 22" />
                  </svg>
                ) : (
                  <svg className="h-[18px] w-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>

            {touched.password && !isPasswordValid && (
              <div id="password-error" className="mt-1.5 flex items-center gap-1.5 text-[11px] font-medium text-red-500 sm:text-[12px]">
                <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span>Must be 8–10 chars with 1 capital, 1 number, and 1 special symbol (no spaces).</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Alternative Credentials Toggle */}
      {!isOAuthVerified && (
        <div className="w-full text-center">
          <button
            type="button"
            onClick={toggleEmailFields}
            className="cursor-pointer rounded-[8px] bg-none px-3 py-2 text-[12px] text-[var(--ink3)] underline transition-colors hover:text-[var(--ink2)] sm:text-[13px]"
          >
            {showEmail
              ? "Continue with Google"
              : "Or continue with email instead"}
          </button>
        </div>
      )}

      {/* Security Footer */}
      <div
        className="mt-4 flex max-w-full items-start justify-center gap-1.5 text-center text-[10px] leading-[1.55] text-[var(--ink3)] sm:text-[11px] sm:leading-[1.6]"
        style={{ fontFamily: "var(--S)" }}
      >
        <svg className="mt-[2px] h-3 w-3 shrink-0" viewBox="0 0 12 12" fill="none">
          <rect x="2" y="5" width="8" height="6" rx="1" stroke="currentColor" strokeWidth="1.2" />
          <path d="M4 5V3.5a2 2 0 014 0V5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>

        <span>
          Your data is encrypted and never shared. We use it only to personalise
          your fuel cost calculations.
        </span>
      </div>
    </div>
  );
};