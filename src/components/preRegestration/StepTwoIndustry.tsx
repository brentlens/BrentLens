/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect, useState } from 'react';
import { StepProps } from '@/types/onboarding';
import { usePreRegistration } from '@/contexts/PreRegOnboardingContext';
import { ChevronDown, Factory, HardHat, Plane, Ship, Sprout, Truck } from 'lucide-react';
import { onboarding_mappings } from '@/configs/onboarding_mappings';

const options = [
  { 
    id: 'logistics', 
    label: 'Logistics', 
    desc: 'Fleet operations, freight, delivery',
    icon: <Truck className="w-[44px] h-[44px] text-[#4F46E5] stroke-[1.8]" />,
  },
  { 
    id: 'maritime', 
    label: 'Maritime', 
    desc: 'Vessels, ports, offshore operations',
    icon: <Ship className="w-[44px] h-[44px] text-[#4F46E5] stroke-[1.8]" />,
  },
  { 
    id: 'manufacturing', 
    label: 'Manufacturing', 
    desc: 'Industrial production, factories',
    icon: <Factory className="w-[44px] h-[44px] text-[#4F46E5] stroke-[1.8]" />,
  },
  { 
    id: 'construction', 
    label: 'Construction', 
    desc: 'Heavy plant, civil engineering',
    icon: <HardHat className="w-[44px] h-[44px] text-[#4F46E5] stroke-[1.8]" />,
  },
  { 
    id: 'agribusiness', 
    label: 'Agribusiness', 
    desc: 'Farming, agriculture, food supply',
    icon: <Sprout className="w-[44px] h-[44px] text-[#4F46E5] stroke-[1.8]" />,
  },
  { 
    id: 'aviation', 
    label: 'Aviation', 
    desc: 'Airlines, cargo, charter operators',
    icon: <Plane className="w-[44px] h-[44px] text-[#4F46E5] stroke-[1.8]" />,
  },
];
const PASS_THROUGH: Record<string, number> = {
  DE: 0.78,
  GB: 0.82,
  FR: 0.74,
  NL: 0.8,
  PL: 0.76,
  ES: 0.72,
  IT: 0.7,
  US: 0.88,
  CA: 0.85,
  AU: 0.86,
  SA: 0.35,
  AE: 0.62,
  IN: 0.68,
  SG: 0.91,
  JP: 0.8,
  KR: 0.79,
  BR: 0.73,
  ZA: 0.77,
  DEFAULT: 0.75,
};

const COUNTRY_OPTIONS = [
  { code: "DE", name: "Germany" },
  { code: "GB", name: "United Kingdom" },
  { code: "FR", name: "France" },
  { code: "NL", name: "Netherlands" },
  { code: "PL", name: "Poland" },
  { code: "ES", name: "Spain" },
  { code: "IT", name: "Italy" },
  { code: "US", name: "United States" },
  { code: "CA", name: "Canada" },
  { code: "AU", name: "Australia" },
  { code: "SA", name: "Saudi Arabia" },
  { code: "AE", name: "UAE" },
  { code: "IN", name: "India" },
  { code: "SG", name: "Singapore" },
  { code: "JP", name: "Japan" },
  { code: "KR", name: "South Korea" },
  { code: "BR", name: "Brazil" },
  { code: "ZA", name: "South Africa" },
  { code: "DEFAULT", name: "Other" },
];

const SENSITIVITY: Record<string, number> = {
  logistics: 0.92,
  aviation: 0.97,
  maritime: 0.88,
  manufacturing: 0.74,
  construction: 0.71,
  agribusiness: 0.68,
};

// Eurozone country codes for currency formatting
const EURO_COUNTRIES = new Set(['DE', 'FR', 'NL', 'PL', 'ES', 'IT']);

