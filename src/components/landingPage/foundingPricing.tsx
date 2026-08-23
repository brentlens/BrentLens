import React from "react";
import { Check, X, Lock, BellRing } from "lucide-react";
import EnterpriseBanner from "./enterpriseBanner";
import { useRouter } from "next/navigation";

export default function FoundingPricing() {
	const router = useRouter();

  const handleStartTrial = (selectedPlanKey: string) => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('selectedPlan', selectedPlanKey);
    }
    router.push('/onboarding');
  };
  return (
    <section id="pricing" className="w-full min-h-screen bg-gradient-to-b from-[#f9f9ff] via-[#f8fafe] to-[#f4f6fc] py-16 px-4 md:px-8 text-[#0F172A] font-sans antialiased">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* HEADER SECTION */}
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-extrabold tracking-widest text-[#635BFF] uppercase">
            <BellRing className="w-3.5 h-3.5 fill-[#635BFF]" />
            FOUNDING MEMBER PRICING
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold text-[#0F172A] tracking-tight">
            Lock in your rate for life.
          </h1>

          <p className="text-slate-500 text-base md:text-lg max-w-2xl mx-auto font-normal leading-relaxed">
            First 3,500 customers pay this rate forever — even after we raise prices. Seat limit, not a time limit.
          </p>
        </div>

        {/* PROGRESS / LIMITED SEATS BANNER */}
        <div className="max-w-3xl mx-auto bg-[#eefaf6]/80 border border-[#b2e2d6] rounded-2xl p-4 md:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm backdrop-blur-sm">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#c2f2e5] flex items-center justify-center text-[#059669] shrink-0">
              <Lock className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div className="text-left">
              <div className="text-[#0F172A] font-bold text-sm md:text-base">
                Limited to the first <span className="text-[#059669] font-extrabold">3,500</span> founding members
              </div>
              <div className="text-slate-500 text-xs md:text-sm">
                Seat limit, not a time limit — price rises for everyone after this
              </div>
            </div>
          </div>

          <div className="w-full sm:w-auto text-right space-y-1.5 shrink-0">
            <div className="w-full sm:w-48 bg-slate-200 h-2.5 rounded-full overflow-hidden">
              <div className="bg-[#059669] h-full rounded-full" style={{ width: "2%" }}></div>
            </div>
            <div className="text-xs font-bold text-[#0F172A] tracking-tight">
              12 / 3,500 seats claimed
            </div>
          </div>
        </div>

        {/* PRICING CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch pt-2">

          {/* STARTER CARD */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-7 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
            <div className="space-y-6">
              <div className="space-y-2.5 text-left">
                <span className="text-[11px] font-extrabold tracking-wider text-slate-400 uppercase">
                  STARTER
                </span>
                <div className="bg-[#e2f7f0] text-[#047857] border border-[#b8ebd8] text-[11px] font-semibold px-2.5 py-1 rounded-full w-fit">
                  • Founding rate — locked forever
                </div>
              </div>

              <div className="text-left">
                <div className="flex items-baseline gap-0.5">
                  <span className="text-2xl font-bold text-[#0F172A]">$</span>
                  <span className="text-5xl font-extrabold tracking-tight text-[#0F172A]">49</span>
                </div>
                <div className="text-xs text-slate-500 mt-1 font-medium">per month</div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-slate-400 line-through">After 3,500 seats: $79/mo</span>
                  <span className="bg-[#fef3c7] text-[#b45309] text-[10px] font-bold px-1.5 py-0.5 rounded">
                    Save $30/mo
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed border-t border-slate-100 pt-4 text-left">
                Live fuel cost exposure tracking, Cost Shock Index, and basic action signal.
              </p>

              <ul className="space-y-3 text-xs text-slate-600 text-left">
                <li className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-[#d1fae5] text-[#047857] flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </span>
                  Live fuel cost exposure tracking
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-[#d1fae5] text-[#047857] flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </span>
                  Cost Shock Index
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-[#d1fae5] text-[#047857] flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </span>
                  Basic action signal
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-[#d1fae5] text-[#047857] flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </span>
                  2 alert types · 1 seat
                </li>
                <li className="flex items-center gap-2 text-slate-400">
                  <span className="w-4 h-4 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center shrink-0">
                    <X className="w-2.5 h-2.5 stroke-[2.5]" />
                  </span>
                  Precise cost impact number
                </li>
                <li className="flex items-center gap-2 text-slate-400">
                  <span className="w-4 h-4 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center shrink-0">
                    <X className="w-2.5 h-2.5 stroke-[2.5]" />
                  </span>
                  Monthly variance reports
                </li>
              </ul>
            </div>

            <button onClick={() => handleStartTrial('starter')} className="mt-8 w-full py-3 bg-[#f1f5f9] hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors">
              Start free trial
            </button>
          </div>

          {/* PRO CARD (MOST POPULAR) */}
          <div className="relative bg-white rounded-2xl border-2 border-[#818CF8] p-7 flex flex-col justify-between shadow-xl shadow-indigo-100/50">
            {/* MOST POPULAR BADGE */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#2563EB] text-white text-[10px] font-extrabold tracking-widest px-3 py-1 rounded-full uppercase shadow-sm">
              MOST POPULAR
            </div>

            <div className="space-y-6">
              <div className="space-y-2.5 pt-1 text-left">
                <span className="text-[11px] font-extrabold tracking-wider text-[#635BFF] uppercase">
                  PRO
                </span>
                <div className="bg-[#e2f7f0] text-[#047857] border border-[#b8ebd8] text-[11px] font-semibold px-2.5 py-1 rounded-full w-fit">
                  • Founding rate — locked forever
                </div>
              </div>

              <div className="text-left">
                <div className="flex items-baseline gap-0.5">
                  <span className="text-2xl font-bold text-[#635BFF]">$</span>
                  <span className="text-5xl font-extrabold tracking-tight text-[#635BFF]">149</span>
                </div>
                <div className="text-xs text-slate-500 mt-1 font-medium">per month</div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-slate-400 line-through">After 3,500 seats: $249/mo</span>
                  <span className="bg-[#fef3c7] text-[#b45309] text-[10px] font-bold px-1.5 py-0.5 rounded">
                    Save $100/mo
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed border-t border-slate-100 pt-4 text-left">
                Exact cost impact, full action signal with countdown, scenarios, and monthly reports.
              </p>

              <ul className="space-y-3 text-xs text-slate-600 text-left">
                <li className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-[#d1fae5] text-[#047857] flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </span>
                  Everything in Starter
                </li>
                <li className="flex items-center gap-2 font-semibold text-slate-900">
                  <span className="w-4 h-4 rounded-full bg-[#d1fae5] text-[#047857] flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </span>
                  <span><strong className="font-extrabold">Exact</strong> personalised cost impact</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-[#d1fae5] text-[#047857] flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </span>
                  Full action signal with countdown
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-[#d1fae5] text-[#047857] flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </span>
                  Cost Outlook & Scenario Planner
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-[#d1fae5] text-[#047857] flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </span>
                  Monthly reports — PDF & CSV
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-[#d1fae5] text-[#047857] flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </span>
                  All 6 alert types · 2 seats
                </li>
              </ul>
            </div>

            <button onClick={() => handleStartTrial('pro')} className="mt-8 w-full py-3.5 bg-gradient-to-r from-[#635BFF] to-[#00D4FF] hover:opacity-95 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-1">
              Start free trial →
            </button>
          </div>

          {/* BUSINESS CARD */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-7 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow">
            <div className="space-y-6">
              <div className="space-y-2.5 text-left">
                <span className="text-[11px] font-extrabold tracking-wider text-slate-400 uppercase">
                  BUSINESS
                </span>
                <div className="bg-[#e2f7f0] text-[#047857] border border-[#b8ebd8] text-[11px] font-semibold px-2.5 py-1 rounded-full w-fit">
                  • Founding rate — locked forever
                </div>
              </div>

              <div className="text-left">
                <div className="flex items-baseline gap-0.5">
                  <span className="text-2xl font-bold text-[#0F172A]">$</span>
                  <span className="text-5xl font-extrabold tracking-tight text-[#0F172A]">399</span>
                </div>
                <div className="text-xs text-slate-500 mt-1 font-medium">per month</div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-slate-400 line-through">After 3,500 seats: $649/mo</span>
                  <span className="bg-[#fef3c7] text-[#b45309] text-[10px] font-bold px-1.5 py-0.5 rounded">
                    Save $250/mo
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed border-t border-slate-100 pt-4 text-left">
                REST API access, white-label reports, unlimited alerts, and 5 team seats.
              </p>

              <ul className="space-y-3 text-xs text-slate-600 text-left">
                <li className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-[#d1fae5] text-[#047857] flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </span>
                  Everything in Pro
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-[#d1fae5] text-[#047857] flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </span>
                  REST API — 10,000 calls/month
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-[#d1fae5] text-[#047857] flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </span>
                  White-label monthly reports
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-[#d1fae5] text-[#047857] flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </span>
                  Unlimited alerts & custom rules
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-[#d1fae5] text-[#047857] flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </span>
                  Priority support · 5 seats
                </li>
              </ul>
            </div>

            <button  onClick={() => handleStartTrial('business')}  className="mt-8 w-full py-3 bg-[#f1f5f9] hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors">
              Start free trial
            </button>
          </div>

        </div>

        {/* FOOTER DISCLAIMER */}
        <p className="text-center text-lg text-slate-500  mx-auto pt-4 leading-relaxed">
          <strong className="text-slate-800">Founding member rate is permanent.</strong> You pay this price for as long as you stay subscribed — even after we raise prices for everyone else. This is a seat limit, not a time limit.
        </p>

		<EnterpriseBanner/>

      </div>
    </section>
  );
}