"use client";

import { useRouter } from "next/navigation";

export default function CTA({
  isPreLanding = true,
}: {
  isPreLanding?: boolean;
}) {
	const router = useRouter();
  return (
    <section className="py-[120px] bg-ctaGrad text-center relative overflow-hidden transition-colors duration-300 before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-[600px] before:h-[600px] before:rounded-full before:bg-[radial-gradient(circle,rgba(124,58,237,0.1)_0%,transparent_70%)] before:pointer-events-none">
      <div className="inner relative z-10">
        <span className="section-tag block text-center">{isPreLanding?"":"Get Started"}</span>
        <h2 className="text-[28px] sm:text-[4vw] md:text-[50px] font-black text-ink tracking-ctaTight leading-[1.1] mb-4">
          The cost was decided before you saw it.<br />
          <span className="gtext">Change when you find out.</span>
        </h2>
        <p className="text-[16px] text-ink3 mb-9">
          14 days free. Full access. No credit card required. Cancel any time.
        </p>
        
		{isPreLanding ?
		<>
		<div className="flex gap-3 justify-center flex-wrap mb-9">
			<button
				onClick={() => {
					router.push("/onboarding");
				}}
				className="px-7 py-3.5 rounded-lg bg-gradient-to-br from-pur to-cyan text-white text-[15px] font-bold shadow-[0_4px_20px_rgba(124,58,237,0.35)] transition-all duration-180 inline-flex items-center gap-2 hover:translate-y-[-2px] hover:shadow-[0_8px_32px_rgba(124,58,237,0.5)]"
				>
				Reserve Founding Rates &rarr;
			</button>
			<button
				onClick={() => {
					router.push("/waitlist");
				}}
				className="px-7 py-3.5 rounded-lg border-[1.5px] border-bd2 bg-surf text-ink text-[15px] font-semibold transition-all duration-180 inline-flex items-center gap-2 hover:border-pur2 hover:text-pur2 hover:bg-pur/12"
				>
				Join Waitlist Free
			</button>
          </div>
		</>:<>
		<button 
          onClick={() => {router.push("/onboarding");}}
          className="px-8 py-3.5 rounded-lg bg-gradient-to-br from-pur to-cyan text-white text-[15px] font-bold shadow-[0_4px_20px_rgba(124,58,237,0.35)] transition-all duration-180 inline-flex items-center gap-2 mx-auto hover:translate-y-[-2px] hover:shadow-[0_8px_32px_rgba(124,58,237,0.5)]"
        >
          Start Free Trial &rarr;
        </button>
		</>}
        <div className="mt-4 text-[13px] text-ink3">
			
			{isPreLanding ? 
			<> 
			<div className="flex gap-2 justify-center items-center">
				12 of 3,500 founding seats claimed
				<div className="w-[3px] h-[3px] rounded-full bg-bd2" />
				Seat limit, not a time limit
				<div className="w-[3px] h-[3px] rounded-full bg-bd2" />
				Rate locked forever
			</div>
			</>:"Trusted by procurement and operations teams across logistics, maritime, and manufacturing"}
        </div>
      </div>
    </section>
  );
}