import {
  CheckCircle2,
  Star,
} from "lucide-react";

export default function ProcurementActionSignal() {
  return (
    <div className="w-full rounded-2xl border border-[#bfe6df] bg-[#edf9f7] p-5 shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#11b5a4] shadow">
            <Star className="h-5 w-5 fill-white text-white" />
          </div>

          <div>
            <h2 className="text-lg font-extrabold uppercase tracking-wide text-[#0b9f93]">
              PROCUREMENT ACTION SIGNAL
            </h2>

            <p className="mt-1 text-[10px] text-[#718096]">
              Logistics · Germany · Updated 14:30 UTC
            </p>
          </div>
        </div>

        <div className="text-right">
          <h3 className="text-lg font-extrabold text-[#ff3b73]">
            €8,400 within 9 days
          </h3>

          <p className="text-[10px] text-[#718096]">
            Expected business impact
          </p>
        </div>
      </div>

      {/* Alert */}
      <div className="mt-6 flex items-center justify-between rounded-xl border border-[#f4b5bf] bg-[#fdecef] px-5 py-2">
        <p className="text-lg text-[#ff4f73]">
          Optimal action window before full cost impact arrives. Window
          shrinks as Brent accelerates.
        </p>

        <span className="text-lg font-bold text-[#ff3b73]">
          9 days
        </span>
      </div>

      {/* Checklist */}
      <div className="mt-6 space-y-4">
        {[
          "Increase fuel surcharge by 3-5% on all new customer quotes issued this week",
          "Add €3,200 contingency to May fuel budget — share with finance before Friday",
          "Review contracts expiring in 30 days — renegotiate fuel clauses before the cost arrives",
          "Notify procurement and finance — incoming variance is market-driven, not operational",
        ].map((item) => (
          <div key={item} className="flex items-start gap-3">
            <CheckCircle2
              className="mt-0.5 h-6 w-6 shrink-0"
              color="#52d7b5"
              fill="#dff9f0"
            />

            <p className="text-[12px] font-medium text-[#34495e]">
              {item}
            </p>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-7 rounded-xl border border-[#d8e6e3] bg-[#f3f7f7] px-5 py-4">
        <p className="text-[13px] leading-8 text-[#617385]">
          <span className="font-bold text-[#1f2937]">
            Why now:
          </span>{" "}
          Brent +4.1% over 30 days and still accelerating. Shock Index is
          87/100. German diesel follows within 9–11 days at 78%
          pass-through. Logistics sensitivity 92/100 — highest of all
          sectors.
        </p>
      </div>
    </div>
  );
}