type Props = {
  title: string;
  value: string;
  color?: string;
};

export default function ReportMetric({
  title,
  value,
  color = "text-slate-900",
}: Props) {
  return (
    <div className="rounded-xl border border-gray-200 bg-slate-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
        {title}
      </p>

      <h3 className={`mt-2 text-xl font-bold ${color}`}>
        {value}
      </h3>
    </div>
  );
}