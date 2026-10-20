import { BrentData } from "@/types/dashboard";
import { useEffect, useState } from "react";

export default function CostSummary() {


  const [brentData, setBrentData] = useState<BrentData>({
    pass_through_rate: 0,
    sensitivity_score: 0,
    spend_bracket: 0,
    brent_30_days_move: 0,
    sectorName: '',
    impactLag: 0,
    currentPrice: 0,
    formattedPrice: '',
    additionalCostToday: 0,
    totalCalc: 0,
    days_remaining: 0,
    latest_shock: null,
    last_shock: null
  })

  const fetchLatestData = async () => {
    let brentObj = JSON.parse(localStorage.getItem('brentObj') || '');
    let shockObj = JSON.parse(localStorage.getItem('shockObj') || '')
    if (brentData) {
      setBrentData({
        ...brentObj,
        ...shockObj
      })
    }
  };

  const getLastMonthName = (): string => {
    const date = new Date();
    date.setMonth(date.getMonth() - 1);

    let name = date.toLocaleString("en-US", {
      month: "long",
    });
    return name + " baseline"
  };

   const cards = [
    {
      title: "Expected Cost Increase",
      value: `+${brentData.totalCalc}`,
      desc: `vs ${getLastMonthName()}`,
      color: "text-red-500",
    },
    {
      title: "Budget Risk",
      value: `${brentData.latest_shock?.riskLevel ?? 'N/A'}`,
      desc: "Action required",
      color: "text-red-500",
    },
    {
      title: "Time to Impact",
      value: `${brentData.days_remaining} days`,
      desc: "Logistics sector lag",
      color: "text-red-500",
    },
    {
      title: "Forecast Reliability",
      value: "72%",
      desc: "Current model",
      color: "text-violet-500",
    },
  ];

  useEffect(() => {
    fetchLatestData()
  }, [])

  return (
    <div className="grid overflow-hidden rounded-2xl border border-gray-300  bg-gray-100 md:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.title}
          className="border-r border-gray-300 last:border-r-0 p-4"
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">
            {card.title}
          </p>

          <h2 className={`mt-3 text-2xl font-bold ${card.color}`}>
            {card.value}
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            {card.desc}
          </p>
        </div>
      ))}
    </div>
  );
}