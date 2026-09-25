import { Factory, HardHat, Plane, Ship, Sprout, Truck } from "lucide-react";
import React from "react";

export default function Industries() {
  return (
    <section id="industries" className="py-[100px] bg-indGrad transition-colors duration-300">
      <div className="inner max-w-300 mx-auto">
        <div className="text-center">
          <span className="section-tag">Who It Is Built For</span>
          <h2 className="section-h">Built for industries where fuel<br />drives the bottom line.</h2>
          <p className="section-sub">In these industries, energy pricing is a primary driver of margin — not an overhead. BrentLens gives procurement and operations teams the visibility to stay ahead of cost changes instead of reacting to them.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <svg className="absolute w-0 h-0">
				<defs>
					<linearGradient
					id="iconGradient"
					x1="0%"
					y1="0%"
					x2="100%"
					y2="100%"
					>
					<stop offset="0%" stopColor="#7C3AED" />
					<stop offset="55%" stopColor="#4F46E5" />
					<stop offset="100%" stopColor="#06B6D4" />
					</linearGradient>
				</defs>
			 </svg>
          <div className="bg-[var(--card-bg)] border border-bd rounded-2xl p-[28px_24px] transition-all duration-200 hover:border-pur/30 hover:-translate-y-[3px] hover:shadow-xl">
            <div className="w-[52px] h-[52px] mb-3.5">
			  <Truck className="w-[44px] h-[44px] text-[#4F46E5] stroke-[1.8]" />
            </div>
            <div className="text-16px font-bold text-ink mb-1.5 tracking-[-0.02em]">Logistics</div>
            <p className="text-[13px] text-ink3 leading-[1.65]">Fleet operators and freight businesses where fuel is the single largest operating cost and margin depends on getting ahead of price changes.</p>
          </div>

          <div className="bg-[var(--card-bg)] border border-bd rounded-2xl p-[28px_24px] transition-all duration-200 hover:border-pur/30 hover:-translate-y-[3px] hover:shadow-xl">
            <div className="w-[52px] h-[52px] mb-3.5">
				
			  <Ship className="w-[44px] h-[44px] text-[#4F46E5] stroke-[1.8]" />
            </div>
            <div className="text-16px font-bold text-ink mb-1.5 tracking-[-0.02em]">Maritime</div>
            <p className="text-[13px] text-ink3 leading-[1.65]">Vessel operators and port businesses running on bunker fuel where crude movements flow directly into voyage economics and chartering decisions.</p>
          </div>

          <div className="bg-[var(--card-bg)] border border-bd rounded-2xl p-[28px_24px] transition-all duration-200 hover:border-pur/30 hover:-translate-y-[3px] hover:shadow-xl">
            <div className="w-[52px] h-[52px] mb-3.5">
			

			<Factory className="w-[44px] h-[44px] text-[#4F46E5] stroke-[1.8]"/>
            </div>
            <div className="text-16px font-bold text-ink mb-1.5 tracking-[-0.02em]">Manufacturing</div>
            <p className="text-[13px] text-ink3 leading-[1.65]">Industrial operations where energy inputs, raw material costs, and inbound logistics all carry crude oil price exposure across long lead times.</p>
          </div>

          <div className="bg-[var(--card-bg)] border border-bd rounded-2xl p-[28px_24px] transition-all duration-200 hover:border-pur/30 hover:-translate-y-[3px] hover:shadow-xl">
            <div className="w-[52px] h-[52px] mb-3.5">
			
              <HardHat className="w-[44px] h-[44px] text-[#4F46E5] stroke-[1.8]" />
            </div>
            <div className="text-16px font-bold text-ink mb-1.5 tracking-[-0.02em]">Construction</div>
            <p className="text-[13px] text-ink3 leading-[1.65]">Heavy plant, machinery, and materials all tied to crude prices. Project margins are set months ahead — making early cost visibility critical.</p>
          </div>

          <div className="bg-[var(--card-bg)] border border-bd rounded-2xl p-[28px_24px] transition-all duration-200 hover:border-pur/30 hover:-translate-y-[3px] hover:shadow-xl">
            <div className="w-[52px] h-[52px] mb-3.5">
			
              <Sprout className="w-[44px] h-[44px] text-[#4F46E5] stroke-[1.8]" />
            </div>
            <div className="text-16px font-bold text-ink mb-1.5 tracking-[-0.02em]">Agriculture &amp; Agribusiness</div>
            <p className="text-[13px] text-ink3 leading-[1.65]">Diesel for machinery, energy-derived inputs, inbound and outbound freight — multiple crude oil exposure points across long seasonal cycles.</p>
          </div>

          <div className="bg-[var(--card-bg)] border border-bd rounded-2xl p-[28px_24px] transition-all duration-200 hover:border-pur/30 hover:-translate-y-[3px] hover:shadow-xl">
            <div className="w-[52px] h-[52px] mb-3.5">
			
              <Plane className="w-[44px] h-[44px] text-[#4F46E5] stroke-[1.8]" />
            </div>
            <div className="text-16px font-bold text-ink mb-1.5 tracking-[-0.02em]">Aviation</div>
            <p className="text-[13px] text-ink3 leading-[1.65]">Jet fuel tracks crude directly. For operators without institutional hedging, early market signals are the only real protection against cost volatility.</p>
          </div>

        </div>
      </div>
    </section>
  );
}