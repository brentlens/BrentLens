import React from 'react';
import { Clock, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function NewsInsightCard() {
	const router = useRouter();
  return (
    <div className="relative overflow-hidden rounded-3xl border border-rose-100 bg-gradient-to-br from-rose-50/50 via-white to-purple-50/30 p-8 md:p-12 shadow-sm font-sans  my-25 mx-48">
      {/* Background Radial Glow Effect */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 h-50 w-50 rounded-full bg-rose-200/30  pointer-events-none" />

      {/* Badge Header */}
      <div className="inline-flex items-center gap-1.5 rounded-full border border-rose-200/80 bg-rose-100/60 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-rose-500">
        <Clock className="h-3.5 w-3.5" />
        <span>Why this matters right now</span>
      </div>

      {/* Main Headline */}
      <h2 className="mt-6 text-2xl md:text-3xl font-extrabold text-slate-900 leading-tight tracking-tight">
        Iran-US-Israel escalation is pushing Brent crude to a critical threshold.
      </h2>

      {/* Body Copy */}
      <p className="mt-4 text-sm md:text-base text-slate-500 leading-relaxed max-w-3xl">
        {"The Strait of Hormuz — through which roughly 20% of the world's oil supply passes — is under renewed pressure. Brent crude has risen 4.1% in 30 days and analysts are watching for a further move. For logistics, maritime, and manufacturing businesses, this is not a market headline. It is a cost event heading for your invoices."}
      </p>

      {/* Stat Cards Grid */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Stat 1 */}
        <div className="rounded-2xl border border-slate-200/60 bg-white/60 p-5 backdrop-blur-sm">
          <div className="text-2xl font-black text-rose-500">+4.1%</div>
          <p className="mt-2 text-xs text-slate-500 leading-snug">
            Brent crude movement in the last 30 days
          </p>
        </div>

        {/* Stat 2 */}
        <div className="rounded-2xl border border-slate-200/60 bg-white/60 p-5 backdrop-blur-sm">
          <div className="text-2xl font-black text-amber-500">20%</div>
          <p className="mt-2 text-xs text-slate-500 leading-snug">
            of global oil supply through Strait of Hormuz
          </p>
        </div>

        {/* Stat 3 */}
        <div className="rounded-2xl border border-slate-200/60 bg-white/60 p-5 backdrop-blur-sm">
          <div className="text-2xl font-black text-indigo-600">9 days</div>
          <p className="mt-2 text-xs text-slate-500 leading-snug">
            average time before Brent moves reach logistics invoices in Germany
          </p>
        </div>
      </div>

      {/* Subtext */}
      <p className="mt-8 text-sm text-slate-600">
        Most businesses find out when the invoice arrives. BrentLens tells you <strong className="font-bold text-slate-900">9 days before</strong> — with the exact amount calculated for your operation.
      </p>

      {/* CTA Button */}
      <div className="mt-6">
        <button
				onClick={() => {
					router.push("/onboarding");
				}}
				className="px-7 py-3.5 rounded-lg bg-gradient-to-br from-pur to-cyan text-white text-[15px] font-bold shadow-[0_4px_20px_rgba(124,58,237,0.35)] transition-all duration-180 inline-flex items-center gap-2 hover:translate-y-[-2px] hover:shadow-[0_8px_32px_rgba(124,58,237,0.5)]"
				>
				Reserve Founding Rates &rarr;
			</button>
      </div>
    </div>
  );
}