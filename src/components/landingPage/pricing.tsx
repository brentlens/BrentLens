import React from "react";

export default function Pricing() {
  return (
    <section id="pricing" className="py-[100px] bg-numGrad transition-colors duration-300">
      <div className="inner text-center max-w-300 mx-auto">
        <span className="section-tag">Pricing</span>
        <h2 className="section-h">Start with 14 days free.</h2>
        <p className="section-sub">Full Pro access for 14 days. No credit card needed to start.</p>
        <div className="bg-[var(--price-ph-bg)] border-[1.5px] border-dashed border-[var(--price-ph-bd)] rounded-2xl p-[64px_40px] text-center mt-[52px]">
          <div className="text-[18px] font-bold text-ink3 mb-2">Pricing section coming soon</div>
          <p className="text-[14px] text-ink3">Finalising plan structure. This section will be updated before launch.</p>
        </div>
      </div>
    </section>
  );
}