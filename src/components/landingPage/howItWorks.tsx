import React from "react";

export default function HowItWorks() {
  return (
    <section id="how" className="py-25 bg-bg2 transition-colors duration-300">
      <div className="inner max-w-300 mx-auto">
        <div className="text-center">
          <span className="section-tag">How it Works</span>
          <h2 className="section-h">From crude markets to your<br />next business decision.</h2>
          <p className="section-sub">We connect a global market signal to your specific operations — so you know what is coming, not what already happened.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[18px]">
          <div className=" bg-[var(--card-bg)] border border-bd rounded-lg p-[32px_28px] transition-all duration-200 relative group hover:border-pur/35 hover:-translate-y-1 hover:shadow-xl before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-[2px] before:bg-gradient-to-r before:from-pur via-blue to-cyan before:opacity-0 before:transition-opacity before:duration-200 hover:before:opacity-100">
            <span className="font-sora text-[11px] font-bold tracking-[0.08em] uppercase gtext mb-5 block">01</span>
            <div className="w-[52px] h-[52px] mb-[18px]">
              <svg viewBox="0 0 52 52" fill="none">
                <circle cx="26" cy="26" r="11" stroke="url(#h1)" strokeWidth="2.2" />
                <path d="M26 5v5M26 42v5M5 26h5M42 26h5M9.6 9.6l3.5 3.5M38.9 38.9l3.5 3.5M9.6 42.4l3.5-3.5M38.9 13.1l3.5-3.5" stroke="url(#h1)" strokeWidth="2.2" strokeLinecap="round" />
                <circle cx="26" cy="26" r="4" fill="url(#h1)" />
                <defs>
                  <linearGradient id="h1" x1="5" y1="5" x2="47" y2="47" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#7C3AED" />
                    <stop offset=".55" stopColor="#4F46E5" />
                    <stop offset="1" stopColor="#06B6D4" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div className="text-[18px] font-bold text-ink tracking-[-0.03em] mb-2.5">Continuous market monitoring</div>
            <p className="text-[14px] text-ink3 leading-[1.75] mb-3.5">Brent crude is the benchmark that moves fuel costs across every major industry globally. We track its every movement — so you never miss a shift that matters to your operations.</p>
            <div className="font-sora text-[12px] font-bold gtext">Always on. Never manual.</div>
          </div>

          <div className=" bg-[var(--card-bg)] border border-bd rounded-lg p-[32px_28px] transition-all duration-200 relative group hover:border-pur/35 hover:-translate-y-1 hover:shadow-xl before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-[2px] before:bg-gradient-to-r before:from-pur via-blue to-cyan before:opacity-0 before:transition-opacity before:duration-200 hover:before:opacity-100">
            <span className="font-sora text-[11px] font-bold tracking-[0.08em] uppercase gtext mb-5 block">02</span>
            <div className="w-[52px] h-[52px] mb-[18px]">
              <svg viewBox="0 0 52 52" fill="none">
                <rect x="7" y="7" width="38" height="38" rx="6" stroke="url(#h2)" strokeWidth="2.2" />
                <path d="M15 34l9-11 6 6 9-13" stroke="url(#h2)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="15" cy="34" r="2.5" fill="url(#h2)" />
                <circle cx="24" cy="23" r="2.5" fill="url(#h2)" />
                <circle cx="30" cy="29" r="2.5" fill="url(#h2)" />
                <circle cx="39" cy="16" r="2.5" fill="url(#h2)" />
                <defs>
                  <linearGradient id="h2" x1="7" y1="7" x2="45" y2="45" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#7C3AED" />
                    <stop offset=".55" stopColor="#4F46E5" />
                    <stop offset="1" stopColor="#06B6D4" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div className="text-[18px] font-bold text-ink tracking-[-0.03em] mb-2.5">Translated to your business</div>
            <p className="text-[14px] text-ink3 leading-[1.75] mb-3.5">A 4% crude move does not mean the same thing to a freight operator and a manufacturer. BrentLens knows the difference — and delivers the cost impact specific to how your business operates.</p>
            <div className="font-sora text-[12px] font-bold gtext">Your number. Not a market average.</div>
          </div>

          <div className=" bg-[var(--card-bg)] border border-bd rounded-lg p-[32px_28px] transition-all duration-200 relative group hover:border-pur/35 hover:-translate-y-1 hover:shadow-xl before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-[2px] before:bg-gradient-to-r before:from-pur via-blue to-cyan before:opacity-0 before:transition-opacity before:duration-200 hover:before:opacity-100">
            <span className="font-sora text-[11px] font-bold tracking-[0.08em] uppercase gtext mb-5 block">03</span>
            <div className="w-[52px] h-[52px] mb-[18px]">
              <svg viewBox="0 0 52 52" fill="none">
                <path d="M26 7l5 13h14l-11 8 4 13-12-8-12 8 4-13-11-8h14l5-13z" stroke="url(#h3)" strokeWidth="2.2" strokeLinejoin="round" />
                <defs>
                  <linearGradient id="h3" x1="7" y1="7" x2="45" y2="45" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#7C3AED" />
                    <stop offset=".55" stopColor="#4F46E5" />
                    <stop offset="1" stopColor="#06B6D4" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <div className="text-[18px] font-bold text-ink tracking-[-0.03em] mb-2.5">Act before the cost arrives</div>
            <p className="text-[14px] text-ink3 leading-[1.75] mb-3.5">A personalised cost forecast, a specific action recommendation, and a countdown of how long you have. Everything you need to make the right procurement decision while you still have options.</p>
            <div className="font-sora text-[12px] font-bold gtext">Intelligence that drives action.</div>
          </div>
        </div>
      </div>
    </section>
  );
}