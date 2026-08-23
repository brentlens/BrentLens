"use client";

import React, { useEffect, useState } from "react";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRouter } from "next/navigation";

export default function Hero({
  isPreLanding = true,
}: {
  isPreLanding?: boolean;
}) {
  const [countdown, setCountdown] = useState({ d: "09", h: "14", m: "32" });
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(prev => {
        let mins = parseInt(prev.m) - 1;
        let hrs = parseInt(prev.h);
        let days = parseInt(prev.d);

        if (mins < 0) {
          mins = 59;
          hrs -= 1;
        }
        if (hrs < 0) {
          hrs = 23;
          days -= 1;
        }
        if (days < 0) {
          return { d: "00", h: "00", m: "00" };
        }

        return {
          d: days.toString().padStart(2, "0"),
          h: hrs.toString().padStart(2, "0"),
          m: mins.toString().padStart(2, "0"),
        };
      });
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="min-h-screen flex items-center pt-[70px] bg-hero-bg transition-colors duration-300">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-[60px] items-center w-full max-w-[1200px] mx-auto px-5 md:px-10 py-20">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pur/12 border border-pur/30 font-sora text-[11px] font-bold tracking-[0.06em] uppercase text-pur2 mb-6">
            Fuel Cost Intelligence &nbsp;•&nbsp; Powered by Brent Crude
          </div>
          <h1 className="text-[30px] sm:text-[40px] md:text-[52px] font-black leading-[1.1] tracking-tightest text-ink mb-[22px]">
            Know Your Fuel Cost Increase<br />
            <span className="gtext">Before It Hits Your Budget.</span>
          </h1>
          <p className="text-[17px] text-ink3 leading-[1.75] mb-9 max-w-[520px]">
            BrentLens converts crude oil movements into personalized cost impact intelligence for logistics, manufacturing, construction, aviation, maritime, and agribusiness teams.
          </p>
          <div className="flex gap-3 flex-wrap mb-9">
			<button
				onClick={() => {
					router.push("/onboarding");
				}}
				className="px-7 py-3.5 rounded-lg bg-gradient-to-br from-pur to-cyan text-white text-[15px] font-bold shadow-[0_4px_20px_rgba(124,58,237,0.35)] transition-all duration-180 inline-flex items-center gap-2 hover:translate-y-[-2px] hover:shadow-[0_8px_32px_rgba(124,58,237,0.5)]"
				>
				{isPreLanding ? "Reserve Founding Rates" : "Start 14-day free trial"}
			</button>
            {/* <button onClick={() => {router.push("/onboarding");}} className="px-7 py-3.5 rounded-lg bg-gradient-to-br from-pur to-cyan text-white text-[15px] font-bold shadow-[0_4px_20px_rgba(124,58,237,0.35)] transition-all duration-180 inline-flex items-center gap-2 hover:translate-y-[-2px] hover:shadow-[0_8px_32px_rgba(124,58,237,0.5)]">
              Start 14-day free trial
            </button> */}
			<button
				onClick={() => {
					if (isPreLanding) {
					router.push("/waitlist");
					} else {
					scrollToSection("how");
					}
				}}
				className="px-7 py-3.5 rounded-lg border-[1.5px] border-bd2 bg-surf text-ink text-[15px] font-semibold transition-all duration-180 inline-flex items-center gap-2 hover:border-pur2 hover:text-pur2 hover:bg-pur/12"
				>
				{isPreLanding ? "Join Waitlist Free" : "See how it works"}
			</button>
            {/* <button onClick={() => scrollToSection("how")} className="px-7 py-3.5 rounded-lg border-[1.5px] border-bd2 bg-surf text-ink text-[15px] font-semibold transition-all duration-180 inline-flex items-center gap-2 hover:border-pur2 hover:text-pur2 hover:bg-pur/12">
              See how it works
            </button> */}
          </div>
          <div className="flex items-center gap-3.5 text-[12px] text-ink3 flex-wrap">
            <div className="flex items-center gap-1.5">
              <div className="w-3.5 h-3.5 rounded-full bg-green/12 border border-green/25 flex items-center justify-center flex-shrink-0">
				<FontAwesomeIcon icon={faCheck} className="text-[9px]" />
				</div>
              No credit card required
            </div>
            <div className="w-[3px] h-[3px] rounded-full bg-bd2" />
            <div className="flex items-center gap-1.5">
              <div className="w-3.5 h-3.5 rounded-full bg-green/12 border border-green/25 flex items-center justify-center flex-shrink-0">
                <FontAwesomeIcon icon={faCheck} className="text-[9px]" />
              </div>
              14-day full Pro access
            </div>
            <div className="w-[3px] h-[3px] rounded-full bg-bd2" />
			
            <div className="flex items-center gap-1.5">
              <div className="w-3.5 h-3.5 rounded-full bg-green/12 border border-green/25 flex items-center justify-center flex-shrink-0">
                <FontAwesomeIcon icon={faCheck} className="text-[9px]" />
              </div>
              {isPreLanding? "Rate Locked Forever": "Cancel any time"}
            </div>
          </div>
        </div>

        {/* COST CLOCK CARD */}
        <div className="bg-clock-bg  border  border-gray-300 dark:border-clock-bd rounded-[20px] p-[28px_26px] relative overflow-hidden transition-all duration-300 shadow-lg dark:shadow-sh3 before:content-[''] before:absolute before:-top-[60px] before:-right-[60px] before:w-[200px] before:h-[200px] before:rounded-full before:blur-[40px] before:pointer-events-none before:transition-colors before:bg-pur/[0.08] after:content-[''] after:absolute after:-bottom-[40px] after:-left-[40px] after:w-[160px] after:h-[160px] after:rounded-full after:blur-[40px] after:pointer-events-none after:transition-colors after:bg-cyan/[0.06]">
          <div className="font-sora text-[10px] font-bold uppercase tracking-[0.09em] text-ink3 mb-5 flex items-center gap-[7px]">
            <div className="w-1.5 h-1.5 rounded-full bg-green animate-live-pulse" />
            BrentLens Cost Clock &nbsp;•&nbsp; Live
          </div>
          <div className="flex items-end justify-between mb-[22px]">
            <div>
              <div className="font-sora text-[42px] font-extrabold tracking-tightest leading-none gtext" id="brent-price">$87.42</div>
              <div className="font-sora text-[11px] text-ink3 mt-1">Brent Crude / BBL</div>
            </div>
            <div className="bg-red/12 border border-red/25 text-red font-sora text-[12px] font-bold p-[5px_12px] rounded-full">
              ▲ +4.1% (30D)
            </div>
          </div>
          <div className="font-sora text-[10px] font-semibold tracking-[0.08em] uppercase text-ink3 mb-2">Signal travelling from crude markets to your costs</div>
          <div className="h-2 bg-surf2 rounded-full overflow-hidden mb-1.5">
            <div className="h-full bg-gradient-to-r from-pur via-blue to-cyan rounded-full animate-gap-track" />
          </div>
          <div className="flex justify-between font-sora text-[10px] text-ink3 mb-5">
            <span>Crude moves</span>
            <span>Your costs change</span>
          </div>
          <div className="font-sora text-[10px] font-semibold tracking-[0.08em] uppercase text-ink3 mb-2">Time before logistics businesses feel this move</div>
          <div className="grid grid-cols-3 gap-2 mb-[18px]">
            <div className="bg-surf2 border border-bd rounded-lg p-[12px_8px] text-center transition-colors duration-300">
              <div className="font-sora text-[28px] font-bold tracking-tightest leading-none mb-1 gtext">{countdown.d}</div>
              <div className="font-sora text-[9px] font-semibold uppercase tracking-[0.08em] text-ink3">Days</div>
            </div>
            <div className="bg-surf2 border border-bd rounded-lg p-[12px_8px] text-center transition-colors duration-300">
              <div className="font-sora text-[28px] font-bold tracking-tightest leading-none mb-1 gtext">{countdown.h}</div>
              <div className="font-sora text-[9px] font-semibold uppercase tracking-[0.08em] text-ink3">Hours</div>
            </div>
            <div className="bg-surf2 border border-bd rounded-lg p-[12px_8px] text-center transition-colors duration-300">
              <div className="font-sora text-[28px] font-bold tracking-tightest leading-none mb-1 gtext">{countdown.m}</div>
              <div className="font-sora text-[9px] font-semibold uppercase tracking-[0.08em] text-ink3">Minutes</div>
            </div>
          </div>
          <div className="bg-red/12 border border-red/25 rounded-lg p-[14px_16px] flex items-center justify-between">
            <div className="text-[12px] text-ink2 Church leading-[1.5]">
              Estimated impact<br />
              <strong className="text-ink">50-truck fleet &nbsp;•&nbsp; Germany</strong>
            </div>
            <div>
              <div className="font-sora text-[24px] font-bold text-red leading-none">+€8,400</div>
              <div className="font-sora text-[10px] text-ink3 mt-0.5 text-right">this month &nbsp;•&nbsp; updating live</div>
            </div>
          </div>
          <div className="text-center mt-3 font-sora text-[11px] text-ink3">Personalised to your business after signup</div>
        </div>
      </div>
    </section>
  );
}