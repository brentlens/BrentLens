import { Star } from "lucide-react";

const tags = [
  ["Bearish", "OPEC+ Production", "red"],
  ["Bearish", "Strait of Hormuz", "red"],
  ["Neutral", "USD / EUR Rate", "amber"],
  ["Neutral", "Global Demand", "amber"],
  ["Elevated", "Market Volatility", "pink"],
  ["Neutral", "Refinery Capacity", "amber"],
];

const insights = [
  {
    title: "OPEC+ Production",
    description:
      "No output increase committed. Next meeting June 1. Market does not expect reversal before then.",
  },
  {
    title: "Strait of Hormuz",
    description:
      "Partial closure continues. ~18–20% of global seaborne oil affected. No resolution timeline confirmed.",
  },
  {
    title: "USD / EUR Rate",
    description:
      "Stable at 1.082 (±2% band). Adds ~1.5% to effective cost for EUR-denominated operations. Incorporated in your estimate.",
  },
  {
    title: "Market Volatility",
    description:
      "30-day volatility at 28% vs 21% 12-month average. Reduces forecast reliability to 72%. Use the full cost range (€8K–€24K) for budget planning.",
  },
];

export default function MarketDrivers() {
  return (
    <>
    <div className="rounded-2xl border border-gray-200 bg-white py-5">

      <div className="border-b border-gray-200 px-6 py-4">
        <h2 className="font-semibold uppercase tracking-widest text-gray-600">
          Key Market Drivers
        </h2>
      </div>

      <div className="flex flex-wrap gap-4 p-6">

        {tags.map(([status, title, color]) => (
          <div
            key={title}
            className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 shadow-sm"
          >
            <span
              className={`rounded-full px-3 py-1 text-xs font-bold uppercase
              ${
                color === "red"
                  ? "bg-red-100 text-red-600"
                  : color === "pink"
                  ? "bg-pink-100 text-pink-600"
                  : "bg-amber-100 text-amber-600"
              }`}
            >
              {status}
            </span>

            <span className="font-medium text-gray-800">
              {title}
            </span>
          </div>
        ))}
      </div>

 <div className="space-y-6">

      {/* Insight Cards */}
      <div className="grid gap-4  md:grid-cols-2 px-6">
        {insights.map((item) => (
          <div
            key={item.title}
            className="rounded-xl border border-gray-200 bg-gray-100 p-3 shadow-sm">
            <h3 className="font-semibold text-gray-900 text-sm">
              {item.title}
            </h3>

            <p className="mt-2 text-sm leading-7 text-gray-500">
              {item.description}
            </p>
          </div>
        ))}
      </div>

      {/* Recommendation */}

    </div>

    </div>
      <div className="rounded-2xl border border-violet-200 bg-gradient-to-r from-violet-50 via-blue-50 to-cyan-50 p-6">
        <div className="flex items-start gap-5">
          {/* Icon */}
          <div className="flex h-12 w-20 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500 shadow-lg">
            <Star className="h-6 w-6 text-white" />
          </div>
          {/* Text */}
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-500">
              Executive Recommendation
            </p>
            <p className="mt-2 text-lg font-bold leading-relaxed text-gray-900">
              Lock procurement within the next 9 days. Increase fuel surcharge
              by 3–5% on new quotes this week. Add €3,200 reserve to May budget.
              Brief finance before Friday — this is a market-driven variance,
              not an operational failure.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}