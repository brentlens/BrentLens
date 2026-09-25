import React from 'react';

// Array of FAQ objects for easy content updates
const faqData = [
  {
    question: "What exactly does BrentLens do?",
    answer:
      "BrentLens tracks Brent crude movements and translates them into estimated cost impact for your business. Instead of just showing you that oil moved, it helps you understand what that movement could mean for your fuel costs.",
  },
  {
    question: "Is BrentLens just another oil-price tracker?",
    answer:
      "No. BrentLens is built around the impact of oil prices, not just the price itself. It connects Brent movement with your country, industry, fuel exposure, and spending so you can see what the movement could mean for your costs.",
  },
  {
    question: "Who is BrentLens built for?",
    answer:
      "BrentLens is built for businesses where fuel costs can materially affect margins — including logistics, maritime, aviation, manufacturing, construction, and agribusiness.",
  },
  {
    question: "What do I get as a founding member?",
    answer:
      "You get permanent access at the founding rate, your personalised fuel exposure assessment, and priority access to the BrentLens dashboard and future founding-member features.",
  },
  {
    question: "What happens after I join?",
    answer:
      "You complete a short onboarding covering your industry, country, business scale, and fuel exposure. BrentLens then uses this information to build your initial fuel-impact profile. As the platform launches, your account will be ready for dashboard access.",
  },
  {
    question: "Does my business size affect my subscription price?",
    answer:
      "No. Your onboarding information is used to personalise your fuel-impact analysis, not to determine your founding membership rate.",
  },
  {
    question: "Is the cost impact an exact prediction?",
    answer:
      "No. BrentLens provides an estimated impact based on the information available and the assumptions used in your profile. It is designed to help you understand exposure and direction — not replace your actual fuel invoices, contracts, or financial models.",
  },
  {
    question: "Does BrentLens predict where oil prices will go?",
    answer:
      "BrentLens provides a 30-day outlook alongside current Brent movement and business-impact analysis. Forecasts are estimates, not guarantees, and market conditions can change quickly.",
  },
  
];

export default function Faq() {
  return (
    <section id="faq" className="min-h-screen bg-[#F8FAFC] py-16 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <span className="text-xs font-bold tracking-widest text-indigo-600 uppercase">
            FAQ
          </span>
          <h2 className="mt-2 text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Common questions.
          </h2>
        </div>

        {/* FAQ Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {faqData.map((item, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-md transition-shadow duration-200"
            >
              <h3 className="text-lg font-bold text-slate-900 mb-3 leading-snug">
                {item.question}
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                {item.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}