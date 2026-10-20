import { useEffect, useState } from "react";

interface BerntObj {
  brentValues: any
}

interface BrentChanged {
  monthlyCost: number;
  extraAmt: number;
  spendBracket: number;
  yearlyCost: number;
  profit: boolean;
}

export default function BudgetComparison() {

  const [berentChanged, setBrentChanged] = useState<BrentChanged>();
  const [brentPrice, setBrentPrice] = useState<number>(85)

  const calculate = () => {
    const brentObj = JSON.parse(localStorage.getItem("brentObj") || "null");

    if (brentObj) {
      const inputPrice = brentPrice;
      const currPrice = brentObj.currentPrice;

      // 21.9176% -> 21.9% -> 0.219
      const diff =Math.round(((currPrice - inputPrice) / inputPrice) * 1000) / 1000;

      const extraAmt = Math.round(brentObj.spend_bracket *diff *brentObj.pass_through_rate *brentObj.sensitivity_score);

      const newMonthlyCost = Math.round(brentObj.spend_bracket + extraAmt);

      const yearlyVariance = extraAmt * 12;

      const monthlyReserve = extraAmt;

      setBrentChanged({
        monthlyCost: Math.abs(monthlyReserve),
        extraAmt: Math.abs(extraAmt),
        spendBracket: Math.abs(newMonthlyCost),
        yearlyCost: Math.abs(yearlyVariance),
        profit: inputPrice < currPrice ? false : true
      });
    }
  };

  useEffect(() => {
    calculate()
  }, [brentPrice])

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
            value={brentPrice}
            className="w-40 rounded-xl border border-gray-200 px-4 py-3 font-semibold"
            onChange={(e) => setBrentPrice(Number(e.target.value))}
          />
          <span>/ BBL</span>
        </div>
        <div className="overflow-hidden rounded-2xl border border-gray-200">
          <TableRow
            label="Monthly fuel cost assumed"
            value={` ${berentChanged?.profit ? '+' : '-'}${berentChanged?.spendBracket.toString() || '0'}`}
            profit={berentChanged?.profit || false}
          />
          <TableRow
            label="Monthly fuel cost at your scenario"
            value={ `${berentChanged?.profit ? '+' : '-'} ${berentChanged?.spendBracket.toString() || ''}`}
            badge={` ${berentChanged?.profit ? '+' : '-'}${berentChanged?.extraAmt.toString() || ''}`}
            profit={berentChanged?.profit || false}

          />
          <TableRow
            label="Annual budget variance"
            value={` ${berentChanged?.profit ? '+' : '-'}${berentChanged?.yearlyCost}  / year`}
            badge={` ${berentChanged?.profit ? 'Savings' : 'Significant overspend'} `}
            profit={berentChanged?.profit || false}

          />
          <TableRow
            label="Reserve required"
            value={` ${berentChanged?.profit ? '+' : '-'} ${berentChanged?.monthlyCost} / month`}
            profit={berentChanged?.profit || false}

          />
        </div>
      </div>
    </div>
  );
}

function TableRow({
  label,
  value,
  profit,
  badge,
}: {
  label: string;
  value: string;
  profit:boolean;
  badge?: string;
}) {
  return (
    <div className="flex items-center justify-between border-b border-gray-200 p-5 last:border-none">

      <span className="text-gray-500">
        {label}
      </span>

      <div className="flex items-center gap-3">

        <span className={`font-bold  ${profit ? 'text-green-500' : 'text-red-500'}  `}>
          {value}
        </span>

        {badge && (
          <span className={`rounded px-2 py-1 text-xs font-semibold ${profit ? 'text-green-500  bg-green-100' : 'text-red-500  bg-red-100'}`}>
            {badge}
          </span>
        )}

      </div>

    </div>
  );
}