const BRENT_30D = 0.041
export const StepTwoIndustry: React.FC<StepProps> = ({ onValidStateChange }) => {
const { state, updateState }: any = usePreRegistration();
  const monthlyFuelSpendMapping = onboarding_mappings.monthly_fuel_spend;
  const entries = Object.entries(monthlyFuelSpendMapping);

  // Derive spend value directly from hydrated context state or local fallback
  const currentSpend = state.spendCalcValueUsd ?? 0;

  // Sync validation status
  useEffect(() => {
    onValidStateChange(!!(state.industry && state.country && state.fuelSpend));
  }, [state.industry, state.country, state.fuelSpend, onValidStateChange]);

  const selectIndustry = (id: string, label: string) => {
    updateState({ 
      industry: id, 
      industryLabel: label,
    });
  };

  const selectCountry = (code: string) => {
    const selectedCountry = COUNTRY_OPTIONS.find((c) => c.code === code);

    if (selectedCountry) {
      updateState({
        country: selectedCountry.code,
        countryLabel: selectedCountry.name,
      });
    }
  };

  const handleSpendChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedKey = e.target.value;
    const val = monthlyFuelSpendMapping[selectedKey];

    if (selectedKey && val) {
      updateState({
        fuelSpend: selectedKey,
        spendLabel: val.label,
        spendCalcValueUsd: val.calc_value_usd,
      });
    } else {
      updateState({
        fuelSpend: "",
        spendLabel: "Not set",
        spendCalcValueUsd: 0,
      });
    }
  };

  // Calculate estimated impact dynamically during render
  const calculateImpact = (): string => {
    // Check hydrated context state
    if (!state.industry || !state.country || !currentSpend || currentSpend <= 0) {
      return "";
    }

    const passThroughRate = PASS_THROUGH[state.country] ?? PASS_THROUGH.DEFAULT ?? 0.75;
    const sensitivity = SENSITIVITY[state.industry] ?? 0.75;

    // Round impact to nearest 100
    const rawImpact = currentSpend * BRENT_30D * passThroughRate * sensitivity;
    const impact = Math.round(rawImpact / 100) * 100;

    const sign = impact >= 0 ? '+' : '';
    const currencySymbol = EURO_COUNTRIES.has(state.country) ? '€' : '$';

    return `${sign}${currencySymbol}${Math.abs(impact).toLocaleString()}`;
  };

  // Re-computed on every render automatically whenever context rehydrates/updates
  const estimatedImpact = calculateImpact();
  return (
    <div className="step-view active animation-[fadeIn_0.25s_ease]">
      <h2 className="text-[clamp(20px,2.5vw,28px)] font-extrabold text-[var(--ink)] tracking-[-0.04em] leading-[1.2] mb-[7px]">
        Tell us about your operation
      </h2>
      <p className="text-[14px] text-[var(--ink3)] leading-[1.7] mb-[24px]">
        Three questions. These three inputs are all BrentLens needs to calculate your personalised cost number.
      </p>

      <div className="grid grid-cols-2 gap-[14px]">
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
                  {o.icon}
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
	  <div className="w-full py-6 font-sans antialiased text-slate-800">
      {/* Inputs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Country Select */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Your country <span className="text-red-500 ml-0.5" aria-hidden="true">*</span>
          </label>
          <div className="relative">
            <select
              value={state.country}
              onChange={(e) => {
				selectCountry(e.target.value);
			}}
              className="w-full appearance-none bg-white border border-slate-200 rounded-lg py-3 px-4 pr-10 text-slate-800 focus:outline-none focus:border-purple-500 transition-colors cursor-pointer"
            >
              <option value="">Select country</option>
              {COUNTRY_OPTIONS.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Spend Select */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Monthly fuel spend <span className="text-red-500 ml-0.5" aria-hidden="true">*</span>
          </label>
          <div className="relative">
           <select
				value={state.fuelSpend}
				onChange={handleSpendChange}
				className="w-full appearance-none bg-white border border-slate-200 rounded-lg py-3 px-4 pr-10 text-slate-800 focus:outline-none focus:border-purple-500 transition-colors cursor-pointer"
				>
				<option value="">Select range</option>
				{entries.map(([key, item]: [string, any]) => (
					<option key={key} value={key}>
					{item.label}
					</option>
				))}
			</select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Live Preview Box */}
      {estimatedImpact && (
        <div className="p-4 bg-purple-50/60 border border-purple-200 rounded-xl transition-all">
          <div className="text-[10px] font-extrabold uppercase tracking-widest text-purple-600 mb-1">
            Based on your inputs &mdash; estimated monthly cost impact
          </div>
          <div className="text-3xl font-black text-purple-700 tracking-tight">
            {estimatedImpact}
          </div>
          <div className="text-xs text-slate-500 mt-0.5">
            additional cost this month if Brent +4.1% (current 30D)
          </div>
        </div>
      )}
    </div>
    </div>
  );
};