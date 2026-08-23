/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { ChevronDown, Truck, Plane, Ship, Factory, HardHat, Sprout } from "lucide-react";
import { COUNTRIES } from "@/configs/countries";


type CountryCode = keyof typeof COUNTRIES;

interface IndustryConfig {
  id: string;
  label: string;
  desc: string;
  icon: React.ReactNode;
  sensitivity: number;
  lag_adjustment_days: number;
}

const INDUSTRY_OPTIONS: IndustryConfig[] = [
  {
    id: "logistics",
    label: "Logistics & Freight",
    desc: "Road freight, fleet management, and distribution operations.",
    icon: <Truck className="w-6 h-6 stroke-[1.8]" />,
    sensitivity: 0.92,
    lag_adjustment_days: 0,
  },
  {
    id: "aviation",
    label: "Aviation",
    desc: "Commercial airlines, cargo charters, and ground handlers.",
    icon: <Plane className="w-6 h-6 stroke-[1.8]" />,
    sensitivity: 0.97,
    lag_adjustment_days: -1,
  },
  {
    id: "maritime",
    label: "Maritime Shipping",
    desc: "Container shipping, bulk transport, and marine operations.",
    icon: <Ship className="w-6 h-6 stroke-[1.8]" />,
    sensitivity: 0.88,
    lag_adjustment_days: 3,
  },
  {
    id: "manufacturing",
    label: "Manufacturing",
    desc: "Industrial processing, equipment operation, and heavy plant.",
    icon: <Factory className="w-6 h-6 stroke-[1.8]" />,
    sensitivity: 0.74,
    lag_adjustment_days: 2,
  },
  {
    id: "construction",
    label: "Construction",
    desc: "Heavy machinery, earthmoving, and site infrastructure.",
    icon: <HardHat className="w-6 h-6 stroke-[1.8]" />,
    sensitivity: 0.71,
    lag_adjustment_days: 1,
  },
  {
    id: "agribusiness",
    label: "Agribusiness",
    desc: "Large-scale harvesting, irrigation, and processing.",
    icon: <Sprout className="w-6 h-6 stroke-[1.8]" />,
    sensitivity: 0.68,
    lag_adjustment_days: 2,
  },
];

const MONTHLY_FUEL_SPEND = {
  "<50k": { calc_value_usd: 30000, label: "Less than $50,000" },
  "50-250k": { calc_value_usd: 125000, label: "$50,000 – $250,000" },
  "250k-1m": { calc_value_usd: 500000, label: "$250,000 – $1,000,000" },
  "1m-5m": { calc_value_usd: 2500000, label: "$1M – $5M" },
  "5m+": { calc_value_usd: 7500000, label: "$5M+" },
};

