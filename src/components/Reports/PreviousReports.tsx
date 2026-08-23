import { Download, FileSpreadsheet, Eye } from "lucide-react";
import ReportHistoryCard from "./ReportHistoryCard";

const reports = [
  {
    month: "MARCH 2026",
    title: "March Cost Variance Report",
    variance: "+€14,200",
    positive: false,
    description:
      "Brent +8.2% • Hormuz disruption • Highest single-month variance. Predicted 11 days early. Historical Accuracy: 94%.",
  },
  {
    month: "FEBRUARY 2026",
    title: "February Cost Variance Report",
    variance: "-€1,800",
    positive: true,
    description:
      "Brent −2.1% • Demand softness • Cost reduction of €1,800. Downward move predicted 8 days early.",
  },
  {
    month: "JANUARY 2026",
    title: "January Cost Variance Report",
    variance: "+€4,100",
    positive: false,
    description:
      "Brent +2.4% • Mild winter demand • Moderate variance. Predicted 10 days early. Timing: ±1.2 days.",
  },
  {
    month: "DECEMBER 2025",
    title: "December Cost Variance Report",
    variance: "+€6,700",
    positive: false,
    description:
      "Brent +3.8% • Winter demand peak • Holiday logistics surge amplified exposure. Historical Accuracy: 87%.",
  },
];

export default function PreviousReports() {
  return (
    <section className="space-y-4">
      <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">
        Previous Reports
      </h2>

      <div className="grid gap-6 xl:grid-cols-4 md:grid-cols-2">
        {reports.map((report) => (
          <ReportHistoryCard key={report.month} {...report} />
        ))}
      </div>
    </section>
  );
}