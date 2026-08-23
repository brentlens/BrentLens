/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect, useState } from 'react';
import { useOnboarding } from '../../contexts/OnboardingContext';
import { ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';
import { usePreRegistration } from '@/contexts/PreRegOnboardingContext';
import { useRouter } from 'next/navigation';

export const SuccessOverlay: React.FC = () => {
  const { state, resetContext } = usePreRegistration();
  const router = useRouter();

  const handleFinish = () => {
    router.push("/home");
  };

    useEffect(() => {
	  resetContext();
	}, []);



  return (
    <div className="fixed inset-0 bg-[var(--bg)] z-[600] flex flex-col items-center justify-center p-6 overflow-y-auto scroll-clean transition-colors duration-300 animate-[fadeIn_0.4s_ease-out]">
      <div className="w-full max-w-xl text-center space-y-6 py-8 select-none flex flex-col items-center">
        {/* Designer Layout Check Circle Header Element */}
		<img 
			src="/assets/landingPage/landing_logo.png"
			alt="BrentLens" 
			id="nav-logo" 
			className="h-[80px] w-auto block"
			/>
        <div className="w-16 h-16 rounded-full bg-[rgba(16,185,129,0.12)] text-[var(--green)] flex items-center justify-center mx-auto text-3xl shadow-[0_4px_24px_rgba(16,185,129,0.15)]">
          <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
        </div>

        <div className="space-y-2">
          <h2 className="text-[clamp(24px,3.5vw,32px)] font-black tracking-[-0.04em] text-[var(--ink)] font-[var(--font-sora)] leading-[1.2]">
            Founding rate reserved! 🎉
          </h2>
          <p className="text-[14px] text-[var(--ink3)] max-w-md mx-auto leading-[1.6]">
            You are in. Your rate is locked for life. Check your email for confirmation and next steps.
          </p>
        </div>

        {/* Structured Configuration Spec Table Matrix Grid */}
        <div className="w-full bg-[var(--surf)] border border-[var(--bd)] rounded-[var(--r)] p-5 text-left space-y-3 shadow-inner">
          
          <div className="flex flex-col gap-y-[11px] text-[13px] leading-none">
            {/* Industry Node */}
            <div className="flex items-center justify-between border-b border-transparent pb-[2px]">
              <span className="text-[var(--ink3)] font-medium">Name</span>
              <span className="text-[var(--ink)] font-bold text-right truncate max-w-[280px]">
                {state.auth.user_name || 'Not set'}
              </span>
            </div>
            <div className="flex items-center justify-between border-b border-transparent pb-[2px]">
              <span className="text-[var(--ink3)] font-medium">Email</span>
              <span className="text-[var(--ink)] font-bold text-right truncate max-w-[280px]">
                {state.auth.email || 'Not set'}
              </span>
            </div>
            <div className="flex items-center justify-between border-b border-transparent pb-[2px]">
              <span className="text-[var(--ink3)] font-medium">Industry</span>
              <span className="text-[var(--ink)] font-bold text-right truncate max-w-[280px] uppercase">
                {state.industryLabel || 'Not set'}
              </span>
            </div>
            <div className="flex items-center justify-between pb-[2px]">
              <span className="text-[var(--ink3)] font-medium">Plan</span>
              <span className="text-[var(--ink)] font-bold text-right truncate max-w-[280px]">
                {state.planLabel || '-'} — ${state.planAmount || '-'}/mo (founding rate)
              </span>
            </div>
            <div className="flex items-center justify-between pb-[2px]">
              <span className="text-[var(--ink3)] font-medium">Rate</span>
              <span className="text-green font-bold text-right truncate max-w-[280px]">
                Locked forever 🔒 
              </span>
            </div>
            <div className="flex items-center justify-between pb-[2px]">
              <span className="text-[var(--ink3)] font-medium">Trial Access</span>
              <span className="text-[var(--ink)] font-bold text-right truncate max-w-[280px]">
                14-day Full Pro ✔️
              </span>
            </div>
          </div>
        </div>

        {/* Action Call Button */}
        <button
          type="button"
          onClick={handleFinish}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-[var(--r2)] bg-gradient-to-r from-[var(--pur)] via-[var(--blue)] to-[var(--cyan)] text-white font-extrabold text-[14px] transition-all duration-200 cursor-pointer shadow-[0_4px_20px_rgba(124,58,237,0.3)] hover:scale-[1.01] hover:shadow-[0_8px_32px_rgba(124,58,237,0.45)]"
        >
          <span>Thanks You</span> {/*  &nbsp; &rarr; */}
        </button>

      </div>
    </div>
  );
};