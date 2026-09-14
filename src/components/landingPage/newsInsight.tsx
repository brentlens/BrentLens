import React from 'react';
import { Clock, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function NewsInsightCard() {
	const router = useRouter();
  return (
<div className="relative my-8 mx-4 overflow-hidden rounded-3xl border border-rose-100 bg-gradient-to-br from-rose-50/50 via-white to-purple-50/30 p-5 shadow-sm font-sans sm:my-12 sm:mx-6 sm:p-7 md:my-20 md:mx-10 md:p-10 lg:my-25 lg:mx-20 lg:p-12 xl:mx-32 2xl:mx-48">
  {/* Background Radial Glow Effect */}
  <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-rose-200/30 sm:-right-16 sm:-top-16 sm:h-40 sm:w-40 md:h-50 md:w-50" />

  {/* Badge Header */}
  <div className="relative inline-flex max-w-full items-center gap-1.5 rounded-full border border-rose-200/80 bg-rose-100/60 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-rose-500 sm:px-3 sm:text-xs">
    <Clock className="h-3 w-3 shrink-0 sm:h-3.5 sm:w-3.5" />
    <span>Why this matters right now</span>
  </div>

  {/* Main Headline */}
  <h2 className="relative mt-5 text-xl font-extrabold leading-tight tracking-tight text-slate-900 sm:mt-6 sm:text-2xl md:text-3xl">
    Iran-US-Israel escalation is pushing Brent crude to a critical threshold.
  </h2>

  {/* Body Copy */}
  <p className="relative mt-4 max-w-3xl text-sm leading-relaxed text-slate-500 sm:text-base">
    The Strait of Hormuz — through which roughly 20% of the world's oil supply
    passes — is under renewed pressure. Brent crude has risen 4.1% in 30 days
    and analysts are watching for a further move. For logistics, maritime, and
    manufacturing businesses, this is not a market headline. It is a cost event
    heading for your invoices.
  </p>

  {/* Stat Cards Grid */}
  <div className="relative mt-6 grid grid-cols-1 gap-3 sm:mt-8 sm:grid-cols-2 sm:gap-4 md:grid-cols-3">
    {/* Stat 1 */}
    <div className="rounded-2xl border border-slate-200/60 bg-white/60 p-4 backdrop-blur-sm sm:p-5">
      <div className="text-2xl font-black text-rose-500">+4.1%</div>
      <p className="mt-2 text-xs leading-snug text-slate-500">
        Brent crude movement in the last 30 days
      </p>
    </div>

    {/* Stat 2 */}
    <div className="rounded-2xl border border-slate-200/60 bg-white/60 p-4 backdrop-blur-sm sm:p-5">
      <div className="text-2xl font-black text-amber-500">20%</div>
      <p className="mt-2 text-xs leading-snug text-slate-500">
        of global oil supply through Strait of Hormuz
      </p>
    </div>

    {/* Stat 3 */}
    <div className="rounded-2xl border border-slate-200/60 bg-white/60 p-4 backdrop-blur-sm sm:p-5">
      <div className="text-2xl font-black text-indigo-600">9 days</div>
      <p className="mt-2 text-xs leading-snug text-slate-500">
        average time before Brent moves reach logistics invoices in Germany
      </p>
    </div>
  </div>

  {/* Subtext */}
  <p className="relative mt-6 text-sm leading-relaxed text-slate-600 sm:mt-8">
    Most businesses find out when the invoice arrives. BrentLens tells you{" "}
    <strong className="font-bold text-slate-900">
      9 days before
    </strong>{" "}
    — with the exact amount calculated for your operation.
  </p>

  {/* CTA Button */}
  <div className="relative mt-5 sm:mt-6">
    <button
      onClick={() => {
        router.push("/onboarding");
      }}
      className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-br from-pur to-cyan px-6 py-3.5 text-[15px] font-bold text-white shadow-[0_4px_20px_rgba(124,58,237,0.35)] transition-all duration-180 hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(124,58,237,0.5)] sm:w-auto sm:px-7"
    >
      Reserve Founding Rates →
    </button>
  </div>
</div>

  );
}