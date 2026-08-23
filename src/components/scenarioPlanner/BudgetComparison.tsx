export default function BudgetComparison() {
  return (
    <div className="rounded-3xl border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
        <h2 className="font-semibold uppercase tracking-widest text-gray-500 text-xs">
          Compare with Current Budget
        </h2>
        <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-bold text-violet-600">
          PRO
        </span>
      </div>
      <div className="p-6 space-y-6">
        <p className="text-gray-500 ">
          Enter your budgeted fuel assumption to compare.
        </p>
        <div className="flex items-center gap-3 text-sm">
          <span>Your budget assumed Brent at</span>
          <input
            type="number"
            defaultValue={85}
            className="w-40 rounded-xl border border-gray-200 px-4 py-3 font-semibold"
          />
          <span>/ BBL</span>
        </div>
        <div className="overflow-hidden rounded-2xl border border-gray-200">
          <TableRow
            label="Monthly fuel cost assumed"
            value="€161,000"
          />
          <TableRow
            label="Monthly fuel cost at your scenario"
            value="€173,600"
            badge="+€12,600"
          />
          <TableRow
            label="Annual budget variance"
            value="+€151,200 / year"
            badge="Significant overspend"
          />
          <TableRow
            label="Reserve required"
            value="€3,150 / month"
          />
        </div>
      </div>
    </div>
  );
}

function TableRow({
  label,
  value,
  badge,
}: {
  label: string;
  value: string;
  badge?: string;
}) {
  return (
    <div className="flex items-center justify-between border-b border-gray-200 p-5 last:border-none">

      <span className="text-gray-500">
        {label}
      </span>

      <div className="flex items-center gap-3">

        <span className="font-bold text-red-500">
          {value}
        </span>

        {badge && (
          <span className="rounded bg-red-100 px-2 py-1 text-xs font-semibold text-red-500">
            {badge}
          </span>
        )}

      </div>

    </div>
  );
}