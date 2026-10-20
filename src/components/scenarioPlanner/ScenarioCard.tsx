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

      <Metric title="Brent price" value={formatCurrency(price, false)} />
      <Metric title="Your cost impact" value={formatCurrency(impact)} />
      <Metric title="Budget revision" value={formatCurrency(budget, false)} />
      <Metric title="Risk level" value={risk} />
      <Metric title="Action window" value={days} />
    </div>
  );
}
  const formatCurrency = (
  val: string | number,
  showSign: boolean = true
) => {
  let numericVal: number;

  if (typeof val === "number") {
    numericVal = val;
  } else {
    // Strip out $, commas, and whitespace before parsing
    const cleanedString = String(val).replace(/[\$,\s]/g, "");
    numericVal = parseFloat(cleanedString) || 0;
  }

  const sign = numericVal >= 0 ? "+" : "-";
  const formatted = Math.abs(numericVal).toLocaleString("en-US");

  return showSign
    ? `${sign}$${formatted}`
    : `$${formatted}`;
};
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