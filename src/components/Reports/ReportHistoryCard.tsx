import { Download, Eye, FileSpreadsheet } from "lucide-react";

type Props = {
  month: string;
  title: string;
  variance: string;
  positive?: boolean;
  description: string;
};

export default function ReportHistoryCard({
  month,
  title,
  variance,
  positive,
  description,
}: Props) {
  return (
    <div className="rounded-3xl border border-slate-200  bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg">

      <p className="text-xs font-bold uppercase tracking-[0.18em] text-violet-600">
        {month}
      </p>

      <h3 className="mt-3 text-lg font-bold text-slate-900">
        {title}
      </h3>

      <div
        className={`mt-3 text-5xl font-bold text-xl ${
          positive ? "text-emerald-500" : "text-red-500"
        }`}
      >
        {variance}
      </div>

      <p className="mt-5 leading-8 text-sm text-slate-500">
        {description}
      </p>

      <div className="mt-8 flex items-center gap-3">

        <button className="flex flex-1 items-center text-sm justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-500 px-5 py-3 font-semibold text-white shadow-md transition hover:shadow-lg">
          <Download size={18} />
          PDF
        </button>

        <button className="rounded-xl border px-5 py-3 border-gray-300 text-sm font-semibold hover:bg-slate-50">
          CSV
        </button>

        <button className="rounded-xl border p-3 hover:bg-slate-50 text-sm border-gray-300">
          <Eye size={18} />
        </button>

      </div>
    </div>
  );
}