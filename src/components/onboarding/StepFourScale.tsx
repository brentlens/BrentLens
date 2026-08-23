/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect } from 'react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { StepProps } from '@/types/onboarding';
import { onboarding_mappings } from '@/configs/onboarding_mappings';

export const StepFourScale: React.FC<StepProps> = ({ onValidStateChange }) => {
  const { state, updateState }: any = useOnboarding();
  const currentIndustry = state.industry;
  
  // Safely retrieve the nested object mapping structure
  const mappedOptions = onboarding_mappings.fleet_size[currentIndustry as keyof typeof onboarding_mappings.fleet_size] || onboarding_mappings.fleet_size.logistics;
  
  // Create entries array explicitly from the nested opts object
  const entries = Object.entries(mappedOptions.opts || {});

  useEffect(() => {
    onValidStateChange(!!state.scale);
  }, [state.scale, onValidStateChange]);

  const selectScale = (key: string, val: any) => {
    updateState({
      scale: key,
      scaleLabel: val.label,
      scaleCalcValue: val.calc_value,
      scaleMultiplier: val.scale_multiplier,
      scaleMonthlyLitres: val.monthly_litres
    });
  };

  return (
    <div className="step-view active animation-[fadeIn_0.25s_ease]">
      {/* Dynamic Title */}
      <h2 className="text-[clamp(20px,2.5vw,28px)] font-extrabold text-[var(--ink)] tracking-[-0.04em] leading-[1.2] mb-[7px]">
        {mappedOptions.title}
      </h2>
      
      {/* Dynamic Subtitle */}
      <p className="text-[14px] text-[var(--ink3)] leading-[1.7] mb-[24px]">
        {mappedOptions.sub}
      </p>

      {/* Dynamic Option Cards List */}
      <div className="flex flex-col gap-2">
        {entries.map(([key, val]: any) => {
          const isSelected = state.scale === key;
          return (
            <div
              key={key}
              onClick={() => selectScale(key, val)}
              className={`p-[14px] rounded-[var(--r)]  bg-[var(--card-bg)] flex items-center gap-[16px] transition-all duration-[180ms] cursor-pointer group hover:bg-[var(--card-h)] hover:border-[var(--pur2)] ${
                isSelected ? 'border-2 bg-[var(--card-h)] border-[var(--pur)] shadow-[var(--sh)]' : 'border-[var(--bd2)] border-[1.5px]'
              }`}
            >
              {/* Radio Node Ring */}
              <div className={`w-[18px] h-[18px] rounded-full border-[1.5px] flex items-center justify-center shrink-0 transition-all duration-[160ms] ${
                isSelected ? 'border-[var(--pur)] bg-[var(--pur)]' : 'border-[var(--ink4)] group-hover:border-[var(--pur2)]'
              }`}>
                {isSelected && <div className="w-[6px] h-[6px] rounded-full bg-white" />}
              </div>

              {/* Text Descriptor Group */}
              <div className="flex-1 min-w-0">
                <div className="text-[14px] font-bold text-[var(--ink)] tracking-[-0.01em]">
                  {val.label}
                </div>
                <div className="text-[12px] text-[var(--ink3)] font-normal leading-[1.4] mt-[2px]">
                  {val.desc}
                </div>
              </div>

              {/* Badge Selection Pin */}
              {/* <span className={`text-[10px] font-bold uppercase tracking-wider p-[3px_8px] rounded-[6px] transition-all duration-[160ms] ${
                isSelected ? 'bg-[var(--ps)] text-[var(--pur2)] opacity-100' : 'opacity-0'
              }`}>
                Selected
              </span> */}
            </div>
          );
        })}
      </div>
    </div>
  );
};