export default function DemoScenarioPlanner() {
  const [industry, setIndustry] = useState<string>("logistics");
  const [country, setCountry] = useState<CountryCode>("DE");
  const [fuelSpendKey, setFuelSpendKey] = useState<string>("50-250k");
  const [spendValue, setSpendValue] = useState<number>(125000);
  const [brentPrice, setBrentPrice] = useState<number>(94);

  // Dynamic configuration lookups
  const countryConfig = COUNTRIES[country] ?? COUNTRIES.DEFAULT;
  const sectorConfig =
    INDUSTRY_OPTIONS.find((item) => item.id === industry) ?? INDUSTRY_OPTIONS[0];

  // Parameters & Lag Calculation
  const baselineBrent = 87.42;
  const pt = countryConfig.pass_through_rate;
  const sens = sectorConfig.sensitivity;
  const impactLag = countryConfig.lag_midpoint_days + sectorConfig.lag_adjustment_days;

  // Impact Calculations
  const rawImpact = spendValue * ((brentPrice - baselineBrent) / baselineBrent) * pt * sens;
  const userImpact = Math.round(rawImpact / 100) * 100;
  const budgetBefore = spendValue;
  const userBudgetRevision = budgetBefore + userImpact;
  const userAnnualised = userImpact * 12;

  const handleSpendChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const key = e.target.value;
    setFuelSpendKey(key);
    const item = MONTHLY_FUEL_SPEND[key as keyof typeof MONTHLY_FUEL_SPEND];
    setSpendValue(item ? item.calc_value_usd : 125000);
  };

  const getSignalMessage = (price: number) => {
    if (price >= 105) {
      return "Critical cost risk. Implement emergency hedging, activate high fuel surcharges (8-12%), and mandate immediate executive review.";
    }
    if (price >= 95) {
      return "Increase fuel surcharge by 5-7%. Add emergency budget reserve. Brief executive team.";
    }
    if (price >= 88) {
      return "Increase fuel surcharge 3-5%. Add budget reserve. Review expiring contracts immediately.";
    }
    return "Favourable conditions vs baseline. Maintain regular hedging policy and monitor 30-day moving average.";
  };

  const formatCurrency = (val: number, showSign: boolean = true) => {
    const sign = val >= 0 ? "+" : "";
    const formatted = Math.abs(val).toLocaleString("en-US");
    return showSign ? `${sign}$${formatted}` : `$${formatted}`;
  };

  return (
    <div className="w-full max-w-6xl mx-auto font-sans antialiased px-4 sm:px-6 pt-12">
      {/* Full Width Section Header */}
      <div className="w-full text-center max-w-4xl mx-auto mb-12">
        <span className="text-[12px] font-extrabold uppercase tracking-[0.14em] text-indigo-600 block mb-3">
          SCENARIO PLANNER DEMO
        </span>

        <h2 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-[1.15] mb-4">
          Stress-test your fuel exposure &mdash; before the market moves.
        </h2>

        <p className="text-base sm:text-lg text-slate-500 font-normal leading-relaxed max-w-2xl mx-auto">
          Model different Brent price scenarios to see immediate cost impact, budget revisions, and recommended action signals.
        </p>
      </div>

      {/* Main 2-Column Grid Layout */}
      <div className="w-full max-w-6xl mx-auto font-sans antialiased grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT PANEL: User Selections */}
        <div className="lg:col-span-7 space-y-6">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-3">
              Select Your Industry
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {INDUSTRY_OPTIONS.map((o) => {
                const isSelected = industry === o.id;
                return (
                  <button
                    key={o.id}
                    type="button"
                    onClick={() => setIndustry(o.id)}
                    className={`text-left p-4 rounded-xl border bg-white transition-all duration-150 cursor-pointer flex flex-col hover:border-purple-500 hover:shadow-sm ${
                      isSelected
                        ? "border-2 border-purple-600 bg-purple-50/20 shadow-sm"
                        : "border-slate-200"
                    }`}
                  >
                    <div className="w-8 h-8 flex items-center justify-center shrink-0 mb-2.5 text-purple-600">
                      {o.icon}
                    </div>
                    <div className="text-sm font-bold text-slate-900 leading-snug">
                      {o.label}
                    </div>
                    <div className="text-xs text-slate-500 font-normal mt-1 leading-relaxed">
                      {o.desc}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dropdown Selects */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {/* Country Select */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Your country
              </label>
              <div className="relative">
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value as CountryCode)}
                  className="w-full appearance-none bg-white border border-slate-200 rounded-lg py-3 px-4 pr-10 text-slate-800 text-sm focus:outline-none focus:border-purple-500 transition-colors cursor-pointer"
                >
                  {Object.entries(COUNTRIES).map(([code, item]) => (
                    <option key={code} value={code}>
                      {item.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>

            {/* Spend Select */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Monthly fuel spend
              </label>
              <div className="relative">
                <select
                  value={fuelSpendKey}
                  onChange={handleSpendChange}
                  className="w-full appearance-none bg-white border border-slate-200 rounded-lg py-3 px-4 pr-10 text-slate-800 text-sm focus:outline-none focus:border-purple-500 transition-colors cursor-pointer"
                >
                  {Object.entries(MONTHLY_FUEL_SPEND).map(([key, item]) => (
                    <option key={key} value={key}>
                      {item.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: Live Calculation Slider Card */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-7 border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
          <div className="mb-2">
            <span className="inline-block bg-indigo-600 text-white text-[12px] font-bold px-2 py-0.5 rounded tracking-wide">
              Modelled Brent Price
            </span>
            <div className="text-5xl font-black text-indigo-600 tracking-tight mt-1">
              ${brentPrice.toFixed(2)}
            </div>
          </div>

          {/* Range Slider Control */}
          <div className="my-5">
            <input
              type="range"
              min="60"
              max="130"
              step="1"
              value={brentPrice}
              onChange={(e) => setBrentPrice(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 focus:outline-none"
            />
            <div className="flex justify-between text-xs font-semibold text-slate-400 mt-2">
              <span>$60</span>
              <span>$95</span>
              <span>$130</span>
            </div>
          </div>

          <div className="h-px bg-slate-100 w-full mb-5" />

          {/* Impact Box */}
          <div className="bg-rose-50 border border-rose-200/70 rounded-2xl p-5 text-center mb-6">
            <div className="text-[11px] font-extrabold uppercase tracking-wider text-rose-500 mb-1">
              Your Additional Cost
            </div>
            <div className="text-4xl font-black text-rose-500 tracking-tight">
              {formatCurrency(userImpact)}
            </div>
          </div>

          {/* Metrics List */}
          <div className="space-y-3 text-sm mb-6">
            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium">Budget before</span>
              <span className="font-extrabold text-slate-900">
                {formatCurrency(budgetBefore, false)}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium">Budget after</span>
              <span
                className={`font-extrabold ${
                  userBudgetRevision > budgetBefore ? "text-rose-500" : "text-emerald-600"
                }`}
              >
                {formatCurrency(userBudgetRevision, false)}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium">Time to impact</span>
              <span className="font-extrabold text-slate-900">
                {impactLag} {impactLag === 1 ? "day" : "days"}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-slate-500 font-medium">Annualised</span>
              <span
                className={`font-extrabold ${
                  userAnnualised >= 0 ? "text-rose-500" : "text-emerald-600"
                }`}
              >
                {formatCurrency(userAnnualised)}
              </span>
            </div>
          </div>

          {/* Recommendation Note */}
          <div className="bg-rose-50/80 border border-rose-200/60 rounded-xl p-3.5 text-xs text-rose-600 leading-relaxed font-medium">
            {getSignalMessage(brentPrice)}
          </div>
        </div>
      </div>
    </div>
  );
}