import React from "react";

export default function DashboardPreview() {
  return (
    <section className="py-20 bg-bg transition-colors duration-300">
      <div className="inner">
        <div className="text-center mb-8">
          <h2 className="text-[24px] md:text-[38px] text-ink font-extrabold tracking-tightest leading-[1.12]">
            Built for decisions, not surprises.
          </h2>
        </div>
        <div className="bg-[#1A1D2E] rounded-2xl overflow-hidden border border-white/10 max-w-[1100px] mx-auto shadow-sh dark:shadow-sh2 transition-shadow duration-300">
          <div className="bg-[#242736] h-[42px] flex items-center px-4 gap-2 border-b border-white/5">
            <div className="w-[11px] h-[11px] rounded-full bg-[#FF5F57]" />
            <div className="w-[11px] h-[11px] rounded-full bg-[#FFBD2E]" />
            <div className="w-[11px] h-[11px] rounded-full bg-[#27C93F]" />
            <div className="flex-1 bg-white/5 rounded-md h-6 flex items-center px-3 mx-3">
              <div className="font-sora text-[10px] text-white/30">app.brentlens.com/dashboard</div>
            </div>
          </div>
          <div className="h-[440px] flex items-center justify-center bg-gradient-to-br from-[#0A0F1E] via-[#0D0B24] to-[#141D35] relative overflow-hidden before:content-[''] before:absolute before:inset-0 before:bg-gradient-to-br before:from-pur/10 before:via-blue/5 before:to-cyan/5 dash-content-grid">
            <div className="text-center relative z-10">
              <div className="mx-auto mb-4 w-[52px] h-[52px] rounded-xl bg-gradient-to-br from-pur to-cyan flex items-center justify-center">
                <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
                  <rect x="2" y="7" width="22" height="16" rx="2" stroke="white" strokeWidth="1.8" />
                  <path d="M7 7V5a6 6 0 0112 0v2" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
                  <path d="M9 15l2.5 2.5L17 11" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="font-sora text-[15px] font-bold text-white/60 mb-[5px]">Dashboard Screenshot</div>
              <div className="font-sora text-[12px] text-white/30">Replace with actual product screenshot</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}