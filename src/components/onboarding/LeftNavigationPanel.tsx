'use client';

import React from 'react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Check } from 'lucide-react';

const stepsMeta = [
  { step: 1, name: 'Account' },
  { step: 2, name: 'Industry' },
  { step: 3, name: 'Country' },
  { step: 4, name: 'Operation Scale' },
  { step: 5, name: 'Fuel Spend' },
  { step: 6, name: 'Fuel Exposure' },
  { step: 7, name: 'Planning Horizon' },
  { step: 8, name: 'Purchase Strategy' },
  { step: 9, name: 'Primary Goal' },
  { step: 10, name: 'Plan Interest' },
];

export const LeftNavigationPanel: React.FC = () => {
  const { state } = useOnboarding();

return (
    <aside 
      className="w-[280px] border-r flex flex-col justify-between p-[28px_24px] shrink-0 h-screen select-none relative overflow-hidden transition-all duration-300 before:content-[''] before:absolute before:top-[-80px] before:left-[-80px] before:w-[300px] before:h-[300px] before:rounded-full before:bg-[rgba(124,58,237,0.1)] before:blur-[80px] before:pointer-events-none after:content-[''] after:absolute after:bottom-[-60px] after:right-[-60px] after:w-[200px] after:h-[200px] after:rounded-full after:bg-[rgba(6,182,212,0.07)] after:blur-[60px] after:pointer-events-none"
      style={{
        background: 'var(--left-bg)',
        borderColor: 'var(--bd)',
      }}
    >
      {/* Top and Middle Content Wrapper Layout Grid */}
      <div className="flex flex-col flex-1 min-h-0 z-[2] relative">
        {/* Brand System Header */}
        <div className="flex items-center gap-0 mb-[32px] shrink-0">
          <img 
            src="/assets/landingPage/landing_logo.png"
            alt="BrentLens" 
            id="nav-logo" 
            className="h-[44px] w-auto block"
          />
        </div>

        {/* Tagline section */}
        <div className="mb-[28px] shrink-0">
          <p 
            className="text-[11px] font-semibold uppercase tracking-[0.08em]"
            style={{
              fontFamily: 'var(--S)',
              color: 'var(--ink3)'
            }}
          >
            Impact Intelligence
          </p>
        </div>

        {/* Isolated Middle Section Scroller Layer */}
        <nav className="flex flex-col gap-[4px] flex-1 overflow-y-auto scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {stepsMeta.map((s) => {
            const isDone = state.step > s.step;
            const isActive = state.step === s.step;

            let itemBg = 'transparent';
            if (isActive) itemBg = 'var(--step-active-bg)';
            else if (isDone) itemBg = 'var(--step-done-bg)';

            return (
              <div 
                key={s.step} 
                className="flex items-center gap-[10px] p-[9px_10px] rounded-[var(--r2)] transition-all duration-[160ms] border border-transparent"
                style={{ background: itemBg }}
              >
                {/* Number Circle or Checkmark */}
                <div 
                  className="w-[26px] h-[26px] rounded-full flex items-center justify-center font-bold text-[11px] shrink-0 transition-all duration-200 border"
                  style={{
                    fontFamily: 'var(--S)',
                    background: isActive ? 'var(--grad2)' : (isDone ? 'var(--green)' : 'var(--surf2)'),
                    borderColor: (isActive || isDone) ? 'transparent' : 'var(--bd)',
                    color: (isActive || isDone) ? '#ffffff' : 'var(--ink3)',
                    boxShadow: isActive ? '0 2px 8px rgba(124,58,237,0.4)' : 'none'
                  }}
                >
                  {isDone ? <Check className="w-[11px] h-[11px] stroke-[3]" /> : s.step}
                </div>

                {/* Text Section */}
                <div className="min-w-0 flex items-center flex-1">
                  <div 
                    className="text-[12px] truncate transition-all duration-[160ms] leading-[1.3]"
                    style={{
                      fontWeight: isActive ? 600 : 500,
                      color: isActive ? 'var(--ink)' : (isDone ? 'var(--ink3)' : 'var(--ink4)')
                    }}
                  >
                    {s.name}
                  </div>
                  
                </div>
              </div>
            );
          })}
        </nav>
      </div>

      {/* Trust & Footnote Component Fixed To Bottom */}
      <div 
        className="mt-[20px] pt-[16px] border-t z-[2] relative shrink-0"
        style={{ borderColor: 'var(--bd)' }}
      >
        <span 
          className="text-[11px] leading-[1.5] block font-normal"
          style={{
            fontFamily: 'var(--S)',
            color: 'var(--ink3)'
          }}
        >
          10 steps to your personalised fuel cost intelligence dashboard.
        </span>
      </div>
    </aside>
  );
};