import React from 'react';

// Array of FAQ objects for easy content updates
const faqData = [
  {
    question: "What is the founding member rate exactly?",
    answer: "The price you see now is your permanent price. When we raise prices for new customers after 3,500 seats fill, you keep paying your founding rate. Forever. No annual reviews, no legacy pricing that expires."
  },
  {
    question: "Is this a time limit or a seat limit?",
    answer: "Seat limit only. No deadline. If 3,500 seats fill in a week, the founding rate closes in a week. The counter on this page shows exactly how many remain."
  },
  {
    question: "How does BrentLens calculate my cost impact?",
    answer: "Four inputs: Brent 30-day change × your country's pass-through rate × your sector sensitivity score × your monthly fuel spend. Every input is configurable. The formula is transparent — we show you the basis for every number."
  },
  {
    question: "What if the dashboard is not ready when I sign up?",
    answer: "You get a personalised fuel exposure report immediately after signup based on your onboarding data. Full dashboard access is delivered when ready — and founding members are first in line."
  },
  {
    question: "Which industries does BrentLens support?",
    answer: "Logistics & freight, aviation, maritime, manufacturing, construction, and agribusiness. Each has its own sensitivity score, sector lag adjustment, and action signal templates calibrated to that industry's cost structure."
  },
  {
    question: "Can I cancel and rejoin at the founding rate later?",
    answer: "No. The founding rate is tied to your continuous subscription. If you cancel, your seat is released. You would rejoin at whatever the current price is at that time."
  }
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