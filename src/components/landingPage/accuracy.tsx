import React from "react";

export default function Accuracy() {
  return (
    <section className="py-20 bg-bg2 transition-colors duration-300">
      <div className="inner text-center max-w-300 mx-auto">
        <span className="section-tag">Proof It Works</span>
        <h2 className="section-h">Accuracy you can see.</h2>
        <p className="section-sub">
          BrentLens tracks its own forecast performance. You see the track record alongside every prediction — not just the number.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-[18px] mt-[52px]">
          <div className="bg-[var(--card-bg)] border border-bd rounded-2xl p-[32px_28px] text-center shadow-xl">
            <div className="font-sora text-[52px] font-extrabold tracking-[-0.04em] leading-none gtext mb-2.5">83%</div>
            <div className="text-[15px] font-bold text-ink mb-1.5">Directional accuracy</div>
            <p className="text-[13px] text-ink3 leading-[1.6]">Correct on which direction costs moved — last 90 days.</p>
          </div>
          <div className="bg-[var(--card-bg)] border border-bd rounded-2xl p-[32px_28px] text-center shadow-xl">
            <div className="font-sora text-[52px] font-extrabold tracking-[-0.04em] leading-none gtext mb-2.5">±1.8</div>
            <div className="text-[15px] font-bold text-ink mb-1.5">Days timing error</div>
            <p className="text-[13px] text-ink3 leading-[1.6]">Average difference between predicted impact date and actual.</p>
          </div>
          <div className="bg-[var(--card-bg)] border border-bd rounded-2xl p-[32px_28px] text-center shadow-xl">
            <div className="font-sora text-[52px] font-extrabold tracking-[-0.04em] leading-none gtext mb-2.5">10/12</div>
            <div className="text-[15px] font-bold text-ink mb-1.5">Correct calls</div>
            <p className="text-[13px] text-ink3 leading-[1.6]">Out of the last 12 monthly direction predictions made.</p>
          </div>
        </div>
      </div>
    </section>
  );
}