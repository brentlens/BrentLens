const scenarios = [
  {
    name: "Base Case • 60%",
    color: "text-violet-500",
    bg: "bg-violet-50",

    brent: "$91.20",
    impact: "+€11,000",
    budget: "€172,000",

    trigger:
      "Status quo. Hormuz partially open. OPEC+ unchanged. Demand steady.",

    action:
      "Act now. Increase fuel surcharge 3–5%. Reserve €3,200. Review expiring contracts.",
  },

  {
    name: "Bull Case • 20%",
    color: "text-red-500",

    brent: "$98.00",
    impact: "+€24,200",
    budget: "€185,200",

    trigger:
      "Hormuz fully closes. Escalation extends. Supply shock drives Brent above $95.",

    action:
      "Emergency response. Pause fixed-price contracts. Activate fuel clauses.",
  },

  {
    name: "Bear Case • 20%",
    color: "text-green-500",

    brent: "$84.00",
    impact: "-€2,100",
    budget: "€158,900",

    trigger:
      "Surprise OPEC+ output increase. Hormuz reopens. Demand softens.",

    action:
      "Hold. Delay spot purchases. Lock current rates.",
  },
];

export default function ForecastTable() {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">

      <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
        <h2 className="font-semibold tracking-wide uppercase text-sm text-gray-600">
          Three Scenarios • 30-Day Brent Forecast
        </h2>

        <p className="text-sm text-gray-500">
          Updated Daily • May 1, 2026
        </p>
      </div>

      <table className="w-full">

        <thead className="bg-gray-50">
          <tr>
            <th className="p-4 text-sm text-left">Metric</th>
            {scenarios.map((s) => (
              <th
                key={s.name}
                className={`p-4 text-sm text-left ${s.bg ?? ""}`}
              >
                <span className={s.color}>{s.name}</span>
              </th>
            ))}
          </tr>
        </thead>

        <tbody>

          <Row
            title="Brent Target"
            values={scenarios.map((s) => (
              <span className={`font-bold ${s.color}`}>
                {s.brent}
              </span>
            ))}
          />

          <Row
            title="Your Cost Impact"
            values={scenarios.map((s) => (
              <span className={`font-bold ${s.color}`}>
                {s.impact}
              </span>
            ))}
          />

          <Row
            title="Budget Revision"
            values={scenarios.map((s) => (
              <span className="font-semibold">
                {s.budget}
              </span>
            ))}
          />

          <Row
            title="Trigger Conditions"
            values={scenarios.map((s) => s.trigger)}
          />

          <Row
            title="Recommended Action"
            values={scenarios.map((s) => (
              <span className={s.color}>{s.action}</span>
            ))}
          />

        </tbody>

      </table>
    </div>
  );
}

function Row({
  title,
  values,
}: {
  title: string;
  values: React.ReactNode[];
}) {
  return (
    <tr className="border-t border-gray-200 text-sm">

      <td className="w-52 p-5 font-semibold uppercase tracking-wide text-gray-500">
        {title}
      </td>

      {values.map((value, i) => (
        <td key={i} className="p-5 align-top">
          {value}
        </td>
      ))}
    </tr>
  );
}