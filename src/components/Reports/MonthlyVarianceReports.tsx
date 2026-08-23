import { Download, FileText, Table2, Send, } from "lucide-react";
import ReportPreview from "./ReportPreview";
import PreviousReports from "./PreviousReports";

export default function MonthlyVarianceReports() {
    return (
        <div className="p-10 mx-40">
            <div className="mx-auto space-y-6 ">

                {/* Header */}
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-violet-600">
                            Finance Reports • Logistics • Germany
                        </p>
                        <h1 className="mt-2 text-4xl font-bold">
                            Monthly Variance Reports
                        </h1>
                    </div>
                    <button className="rounded-xl text-xs border border-gray-200 bg-white px-5 py-3 shadow-sm hover:bg-gray-50">
                        Export Options
                    </button>
                </div>
                {/* Export Types */}
                <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-5 py-3 shadow-sm">
                        <FileText size={18} />
                        <span className="font-semibold">PDF</span>
                        <span className="text-gray-500">
                            Finance-language report for leadership
                        </span>
                    </div>
                    <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-5 py-3 shadow-sm">
                        <Table2 size={18} />
                        <span className="font-semibold">CSV</span>
                        <span className="text-gray-500">
                            Raw monthly data for Excel
                        </span>
                    </div>

                </div>

                <ReportPreview />


                <PreviousReports />

            </div>
        </div>
    );
}