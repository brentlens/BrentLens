"use client";

import Footer from "@/components/footer";
import Accuracy from "@/components/landingPage/accuracy";
import Analytics from "@/components/landingPage/analytics";
import CTA from "@/components/landingPage/cta";
import DashboardPreview from "@/components/landingPage/dashboardPreview";
import Faq from "@/components/landingPage/faq";
import Features from "@/components/landingPage/featureComp";
import FoundingPricing from "@/components/landingPage/foundingPricing";
import Hero from "@/components/landingPage/hero";
import HowItWorks from "@/components/landingPage/howItWorks";
import Industries from "@/components/landingPage/industries";
import Navbar from "@/components/landingPage/navbar";
import NewsInsightCard from "@/components/landingPage/newsInsight";
import Pricing from "@/components/landingPage/pricing";
import ScenarioPlannerSliderCard from "@/components/landingPage/scenarioPlannerSliderCard";

export default function Home() {
  const isPreLanding = true;
  return (
   <div className="relative min-h-screen bg-bg text-ink selection:bg-pur/30 transition-colors duration-300">
      {/* Structural layout components wrapper */}
      <Navbar isPreLanding={isPreLanding}/>
      <main className="relative z-10 w-full">
        <Hero isPreLanding={isPreLanding}/>
		<ScenarioPlannerSliderCard/>
		{isPreLanding ? <NewsInsightCard/> :(<DashboardPreview />)}
        <HowItWorks />
        <Analytics />
        <Features />
        <Industries />
        <Accuracy />
		{isPreLanding ? <FoundingPricing/> :(<Pricing />)}
		<Faq/>
        <CTA />
      </main>
      <Footer />
    </div>
  );
}