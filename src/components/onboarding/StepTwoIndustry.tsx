/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect } from 'react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { StepProps } from '@/types/onboarding';

const options = [
  { 
    id: 'logistics', 
    label: 'Logistics', 
    desc: 'Fleet operations, freight, delivery',
    iconPath: <svg viewBox="0 0 40 40" fill="none"><rect x="1" y="13" width="22" height="15" rx="2" stroke="url(#og1)" strokeWidth="1.8"/><path d="M23 18h8l5 6v4H23V18z" stroke="url(#og1)" strokeWidth="1.8" strokeLinecap="round"/><circle cx="8" cy="30" r="3" stroke="url(#og1)" strokeWidth="1.8"/><circle cx="31" cy="30" r="3" stroke="url(#og1)" strokeWidth="1.8"/><defs><linearGradient id="og1" x1="1" y1="13" x2="38" y2="33" gradientUnits="userSpaceOnUse"><stop stopColor="#7C3AED"/><stop offset=".55" stopColor="#4F46E5"/><stop offset="1" stopColor="#06B6D4"/></linearGradient></defs></svg>
  },
  { 
    id: 'maritime', 
    label: 'Maritime', 
    desc: 'Vessels, ports, offshore operations',
    iconPath: <svg viewBox="0 0 40 40" fill="none"><path d="M6 25l4-12h20l4 12H6z" stroke="url(#og2)" strokeWidth="1.8" strokeLinecap="round"/><path d="M16 13V7h8v6" stroke="url(#og2)" strokeWidth="1.8" strokeLinecap="round"/><path d="M3 30c3 0 3-3 6-3s3 3 6 3 3-3 6-3 3 3 6 3" stroke="url(#og2)" strokeWidth="1.8" strokeLinecap="round"/><defs><linearGradient id="og2" x1="3" y1="7" x2="37" y2="33" gradientUnits="userSpaceOnUse"><stop stopColor="#7C3AED"/><stop offset=".55" stopColor="#4F46E5"/><stop offset="1" stopColor="#06B6D4"/></linearGradient></defs></svg>
  },
  { 
    id: 'manufacturing', 
    label: 'Manufacturing', 
    desc: 'Industrial production, factories',
    iconPath: <svg viewBox="0 0 40 40" fill="none"><rect x="3" y="17" width="34" height="18" rx="2" stroke="url(#og3)" strokeWidth="1.8"/><path d="M3 22l8-6 8 6 8-6 8 6" stroke="url(#og3)" strokeWidth="1.8" strokeLinecap="round" /><path d="M13 17V12a7 7 0 0114 0v5" stroke="url(#og3)" strokeWidth="1.8"/><rect x="16" y="27" width="8" height="8" rx="1" stroke="url(#og3)" strokeWidth="1.8"/><defs><linearGradient id="og3" x1="3" y1="5" x2="37" y2="35" gradientUnits="userSpaceOnUse"><stop stopColor="#7C3AED"/><stop offset=".55" stopColor="#4F46E5"/><stop offset="1" stopColor="#06B6D4"/></linearGradient></defs></svg>
  },
  { 
    id: 'construction', 
    label: 'Construction', 
    desc: 'Heavy plant, civil engineering',
    iconPath: <svg viewBox="0 0 40 40" fill="none"><path d="M7 35V17l13-13 13 13v18" stroke="url(#og4)" strokeWidth="1.8" strokeLinecap="round"/><rect x="13" y="24" width="14" height="11" stroke="url(#og4)" strokeWidth="1.8"/><path d="M3 35h34" stroke="url(#og4)" strokeWidth="1.8" strokeLinecap="round"/><path d="M30 11l6 4M30 17V9h4" stroke="url(#og4)" strokeWidth="1.8" strokeLinecap="round" /><defs><linearGradient id="og4" x1="3" y1="4" x2="37" y2="36" gradientUnits="userSpaceOnUse"><stop stopColor="#7C3AED"/><stop offset=".55" stopColor="#4F46E5"/><stop offset="1" stopColor="#06B6D4"/></linearGradient></defs></svg>
  },
  { 
    id: 'agribusiness', 
    label: 'Agribusiness', 
    desc: 'Farming, agriculture, food supply',
    iconPath: <svg viewBox="0 0 40 40" fill="none"><circle cx="14" cy="28" r="7" stroke="url(#og5)" strokeWidth="1.8"/><circle cx="30" cy="30" r="4" stroke="url(#og5)" strokeWidth="1.8"/><path d="M21 28h5M14 21V14M7 13c3-7 15-7 15 0M14 13c0-3 5-9 12-9" stroke="url(#og5)" strokeWidth="1.8" strokeLinecap="round"/><defs><linearGradient id="og5" x1="7" y1="4" x2="34" y2="34" gradientUnits="userSpaceOnUse"><stop stopColor="#7C3AED"/><stop offset=".55" stopColor="#4F46E5"/><stop offset="1" stopColor="#06B6D4"/></linearGradient></defs></svg>
  },
  { 
    id: 'aviation', 
    label: 'Aviation', 
    desc: 'Airlines, cargo, charter operators',
    iconPath: <svg viewBox="0 0 40 40" fill="none"><path d="M4 23l7-7 5 1.5 12-14 4 4-14 12 1.5 5-7 7-1.5-7-7-1.5z" stroke="url(#og6)" strokeWidth="1.8" strokeLinecap="round"/><path d="M15 26l-4 4M22 22l4-4" stroke="url(#og6)" strokeWidth="1.8" strokeLinecap="round"/><defs><linearGradient id="og6" x1="4" y1="4" x2="36" y2="36" gradientUnits="userSpaceOnUse"><stop stopColor="#7C3AED"/><stop offset=".55" stopColor="#4F46E5"/><stop offset="1" stopColor="#06B6D4"/></linearGradient></defs></svg>
  },
];

