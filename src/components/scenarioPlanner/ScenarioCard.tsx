type Props = {
  title: string;
  price: string;
  impact: string;
  budget: string;
  risk: string;
  days: string;
  active?: boolean;
  danger?: boolean;
};

export default function ScenarioCard({
  title,
  price,
  impact,
  budget,
  risk,
  days,
  active,
  danger,
}: Props) {
  return (
    <div
      className={`rounded-3xl border border-gray-100 p-6 shadow-sm ${
        active
          ? "border-violet-300 bg-violet-100"
          : "bg-white"
      }`}
    >
      <h3
        className={`text-xs uppercase tracking-wider font-semibold ${
          active
            ? "text-violet-500"
            : danger
            ? "text-red-500"
            : "text-gray-500"
        }`}
      >
        {title}
      </h3>

      <hr className="my-4 border-gray-300 " />

      <Metric title="Brent price" value={price} />
      <Metric title="Your cost impact" value={impact} />
      <Metric title="Budget revision" value={budget} />
      <Metric title="Risk level" value={risk} />
      <Metric title="Action window" value={days} />
    </div>
  );
}

function Metric({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="mb-4 ">
      <p className="text-gray-500 text-sm">{title}</p>

      <p className="text-2xl font-bold text-lg">{value}</p>
    </div>
  );
}