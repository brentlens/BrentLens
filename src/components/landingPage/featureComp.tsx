import React from "react";

export default function Features() {
  return (
    <section id="features" className="py-[100px] bg-bg2 transition-colors duration-300">
      <div className="inner max-w-300 mx-auto">
        <div className="text-center">
          <span className="section-tag">What You Get</span>
          <h2 className="section-h">Four capabilities. One purpose —<br />clarity before costs change.</h2>
          <p className="section-sub">Every tool built around one question — what do I do about this, and how much time do I have?</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[18px]">
          <div className="bg-[var(--card-bg)] border border-bd rounded-2xl p-[32px_28px] transition-all duration-200 hover:border-pur/30 hover:-translate-y-[3px] hover:shadow-xl">
            <div className="w-[46px] h-[46px] rounded-xl bg-gradSoft flex items-center justify-center mb-[18px] border border-pur/20">
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <circle cx="11" cy="11" r="9" stroke="url(#f1)" strokeWidth="1.7"/>
                <circle cx="11" cy="11" r="5" stroke="url(#f1)" strokeWidth="1.7"/>
                <circle cx="11" cy="11" r="2" fill="url(#f1)"/>
                <defs>
                  <linearGradient id="f1" x1="2" y1="2" x2="20" y2="20" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#7C3AED"/>
                    <stop offset="1" stopColor="#06B6D4"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div className="text-[17px] font-bold text-ink tracking-[-0.03em] mb-2.5">Cost Shock Index</div>
            <p className="text-[14px] text-ink3 leading-[1.75] mb-3.5">A proprietary risk score that tells you at a glance how exposed your business is to current market conditions. Updated continuously. No analysis required.</p>
            <span className="inline-flex items-center px-2.5 py-[3px] rounded-full font-sora text-[10px] font-bold uppercase tracking-wider bg-green/12 text-green border border-green/25">All plans</span>
          </div>

          <div className="bg-[var(--card-bg)] border border-bd rounded-2xl p-[32px_28px] transition-all duration-200 hover:border-pur/30 hover:-translate-y-[3px] hover:shadow-xl">
            <div className="w-[46px] h-[46px] rounded-xl bg-gradSoft flex items-center justify-center mb-[18px] border border-pur/20">
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <circle cx="11" cy="11" r="9" stroke="url(#f2)" strokeWidth="1.7"/>
                <path d="M11 6v5l3 3" stroke="url(#f2)" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
                <defs>
                  <linearGradient id="f2" x1="2" y1="2" x2="20" y2="20" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#7C3AED"/>
                    <stop offset="1" stopColor="#06B6D4"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div className="text-[17px] font-bold text-ink tracking-[-0.03em] mb-2.5">Action Signal</div>
            <p className="text-[14px] text-ink3 leading-[1.75] mb-3.5">Not a notification. A specific, time-sensitive recommendation for what your operations team should do right now — with a countdown of how long you have before the window closes.</p>
            <span className="inline-flex items-center px-2.5 py-[3px] rounded-full font-sora text-[10px] font-bold uppercase tracking-wider bg-green/12 text-green border border-green/25">All plans</span>
          </div>

          <div className="bg-[var(--card-bg)] border border-bd rounded-2xl p-[32px_28px] transition-all duration-200 hover:border-pur/30 hover:-translate-y-[3px] hover:shadow-xl">
            <div className="w-[46px] h-[46px] rounded-xl bg-gradSoft flex items-center justify-center mb-[18px] border border-pur/20">
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <path d="M3 16l5-6 4 4 7-9" stroke="url(#f3)" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M15 5h4v4" stroke="url(#f3)" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"/>
                <defs>
                  <linearGradient id="f3" x1="3" y1="3" x2="19" y2="19" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#4F46E5"/>
                    <stop offset="1" stopColor="#06B6D4"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div className="text-[17px] font-bold text-ink tracking-[-0.03em] mb-2.5">Impact Intelligence</div>
            <p className="text-[14px] text-ink3 leading-[1.75] mb-3.5">Three forward-looking scenarios showing your likely cost range over the next 30 days. Updated daily. Designed for budget planning and contract decisions.</p>
            <span className="inline-flex items-center px-2.5 py-[3px] rounded-full font-sora text-[10px] font-bold uppercase tracking-wider bg-pur/12 text-pur2 border border-pur/30">Pro &amp; Business</span>
          </div>

          <div className="bg-[var(--card-bg)] border border-bd rounded-2xl p-[32px_28px] transition-all duration-200 hover:border-pur/30 hover:-translate-y-[3px] hover:shadow-xl">
            <div className="w-[46px] h-[46px] rounded-xl bg-gradSoft flex items-center justify-center mb-[18px] border border-pur/20">
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <rect x="4" y="2" width="14" height="18" rx="2" stroke="url(#f4)" strokeWidth="1.7"/>
                <path d="M7 8h8M7 12h8M7 16h5" stroke="url(#f4)" strokeWidth="1.7" strokeLinecap="round"/>
                <defs>
                  <linearGradient id="f4" x1="4" y1="2" x2="18" y2="20" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#4F46E5"/>
                    <stop offset="1" stopColor="#06B6D4"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div className="text-[17px] font-bold text-ink tracking-[-0.03em] mb-2.5">Monthly Variance Report</div>
            <p className="text-[14px] text-ink3 leading-[1.75] mb-3.5">A one-click PDF that explains your fuel cost variance in finance language. Ready in seconds. Built for budget reviews and internal reporting without hours of manual work.</p>
            <span className="inline-flex items-center px-2.5 py-[3px] rounded-full font-sora text-[10px] font-bold uppercase tracking-wider bg-pur/12 text-pur2 border border-pur/30">Pro &amp; Business</span>
          </div>
        </div>
      </div>
    </section>
  );
}