export const StepTwoIndustry: React.FC<StepProps> = ({ onValidStateChange }) => {
  const { state, updateState }: any = useOnboarding();

  useEffect(() => {
    onValidStateChange(!!state.industry);
  }, [state.industry, onValidStateChange]);

  const selectIndustry = (id: string, label: string) => {
    updateState({ 
      industry: id, 
      industryLabel: label
    });
  };

  return (
    <div className="step-view active animation-[fadeIn_0.25s_ease]">
      <h2 className="text-[clamp(20px,2.5vw,28px)] font-extrabold text-[var(--ink)] tracking-[-0.04em] leading-[1.2] mb-[7px]">
        Select your industry
      </h2>
      <p className="text-[14px] text-[var(--ink3)] leading-[1.7] mb-[24px]">
        This tailors your dynamic market pass-through tracking algorithms.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-[14px]">
        {options.map((o) => {
          const isSelected = state.industry === o.id;
          return (
            <button
              key={o.id}
              type="button"
              onClick={() => selectIndustry(o.id, o.label)}
              className={`text-left p-[20px] rounded-[var(--r)]  bg-[var(--card-bg)] transition-all duration-[180ms] cursor-pointer flex flex-col  hover:bg-[var(--card-h)] hover:border-[var(--pur2)] hover:-translate-y-[1px] hover:shadow-[var(--sh)] ${
                isSelected ? 'border-2 border-[var(--pur)] shadow-[var(--sh)] bg-[var(--card-h)]' : 'border-[1.5px] border-[var(--bd2)]'
              }`}
            >
              {/* Flex Header Header Containing SVG Anchor Node */}
              
                <div className={`w-[40px] h-[40px] flex items-center justify-center shrink-0  transition-colors duration-200  mb-4 `}>
                  {o.iconPath}
                </div>
                <div className="text-[15px] font-bold text-[var(--ink)] tracking-[-0.02em] leading-[1.3] flex-1">
                  {o.label}
                </div>

              {/* Description Context Row */}
              <div className="text-[12px] text-[var(--ink3)] font-normal leading-[1.5]">
                {o.desc}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};