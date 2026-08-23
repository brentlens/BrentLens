import { Download, Send } from "lucide-react";
import ReportMetric from "./ReportMetric";

export default function ReportPreview() {
  return (
    <div className="rounded-3xl border border-gray-200 bg-white shadow-sm overflow-hidden">

      {/* Header */}

      <div className="flex items-center justify-between border-b border-gray-200 px-6 py-3">

        <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
          Report Preview · How your PDF looks
        </h2>

        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-600">
          APRIL 2026
        </span>

      </div>

      {/* Paper */}

      <div className="flex justify-center bg-gray-50 p-10">

        <div className="w-[620px] rounded-2xl bg-white p-8 shadow-xl">

          {/* Logo */}

          <div className="flex justify-between">

            <div>
              <h2 className="text-xl font-bold text-violet-600">
                BrentLens
              </h2>

              <p className="uppercase text-xs tracking-wider text-gray-500">
                Impact Intelligence
              </p>
            </div>

            <div className="text-right">
              <h3 className="font-semibold text-sm">
                APRIL 2026
              </h3>

              <p className="text-gray-500 text-sm">
                Logistics · Germany
              </p>
            </div>

          </div>

          <div className="my-6 h-[2px] bg-violet-500" />

          <h2 className="text-xl font-bold">
            Monthly Cost Variance Report
          </h2>

          <p className="mt-2 text-gray-500 text-sm">
            Prepared for: Akash Kumar · Generated: May 1, 2026 · Forecast Reliability: 72%
          </p>

          {/* Metrics */}

          <div className="mt-8 grid grid-cols-3 gap-4">

            <ReportMetric
              title="Cost Variance"
              value="+€8,400"
              color="text-red-500"
            />

            <ReportMetric
              title="Baseline Budget"
              value="€161,000"
            />

            <ReportMetric
              title="Revised Forecast"
              value="€169,400"
              color="text-red-500"
            />

            <ReportMetric
              title="Brent Movement"
              value="+4.1%"
              color="text-red-500"
            />

            <ReportMetric
              title="Margin Impact"
              value="-1.8%"
              color="text-red-500"
            />

            <ReportMetric
              title="Historical Accuracy"
              value="83%"
              color="text-emerald-600"
            />

          </div>

          {/* Summary */}

          <div className="mt-6 rounded-xl text-sm border-l-4 border-violet-600 bg-slate-50 p-5 leading-8 text-gray-700">

            The €8,400 fuel variance for April 2026 is entirely attributable to
            Brent crude oil movements rather than operational changes. Brent
            increased 4.1% during the forecast window, producing an estimated
            cost impact after a 9-day logistics lag.

          </div>

          {/* Bottom Boxes */}

          <div className="mt-6 grid grid-cols-2 gap-4">

            <div className="rounded-xl border border-gray-200 bg-slate-50 p-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Recommended for May
              </h3>

              <p className="mt-3 leading-7 text-sm">
                Reserve €3,200 additional budget.
                Increase surcharge 3–5%.
                Review expiring contracts.
              </p>
            </div>

            <div className="rounded-xl border border-gray-200 bg-slate-50 p-4">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Prediction vs Actual
              </h3>

              <p className="mt-3 leading-7 text-sm">
                Predicted +5.2%<br />
                Actual +5.0%<br />
                Timing off by 1 day
              </p>
            </div>

          </div>

          {/* Footer */}

          <div className="mt-8 flex justify-between border-t border-gray-200 pt-4 text-xs text-gray-400">
            <span>BrentLens · Impact Intelligence</span>
            <span>Page 1 of 2</span>
          </div>

        </div>
      </div>

        {/* Bottom Buttons */}
        <div className="flex justify-center gap-4 bg-gray-50 pb-10">
          <button className="flex items-center gap-2 text-sm rounded-xl bg-gradient-to-r from-violet-600 to-blue-500 px-4 py-2 font-semibold text-white shadow-lg">
            <Download size={18} />
            Download PDF
          </button>
          <button className="flex items-center gap-2 rounded-xl text-sm border border-gray-200 bg-white px-4 py-2">
            <Download size={18} />
            Export CSV
          </button>
          <button className="flex items-center gap-2 rounded-xl border text-sm border-gray-200 bg-white px-4 py-2">
            <Send size={18} />
            Send Report
          </button>
        </div>


    </div>
  );
}