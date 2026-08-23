interface IExposureData {
  fuel_sensitivity: number;
  pass_through_rate: number;
  impact_lag: number;
  risk_category: string;
  shock_index:number;
}

export default function ExposureProfile({
  fuel_sensitivity,
  pass_through_rate,
  impact_lag,
  risk_category,
  shock_index
}:IExposureData) {
  const stats = [
    {
      title: "FUEL SENSITIVITY",
      value: `${fuel_sensitivity*100}/100`,
      subtitle: "Highest of all sectors",
    },
    {
      title: "PASS-THROUGH RATE",
      value: `${pass_through_rate}%`,
      subtitle: "Germany market model",
    },
    {
      title: "EXPECTED IMPACT LAG",
      value: `${impact_lag} days`,
      subtitle: "Until cost reaches invoices",
    },
    {
      title: "RISK CATEGORY",
      value: `${risk_category}`,
      subtitle: "Budget action required",
    },
  ];

  return (
    <div className="w-full rounded-2xl border border-[#E5E7EB] bg-[#F8FAFC] shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#E5E7EB] px-6 py-4">
        <h2 className="text-xl font-bold text-[#0F172A]">
          Your Exposure Profile
        </h2>

        <span className="rounded-full text-xs border border-[#FFB8C4] bg-[#FFF1F3] px-4 py-1 text-sm font-bold uppercase tracking-wide text-[#FF4B6E]">
          SHOCK INDEX {shock_index}/100 - {risk_category}
        </span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-4 p-6">
        {stats.map((item) => (
          <div
            key={item.title}
            className="rounded-2xl border border-[#D8DEE6] bg-[#F7F8FA] p-5"
          >
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#64748B]">
              {item.title}
            </p>

            <h3 className="mt-2 text-lg font-extrabold leading-none text-[#0F172A]">
              {item.value}
            </h3>

            <p className="mt-2 text-xs text-[#64748B]">
              {item.subtitle}
            </p>
          </div>
        ))}
      </div>

      {/* Alert */}
      <div className="px-6 pb-6">
        <div className="rounded-2xl border border-[#FFB8C4] bg-[#FFF1F3] px-5 py-4">
          <p className="text-sm leading-8 text-[#FF456A]">
            Your profile sits in the{" "}
            <span className="font-bold">
              highest risk quartile
            </span>{" "}
            — logistics + Germany + short lag = fast,
            high-sensitivity exposure. This combination is why
            BrentLens flagged this as HIGH priority.
          </p>
        </div>
      </div>
    </div>
  );
}