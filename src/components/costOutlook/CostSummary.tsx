const cards = [
  {
    title: "Expected Cost Increase",
    value: "+€8,400",
    desc: "vs April baseline",
    color: "text-red-500",
  },
  {
    title: "Budget Risk",
    value: "HIGH",
    desc: "Action required",
    color: "text-red-500",
  },
  {
    title: "Time to Impact",
    value: "9 days",
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

export default function CostSummary() {
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