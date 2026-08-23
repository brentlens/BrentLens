/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect, useMemo } from 'react';
import { StepProps } from '@/types/onboarding';
import { onboarding_mappings } from '@/configs/onboarding_mappings';
import { usePreRegistration } from '@/contexts/PreRegOnboardingContext';



export const StepThreeSubscription: React.FC<StepProps> = ({ onValidStateChange }) => {
  const { state, updateState }: any = usePreRegistration();

  // Memoize entries so the array reference stays stable across re-renders
  const entries = useMemo(
    () => Object.entries(onboarding_mappings.pre_reg_subscription),
    []
  );

  // Read saved plan key from sessionStorage on mount and sync to context
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const storedPlanKey = sessionStorage.getItem('selectedPlan');
    if (!storedPlanKey) return;

    const normalizedKey = storedPlanKey.trim().toLowerCase();
    const matchedEntry = entries.find(([key]) => key.toLowerCase() === normalizedKey);

    if (matchedEntry) {
      const [key, val]: [string, any] = matchedEntry;

      // Only update state if the plan is different from what's currently stored
      if (state.preferredPlan !== key) {
        updateState({
          preferredPlan: key,
          planLabel: val.label,
          planAmount: val.amount,
        });
      }
    }

    // Clean up storage key
    sessionStorage.removeItem('selectedPlan');
  }, [entries, state.preferredPlan, updateState]);

  // Sync step validation status
  useEffect(() => {
    onValidStateChange(!!state.preferredPlan);
  }, [state.preferredPlan, onValidStateChange]);

  const selectPlan = (key: string, val: any) => {
    updateState({ 
      preferredPlan: key, 
      planLabel: val.label,
      planAmount: val.amount 
    });
  };
  return (
    <div className="step-view active animation-[fadeIn_0.25s_ease]">
      {/* Heading Title */}
      <h2 className="text-[clamp(20px,2.5vw,28px)] font-extrabold text-[var(--ink)] tracking-[-0.04em] leading-[1.2] mb-[7px]">
        Lock in your founding rate
      </h2>
      {/* Subdescription text */}
      <p className="text-[14px] text-[var(--ink3)] leading-[1.7] mb-[24px]">
        All plans start with a 14-day free trial. No credit card required. Your rate is locked for life from the moment you sign up.
      </p>
	  {/* Static Bottom 14-day Free Trial Notice Accent Strip */}
        <div className="w-full flex items-center gap-[10px] p-[12px_16px] rounded-[var(--r2)] border border-[rgba(16,185,129,0.25)] bg-[rgba(16,185,129,0.06)] mb-[10px]">
          <svg className="w-[16px] h-[16px] text-[var(--green)] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <span className="text-[12px] font-normal text-[var(--green)] leading-tight">
            14-day free trial with full Pro access starts now — regardless of which plan you choose.
          </span>
        </div>

      {/* Grid 1-Column Row Container */}
      <div className="flex flex-col gap-[14px] relative">
        {entries.map(([key, val]: any) => {
          const isSelected = state.preferredPlan === key;
          
          return (
            <div key={key} className="relative w-full overflow-hidden">
              {/* Most Popular Badge Indicator */}
              {val.most_popular && (
                <div className="absolute top-3 -right-16 -translate-x-1/2 -translate-y-1/2 z-20">
                  <div className="bg-gradient-to-r from-[var(--pur)] to-[#55d7ff] text-white text-[10px] font-bold uppercase tracking-[0.08em] px-[12px] py-[3px] rounded-b-lg rounded-r-lg shadow-sm">
                    Most Popular
                  </div>
                </div>
              )}

              {/* Core Clickable Option Container Card */}
              <div
                onClick={() => selectPlan(key, val)}
                className={`p-[20px] rounded-[var(--r)] flex items-start gap-[16px] transition-all duration-[180ms] cursor-pointer group hover:bg-[var(--card-h)] hover:border-[var(--pur2)] ${
                  isSelected 
                    ? 'border-2 border-[var(--pur)] bg-[var(--card-h)] shadow-[var(--sh)]' 
                    : 'border-[var(--bd2)] border-[1.5px] bg-[var(--card-bg)]'
                }`}
              >
                {/* Radio Node Selector Ring */}
                <div className={`w-[18px] h-[18px] rounded-full border-[1.5px] flex items-center justify-center shrink-0 mt-[2px] transition-all duration-[160ms] ${
                  isSelected ? 'border-[var(--pur)] bg-[var(--pur)]' : 'border-[var(--ink4)] group-hover:border-[var(--pur2)]'
                }`}>
                  {isSelected && <div className="w-[6px] h-[6px] rounded-full bg-white" />}
                </div>

                {/* Main Copy Context Block */}
                <div className="flex-1 min-w-0 space-y-[8px]">
                  {/* Row Header: Title & Amount Pricing Layout */}
                  <div className="flex items-center justify-between w-full">
                    <div className="text-[16px] font-bold text-[var(--ink)] tracking-[-0.01em]">
                      {val.label}
                    </div>
                    {val.amount !== null ? (
                      <div className="text-[14px] font-bold text-[var(--ink3)]">
                        <span className="text-[var(--pur)] text-[16px] font-extrabold">${val.amount}</span>
                        <span className="text-[12px] text-[var(--ink3)] font-medium">/mo</span>
                      </div>
                    ) : (
                      <div className="text-[12px] text-[var(--ink3)] font-bold uppercase tracking-wider bg-[var(--surf)] px-2 py-0.5 rounded border border-[var(--bd)]">
                        Trial
                      </div>
                    )}
                  </div>

                  {/* Description Copy */}
                  <div className="text-[13px] text-[var(--ink3)] font-normal reply-text leading-[1.6]">
                    {val.desc}
                  </div>

                  {/* Feature Pill Tags Mapping Layer */}
                  {val.features && val.features.length > 0 && (
                    <div className="flex flex-wrap gap-[6px] pt-[4px]">
                      {val.features.map((feat: string, fIdx: number) => (
                        <span 
                          key={fIdx}
                          className={`text-[11px] font-bold px-[8px] py-[3px] rounded-[6px] border ${
                            isSelected 
                              ? 'bg-[var(--ps)] text-[var(--pur2)] border-[var(--pm)]' 
                              : 'bg-[var(--surf)] text-[var(--ink2)] border-[var(--bd)]'
                          }`}
                        >
                          {feat}
                        </span>
                      ))}
                    </div>
                  )}
				  {(val.originalPriceText || val.savingsText) && (
					<div className="flex items-center gap-2 pt-1 text-xs">
					{val.originalPriceText && (
						<span className="text-[#475569] line-through font-normal">
						{val.originalPriceText}
						</span>
					)}
					{val.savingsText && (
						<span className="bg-[#ffedd5] text-[#d97706] border border-[#fed7aa] font-bold px-2 py-0.5 rounded text-[11px]">
						{val.savingsText}
						</span>
					)}
					</div>
				)}
                </div>
              </div>
            </div>
          );
        })}
        
		<div className='w-full text-center text-sm text-gray-400'>Your founding rate is locked from the moment you confirm — not from when you start paying.</div>
        
      </div>
    </div>
  );
};