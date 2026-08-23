import React from "react";

export default function Analytics() {
  return (
    <section className="py-[100px] bg-numGrad transition-colors duration-300">
      <div className="inner max-w-300 mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[72px] items-center">
          <div>
            <span className="section-tag">What it actually costs you</span>
            <div className="font-sora text-[56px] md:text-[88px] font-extrabold tracking-[-0.05em] leading-none gtext mb-1.5">+€8,400</div>
            <div className="font-sora text-[12px] text-ink3 tracking-wide mb-[22px]">Logistics &nbsp;•&nbsp; Germany &nbsp;•&nbsp; 50-truck fleet &nbsp;•&nbsp; July 2026</div>
            <p className="text-[17px] text-ink3 leading-[1.75] mb-7">Not a market statistic. A specific cost impact calculated from the current crude market movement and the operational profile of your business.</p>
            <div className="bg-[var(--card-bg)] border border-bd rounded-2xl p-[22px] shadow-lg">
              <div className="flex items-center justify-between gap-3 py-[9px] border-b border-bd">
                <span className="font-sora text-[11px] font-medium text-ink3">Brent 30-day movement</span>
                <span className="font-sora text-[14px] font-bold text-red">+4.1%</span>
              </div>
              <div className="flex items-center justify-between gap-3 py-[9px] border-b border-bd">
                <span className="font-sora text-[11px] font-medium text-ink3">Market-to-pump translation</span>
                <span className="font-sora text-[14px] font-bold text-ink">78% of move</span>
              </div>
              <div className="flex items-center justify-between gap-3 py-[9px] border-b border-bd">
                <span className="font-sora text-[11px] font-medium text-ink3">Sector exposure weight</span>
                <span className="font-sora text-[14px] font-bold text-ink">Very high</span>
              </div>
              <div className="flex items-center justify-between gap-3 py-[9px] border-b border-bd">
                <span className="font-sora text-[11px] font-medium text-ink3">Your fuel spend profile</span>
                <span className="font-sora text-[14px] font-bold text-ink">€52,500 / month</span>
              </div>
              <div className="flex items-center justify-between mt-3.5 pt-3.5 border-t-[1.5px] border-pur/30">
                <span className="text-[14px] font-bold text-ink">= Your cost impact</span>
                <span className="font-sora text-[22px] font-extrabold text-red">+€8,400</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="bg-[var(--card-bg)] border border-bd rounded-2xl p-5 md:p-[22px] shadow-lg transition-all duration-200 hover:border-pur/30 hover:shadow-lg2">
              <div className="font-sora text-[10px] font-bold uppercase tracking-[0.08em] text-ink3 mb-1.5">Cost Shock Index</div>
              <div className="font-sora text-[26px] font-extrabold tracking-[-0.03em] leading-none text-red mb-[3px]">87 / 100</div>
              <div className="text-[12px] text-ink3">HIGH &nbsp;•&nbsp; Act within 9 days</div>
            </div>
            <div className="bg-[var(--card-bg)] border border-bd rounded-2xl p-5 md:p-[22px] shadow-lg transition-all duration-200 hover:border-pur/30 hover:shadow-lg2">
              <div className="font-sora text-[10px] font-bold uppercase tracking-[0.08em] text-ink3 mb-1.5">Budget revision</div>
              <div className="flex items-center gap-2.5">
                <div className="font-sora text-[18px] font-bold text-ink3">€161,000</div>
                <div className="text-[16px] text-red">➔</div>
                <div className="font-sora text-[18px] font-bold text-red">€169,400</div>
              </div>
              <div className="text-[12px] text-ink3">Monthly fuel budget change</div>
            </div>
            <div className="bg-[var(--card-bg)] border border-bd rounded-2xl p-5 md:p-[22px] shadow-lg transition-all duration-200 hover:border-pur/30 hover:shadow-lg2">
              <div className="font-sora text-[10px] font-bold uppercase tracking-[0.08em] text-ink3 mb-1.5">If trend continues — annual</div>
              <div className="font-sora text-[26px] font-extrabold tracking-[-0.03em] leading-none text-red mb-[3px]">€100,800</div>
              <div className="text-[12px] text-ink3">Planning-level exposure figure</div>
            </div>
            <div className="bg-[var(--card-bg)] border border-bd rounded-2xl p-5 md:p-[22px] shadow-lg transition-all duration-200 hover:border-pur/30 hover:shadow-lg2">
              <div className="font-sora text-[10px] font-bold uppercase tracking-[0.08em] text-ink3 mb-1.5">Window to act</div>
              <div className="font-sora text-[26px] font-extrabold tracking-[-0.03em] leading-none gtext mb-[3px]">9 days</div>
              <div className="text-[12px] text-ink3">Before cost reaches your operations</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}