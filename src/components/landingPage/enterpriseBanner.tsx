import React from 'react';

export default function EnterpriseBanner() {
  return (
    <div className="w-full  mx-auto p-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-[#f3f4f6]/80 backdrop-blur-sm border border-slate-200/80 rounded-2xl p-6 sm:p-8 shadow-xs">
        {/* Content Area */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-bold tracking-widest text-slate-500 uppercase block">
            ENTERPRISE
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Built around your operations
          </h2>
          <p className="text-sm font-normal text-slate-500/90 leading-relaxed">
            $5M+ monthly fuel spend · Multi-country · Custom models · Unlimited seats
          </p>
        </div>

        {/* CTA Button */}
        <div className="flex-shrink-0">
          <button
            type="button"
            className="inline-flex items-center justify-center px-5 py-2.5 text-sm font-semibold text-slate-900 bg-slate-200/70 hover:bg-slate-200 active:bg-slate-300/80 border border-slate-300/60 rounded-xl transition-all duration-150 ease-in-out cursor-pointer group"
          >
            Contact sales
            <span className="ml-1.5 transition-transform duration-150 group-hover:translate-x-0.5">
              &rarr;
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}