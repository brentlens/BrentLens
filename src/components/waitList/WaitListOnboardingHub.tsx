/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
'use client';
import { usePreRegistration } from '@/contexts/PreRegOnboardingContext';
import { createClient } from '@/lib/client';
import { WaitlistFormData } from '@/types/onboarding';
import { Check, ChevronDown, Mail, Sun } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';

const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const WaitlistComponent: React.FC = () => {
    const router = useRouter();
    const { state, updateState }: any = usePreRegistration();

    const [formData, setFormData] = useState<WaitlistFormData>({
        fullName: state?.auth?.user_name || '',
        email: state?.auth?.email || '',
        password: state?.auth?.password || '',
    });

    const [touched, setTouched] = useState({
        fullName: false,
        email: false,
        password: false,
    });

    const [method, setMethod] = useState<'google' | 'email' | null>(state?.auth?.method || null);
    const [showEmail, setShowEmail] = useState<boolean>(state?.auth?.method === 'email');
    const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [showPassword, setShowPassword] = useState(false);

    // Hard synchronous lock to prevent React StrictMode double executions
    const isProcessingOAuth = useRef(false);

    // Validation conditions
    const isNameValid = formData.fullName.trim().length > 0;
    const isEmailValid = validateEmail(formData.email);
    const isPasswordValid = 
        Boolean(formData.password && formData.password.length >= 8 &&
        formData.password.length <= 10 &&
        !/\s/.test(formData.password) &&
        /[A-Z]/.test(formData.password) &&
        /[0-9]/.test(formData.password) &&
        /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(formData.password));

    const isFormValid = Boolean(isNameValid && isEmailValid && isPasswordValid);

    // Sync form inputs when preRegistration state updates
    useEffect(() => {
        if (state?.auth) {
            setFormData({
                fullName: state.auth.user_name || '',
                email: state.auth.email || '',
                password: state.auth.password || '',
            });
            if (state.auth.method) {
                setMethod(state.auth.method);
            }
        }
    }, [state]);

    const resetFormData = () => {
        setFormData({
            fullName: '',
            email: '',
            password: '',
        });

        setTouched({
            fullName: false,
            email: false,
            password: false,
        });

        updateState((prev: any) => ({
            ...prev,
            auth: {
                ...prev?.auth,
                user_name: '',
                email: '',
                password: '',
            },
        }));
    };

    const submitFormData = async (data: WaitlistFormData, isOAuth: boolean = false) => {
        if (loading) return false; // Guard against concurrent submissions
        const supabase = createClient();

        try {
            setLoading(true);
            setError(null);
			
            const payload = {
                fullName: data.fullName,
                email: data.email,
                password: isOAuth ? '' : data.password,
                authMethod: isOAuth ? 'google' : 'email',
            };

            const response = await fetch('/api/waitList', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const result = await response.json();

            if (!response.ok) {
                const errorMessage = result.error || 'Failed to join waitlist.';

                setError(errorMessage);
                toast.error(errorMessage);

                resetFormData();
                setMethod(null);
                setShowEmail(false);
                
                await supabase.auth.signOut();

                updateState((prev: any) => ({
                    ...prev,
                    auth: {
                        ...prev?.auth,
                        method: null,
                        user_name: '',
                        email: '',
                        password: '',
                    },
                }));

                return false;
            }

            toast.success('User added to wait list');
            setIsSubmitted(true);
            return true;
        } catch (err: any) {
            console.error('Waitlist submission error:', err);

            setError('Network error. Please try again.');
            toast.error('Network error. Please try again.');

            resetFormData();
            setMethod(null);
            setShowEmail(false);

            await supabase.auth.signOut();

            updateState((prev: any) => ({
                ...prev,
                auth: {
                    ...prev?.auth,
                    method: null,
                    user_name: '',
                    email: '',
                    password: '',
                },
            }));

            return false;
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleWaitlistSubmit = async (fullName: string, email: string) => {
        const googleFormData: WaitlistFormData = {
            fullName,
            email,
            password: '',
        };
        setFormData(googleFormData);
        setMethod('google');
        setShowEmail(false);
        updateState((prev: any) => ({
            ...prev,
            auth: {
                ...prev?.auth,
                method: 'google',
                email,
                user_name: fullName,
                password: '',
            },
        }));

        await submitFormData(googleFormData, true);
    };

    const checkActiveOAuthUser = async () => {
        // 1. Check lock synchronously
        if (isProcessingOAuth.current) return;

        // 2. Lock IMMEDIATELY before any asynchronous code or await statements
        isProcessingOAuth.current = true;

        try {
            const supabase = createClient();
            const { data: { user }, error: authErr } = await supabase.auth.getUser();

            if (authErr || !user) {
                // If there is no active OAuth session, release lock for manual flow
                isProcessingOAuth.current = false;
                return;
            }

            if (state?.waitlist?.joinedWaitlist) {
                return;
            }

            const fetchedEmail = user.email || '';
            const fetchedName =
                user.user_metadata?.full_name ||
                user.user_metadata?.name ||
                '';

            if (!fetchedEmail) {
                setError('Unable to get email from Google account.');
                isProcessingOAuth.current = false;
                return;
            }

            await handleGoogleWaitlistSubmit(fetchedName, fetchedEmail);
        } catch (e) {
            console.error('OAuth check error:', e);
            isProcessingOAuth.current = false;
        }
    };

    useEffect(() => {
        checkActiveOAuthUser();
    }, []);

    const isOAuthVerified = method === 'google' && !!formData.email;

    const handleBlur = (field: 'fullName' | 'email' | 'password') => {
        setTouched((prev) => ({ ...prev, [field]: true }));
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (error) setError(null);
        setFormData((prev) => ({ ...prev, [name]: value }));

        const contextField = name === 'fullName' ? 'user_name' : name;
        updateState((prev: any) => ({
            ...prev,
            auth: {
                ...prev?.auth,
                [contextField]: value,
            },
        }));
    };

    const handleGoogleAuthClick = async () => {
        if (loading) return;

        const supabase = createClient();
        setError(null);
        setLoading(true);

        updateState((prev: any) => ({
            ...prev,
            auth: {
                ...prev?.auth,
                method: 'google',
                email: '',
                user_name: '',
                password: '',
            },
        }));

        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/callback?pageRoute=/waitlist`,
                queryParams: {
                    prompt: 'select_account',
                    access_type: 'offline',
                },
            },
        });

        if (error) {
            console.error('Google authentication error:', error);
            setLoading(false);
            setError(error.message);
            toast.error(error.message);

            resetFormData();
            setMethod(null);
            setShowEmail(false);
        }
    };

    const toggleEmailFields = () => {
        if (isOAuthVerified) {
            alert('Account locked via active identity session verification layer.');
            return;
        }
        const nextState = !showEmail;
        setShowEmail(nextState);
        if (nextState) {
            setMethod('email');
            updateState((prev: any) => ({
                ...prev,
                auth: { ...prev?.auth, method: 'email' },
            }));
        } else {
            setMethod(null);
            updateState((prev: any) => ({
                ...prev,
                auth: { ...prev?.auth, method: null },
            }));
        }
    };

    const handleManualSubmit = () => {
        if (loading) return;

        setTouched({
            fullName: true,
            email: true,
            password: true,
        });

        if (!formData.fullName.trim() || !formData.email.trim()) {
            setError('Please fill in all required fields.');
            return;
        }

        if (!validateEmail(formData.email)) {
            setError('Please enter a valid email address.');
            return;
        }

        if (method === 'email' && (!formData.password || formData.password.length < 8)) {
            setError('Password must be at least 8 characters long.');
            return;
        }

        setError(null);

        updateState((prev: any) => ({
            ...prev,
            auth: {
                ...prev?.auth,
                method: method || 'email',
                email: formData.email,
                user_name: formData.fullName,
                password: formData.password || '',
            },
            waitlist: {
                ...prev?.waitlist,
                joinedWaitlist: true,
                waitlistJoinedAt: new Date().toISOString(),
            },
        }));

        submitFormData(formData, false);
    };

    const handleReserveFoundingRate = () => {
        router.push('/onboarding');
    };

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-start font-sans text-slate-800">
            {/* Brand Header */}
            <header className="w-full flex sm:justify-start justify-center bg-white border-b border-b-gray-200 mb-8">
                <div className="flex items-center py-3 px-10">
                    <img
                        src="/assets/landingPage/landing_logo.png"
                        alt="BrentLens"
                        id="nav-logo"
                        className="sm:h-[50px] h-[30px] w-auto block"
                    />
                </div>
            </header>

            {/* Main Container */}
            <div className="w-full max-w-lg mx-auto p-12 bg-[var(--card-bg)] rounded-3xl border border-gray-200 shadow-xl">
                {/* Error Banner */}
                {error && (
                    <div className="mb-5 flex items-center gap-2.5 rounded-xl border border-red-200 bg-[#FFF1F2] p-3 text-[13px] font-medium text-[#E11D48] shadow-sm animate-[fadeIn_0.2s_ease]">
                        <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#E11D48] text-white text-[10px] font-bold">
                            !
                        </span>
                        <span>{error}</span>
                    </div>
                )}

                {isSubmitted ? (
                    <div className="text-center py-6">
                        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[linear-gradient(135deg,#7C3AED_0%,#4F46E5_55%,#06B6D4_100%)] text-white shadow-lg shadow-indigo-200">
                            <Check className="h-10 w-10 stroke-[3]" />
                        </div>

                        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-3">
                            You are on the list!
                        </h2>
                        <p className="text-slate-500 text-base leading-relaxed mb-8 px-2">
                            We will email you the moment your dashboard is ready. In the meantime here is what happens next.
                        </p>

                        <div className="bg-slate-50/70 border border-slate-100 rounded-xl p-5 text-left mb-6 divide-y divide-slate-200/60">
                            <div className="flex gap-3.5 pb-4">
                                <div className="flex-shrink-0 mt-0.5">
                                    <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                                        <Mail className="w-4 h-4" />
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-slate-900 mb-0.5">Confirmation email</h4>
                                    <p className="text-xs text-slate-500 leading-normal">
                                        Check your inbox &mdash; we just sent a welcome email to{' '}
                                        <span className="text-indigo-600 font-semibold">{state?.auth?.email || formData.email}</span>
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-3.5 py-4">
                                <div className="flex-shrink-0 mt-0.5">
                                    <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                                        <Sun className="w-4 h-4" />
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-slate-900 mb-0.5">Weekly market updates</h4>
                                    <p className="text-xs text-slate-500 leading-normal">
                                        We will send you a weekly fuel cost briefing while you wait &mdash; so you see the product in action
                                    </p>
                                </div>
                            </div>

                            <div className="flex gap-3.5 pt-4">
                                <div className="flex-shrink-0 mt-0.5">
                                    <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                                        <ChevronDown className="w-4 h-4" />
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-slate-900 mb-0.5">First access when ready</h4>
                                    <p className="text-xs text-slate-500 leading-normal">
                                        Waitlist members get dashboard access before the public launch
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-indigo-50/60 border border-indigo-100 rounded-xl p-6 text-center">
                            <span className="block text-[11px] font-bold uppercase tracking-wider text-indigo-600 mb-2">
                                WANT IMMEDIATE ACCESS?
                            </span>
                            <p className="text-sm text-slate-700 mb-5 leading-snug px-2">
                                Reserve a founding member seat now and lock in your rate for life before 3,500 seats fill.
                            </p>
                            <button
                                type="button"
                                onClick={handleReserveFoundingRate}
                                className="w-fit justify-center px-7 py-3.5 rounded-lg bg-gradient-to-br from-pur to-cyan text-white text-[15px] font-bold shadow-[0_4px_20px_rgba(124,58,237,0.35)] transition-all duration-180 inline-flex items-center gap-2 hover:translate-y-[-2px] hover:shadow-[0_8px_32px_rgba(124,58,237,0.5)] cursor-pointer"
                            >
                                Reserve founding rate &rarr;
                            </button>
                        </div>
                    </div>
                ) : (
                    <div>
                        <div className="card-tag mb-[16px]">
                            <svg width="8" height="8" viewBox="0 0 8 8">
                                <circle cx="4" cy="4" r="3.5" fill="#7C3AED" />
                            </svg>
                            Free waitlist
                        </div>

                        <h2 className="text-[24px] font-extrabold text-[var(--ink)] tracking-[-0.04em] leading-[1.2] mb-[7px]">
                            Get early access to BrentLens
                        </h2>

                        <p className="text-[14px] text-[var(--ink3)] leading-[1.7] mb-[24px]">
                            We will notify you the moment your dashboard is ready — and you will be first in line for founding member pricing.
                        </p>

                        <button
                            type="button"
                            disabled={isOAuthVerified || loading}
                            onClick={handleGoogleAuthClick}
                            className={`w-full p-[14px_20px] rounded-[var(--r)] border-[1.5px] flex items-center justify-center gap-[12px] text-[15px] font-semibold text-[var(--ink)] transition-all duration-[180ms] mb-[12px] ${
                                isOAuthVerified
                                    ? 'opacity-65 cursor-not-allowed bg-[var(--surf2)] border-[var(--green)]'
                                    : 'bg-[var(--card-bg)] border-[var(--bd2)] hover:bg-[var(--card-h)] hover:border-[var(--pur2)] hover:-translate-y-[1px] hover:shadow-[var(--sh)]'
                            }`}
                        >
                            <svg className="w-[20px] h-[20px] shrink-0" viewBox="0 0 20 20">
                                <path d="M19.6 10.23c0-.68-.06-1.36-.17-2H10v3.79h5.39a4.6 4.6 0 01-2 3.02v2.51h3.23c1.89-1.74 2.98-4.3 2.98-7.32z" fill="#4285F4" />
                                <path d="M10 20c2.7 0 4.96-.9 6.62-2.45l-3.23-2.51c-.9.6-2.04.96-3.39.96-2.6 0-4.81-1.76-5.6-4.12H1.07v2.6A10 10 0 0010 20z" fill="#34A853" />
                                <path d="M4.4 11.88A6.01 6.01 0 014.09 10c0-.65.11-1.28.31-1.88V5.52H1.07A10 10 0 000 10c0 1.61.38 3.14 1.07 4.48l3.33-2.6z" fill="#FBBC04" />
                                <path d="M10 3.96c1.47 0 2.79.5 3.82 1.5l2.86-2.86C14.95 1 12.69 0 10 0A10 10 0 001.07 5.52l3.33 2.6C5.19 5.72 7.4 3.96 10 3.96z" fill="#EA4335" />
                            </svg>
                            <span>{isOAuthVerified ? 'Identity Session Verified' : 'Continue with Google'}</span>
                        </button>

                        {!isOAuthVerified && (
                            <div className="flex items-center gap-[12px] my-[16px] text-[12px] text-[var(--ink3)] before:content-[''] before:flex-1 before:h-[1px] before:bg-[var(--bd)] after:content-[''] after:flex-1 after:h-[1px] after:bg-[var(--bd)]">
                                or use email
                            </div>
                        )}

                        {showEmail && !isOAuthVerified && (
                            <div className="space-y-[14px] mb-[14px]">
                                <div>
                                    <label className="block mb-[6px] text-[11px] font-bold uppercase tracking-[0.06em] text-[var(--ink3)]">
                                        Full name <span className="text-red-500 ml-0.5" aria-hidden="true">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        placeholder="Your name"
                                        value={formData.fullName}
                                        onChange={handleInputChange}
                                        onBlur={() => handleBlur('fullName')}
                                        aria-invalid={touched.fullName && !isNameValid}
                                        aria-describedby="waitlist-name-error"
                                        className={`w-full p-[12px_15px] rounded-[var(--r2)] border-[1.5px] bg-[var(--input-bg)] text-[var(--ink)] text-[14px] transition-all focus:outline-none ${
                                            touched.fullName && !isNameValid
                                                ? 'border-red-500 focus:border-red-500 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.15)]'
                                                : 'border-[var(--bd2)] focus:border-[var(--pur2)] focus:shadow-[0_0_0_3px_var(--ps)]'
                                        }`}
                                    />
                                    {touched.fullName && !isNameValid && (
                                        <div id="waitlist-name-error" className="mt-1.5 flex items-center gap-1.5 text-[11px] font-medium text-red-500 sm:text-[12px]">
                                            <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                            </svg>
                                            <span>Please enter your full name.</span>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block mb-[6px] text-[11px] font-bold uppercase tracking-[0.06em] text-[var(--ink3)]">
                                        Work email <span className="text-red-500 ml-0.5" aria-hidden="true">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="you@company.com"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        onBlur={() => handleBlur('email')}
                                        aria-invalid={touched.email && !isEmailValid}
                                        aria-describedby="waitlist-email-error"
                                        className={`w-full p-[12px_15px] rounded-[var(--r2)] border-[1.5px] bg-[var(--input-bg)] text-[var(--ink)] text-[14px] transition-all focus:outline-none ${
                                            touched.email && !isEmailValid
                                                ? 'border-red-500 focus:border-red-500 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.15)]'
                                                : 'border-[var(--bd2)] focus:border-[var(--pur2)] focus:shadow-[0_0_0_3px_var(--ps)]'
                                        }`}
                                    />
                                    {touched.email && !isEmailValid && (
                                        <div id="waitlist-email-error" className="mt-1.5 flex items-center gap-1.5 text-[11px] font-medium text-red-500 sm:text-[12px]">
                                            <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                            </svg>
                                            <span>{formData.email.trim().length === 0 ? 'Email address is required.' : 'Enter a valid email address.'}</span>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block mb-[6px] text-[11px] font-bold uppercase tracking-[0.06em] text-[var(--ink3)] sm:text-[11px]">
                                        Password <span className="text-red-500 ml-0.5" aria-hidden="true">*</span>
                                    </label>
                                    <div className="relative flex items-center">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            name="password"
                                            placeholder="8-10 chars (1 uppercase, 1 number, 1 symbol)"
                                            maxLength={10}
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            onKeyDown={(e) => {
                                                if (e.key === ' ') {
                                                    e.preventDefault();
                                                }
                                                if (e.key === 'Enter' && isFormValid) {
                                                    handleManualSubmit();
                                                }
                                            }}
                                            onBlur={() => handleBlur('password')}
                                            aria-invalid={touched.password && !isPasswordValid}
                                            aria-describedby="waitlist-password-error"
                                            className={`w-full rounded-[var(--r2)] border-[1.5px] bg-[var(--input-bg)] p-[12px_40px_12px_15px] text-[14px] text-[var(--ink)] transition-all focus:outline-none ${
                                                touched.password && !isPasswordValid
                                                    ? 'border-red-500 focus:border-red-500 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.15)]'
                                                    : 'border-[var(--bd2)] focus:border-[var(--pur2)] focus:shadow-[0_0_0_3px_var(--ps)]'
                                            }`}
                                        />
                                        <button
                                            type="button"
                                            onClick={togglePasswordVisibility}
                                            className="absolute right-[12px] text-[var(--ink3)] hover:text-[var(--ink2)] focus:outline-none"
                                            aria-label="Toggle password visibility"
                                        >
                                            {showPassword ? (
                                                <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.45 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1l22 22" />
                                                </svg>
                                            ) : (
                                                <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                    {touched.password && !isPasswordValid && (
                                        <div id="waitlist-password-error" className="mt-1.5 flex items-center gap-1.5 text-[11px] font-medium text-red-500 sm:text-[12px]">
                                            <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                            </svg>
                                            <span>Must be 8–10 chars with 1 capital, 1 number, and 1 special symbol (no spaces).</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {!isOAuthVerified && (
                            <div className="w-full text-center mb-4">
                                <button
                                    type="button"
                                    onClick={toggleEmailFields}
                                    className="bg-none border-none text-[13px] text-[var(--ink3)] p-1 rounded-[8px] hover:text-[var(--ink2)] cursor-pointer underline"
                                >
                                    {showEmail ? 'Continue with Google' : 'Or continue with email instead'}
                                </button>
                            </div>
                        )}

                        {(showEmail || isOAuthVerified) && (
                            <button
                                type="button"
                                disabled={(showEmail && !isFormValid) || loading}
                                onClick={handleManualSubmit}
                                className={`w-full justify-center px-7 py-3.5 rounded-lg text-white text-[15px] font-bold inline-flex items-center gap-2 transition-all duration-180 ${
                                    (showEmail && !isFormValid) || loading
                                        ? 'bg-gray-300 cursor-not-allowed opacity-60 shadow-none'
                                        : 'bg-gradient-to-br from-pur to-cyan shadow-[0_4px_20px_rgba(124,58,237,0.35)] hover:translate-y-[-2px] hover:shadow-[0_8px_32px_rgba(124,58,237,0.5)] cursor-pointer'
                                }`}
                            >
                                {loading ? (
                                    <>
                                        <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                        Joining...
                                    </>
                                ) : (
                                    <>Join the waitlist &rarr;</>
                                )}
                            </button>
                        )}

                        <div className="text-[11px] text-[var(--ink3)] text-center max-w-full leading-[1.6] mt-[16px] flex items-start gap-[5px] justify-center">
                            <span>No credit card · No spam · Unsubscribe any time</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};