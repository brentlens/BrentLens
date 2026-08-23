'use client';

import React from 'react';
import { Check } from 'lucide-react';
import { usePreRegistration } from '@/contexts/PreRegOnboardingContext';

const stepsMeta = [
  { step: 1, name: 'Your Account' },
  { step: 2, name: 'Your Operation' },
  { step: 3, name: 'Your Plan' },
];

export const LeftNavigationPanel: React.FC = () => {
  const { state } = usePreRegistration();
  const claimed = 12;
  const total = 3500;
  const subtitle = 'Rate locked forever'
  // Calculate percentage for the progress bar fill
  const percentage = Math.min(Math.max((claimed / total) * 100, 0), 100);

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
        {/* <div className="mb-[28px] shrink-0">
          <p 
            className="text-[11px] font-semibold uppercase tracking-[0.08em]"
            style={{
              fontFamily: 'var(--S)',
              color: 'var(--ink3)'
            }}
          >
            Impact Intelligence
          </p>
        </div> */}

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
          <div className="w-full max-w-sm rounded-2xl border border-[#9ee3d1]/60 bg-[#00a86a1c] p-4 font-sans text-xs">
      {/* Title Header */}
      <div className="flex items-center gap-2 mb-2">
        <span className="h-2.5 w-2.5 rounded-full bg-[#00a86b]" />
        <h4 className="font-bold text-[#00a86b] text-xs tracking-wide">
          Founding member seats
        </h4>
      </div>

      {/* Progress Bar Track */}
      <div className="relative h-1.5 w-full rounded-full bg-[#cbd5e1] overflow-hidden mb-2.5">
        <div
          className="h-full rounded-full bg-[#00a86b] transition-all duration-300 ease-in-out"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Subtext */}
      <p className="text-[#52606d] text-[10px] font-normal leading-tight">
        <span className="font-bold text-[#00a86b]">
          {claimed.toLocaleString()}
        </span>{' '}
        of {total.toLocaleString()} claimed · {subtitle}
      </p>
    </div>
        </span>
      </div>
    </aside>
  );
};