/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect } from 'react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { StepProps } from '@/types/onboarding';
import { onboarding_mappings } from '@/configs/onboarding_mappings';

export const StepFiveSpend: React.FC<StepProps> = ({ onValidStateChange }) => {
  const { state, updateState }: any = useOnboarding();
  const entries = Object.entries(onboarding_mappings.monthly_fuel_spend);

  useEffect(() => {
    onValidStateChange(!!state.fuelSpend);
  }, [state.fuelSpend, onValidStateChange]);

  return (
    <div className="step-view active animation-[fadeIn_0.25s_ease]">
      <h2 className="text-[clamp(20px,2.5vw,28px)] font-extrabold text-[var(--ink)] tracking-[-0.04em] leading-[1.2] mb-[7px]">
        Average monthly fuel spend
      </h2>
      <p className="text-[14px] text-[var(--ink3)] leading-[1.7] mb-[24px]">
        Your approximate procurement expenditure per month across all branches.
      </p>

      <div className="flex flex-col gap-2">
        {entries.map(([key, val]:any) => {
          const isSelected = state.fuelSpend === key;
          return (
            <div
              key={key}
              onClick={() => updateState({ fuelSpend: key, spendLabel: val.label, spendCalcValueUsd: val.calc_value_usd })}
              className={`p-[14px] rounded-[var(--r)]  bg-[var(--card-bg)] flex items-center gap-[16px] transition-all duration-[180ms] cursor-pointer group hover:bg-[var(--card-h)] hover:border-[var(--pur2)] ${
                isSelected ? 'border-2 border-[var(--pur)] bg-[var(--card-h)] shadow-[var(--sh)]' : 'border-[var(--bd2)] border-[1.5px]'
              }`}
            >
              <div className={`w-[18px] h-[18px] rounded-full border-[1.5px] flex items-center justify-center shrink-0 transition-all duration-[160ms] ${
                isSelected ? 'border-[var(--pur)] bg-[var(--pur)]' : 'border-[var(--ink4)] group-hover:border-[var(--pur2)]'
              }`}>
                {isSelected && <div className="w-[6px] h-[6px] rounded-full bg-white" />}
              </div>
			  <div className="flex-1 min-w-0">
                <div className="text-[14px] font-bold text-[var(--ink)] tracking-[-0.01em]">
                  {val.label}
                </div>
                <div className="text-[12px] text-[var(--ink3)] font-normal leading-[1.4] mt-[2px]">
                  {val.desc}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};