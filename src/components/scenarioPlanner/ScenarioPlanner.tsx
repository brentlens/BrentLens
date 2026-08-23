import { Save } from "lucide-react";
import ScenarioCard from "./ScenarioCard";
import BudgetComparison from "./BudgetComparison";
import ScenarioSlider from "./ScenarioSlider";

export default function ScenarioPlanner() {
    return (
        <main className="p-10 mx-40">
            <div className="m-auto space-y-6">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-xs uppercase tracking-[0.25em] text-violet-600 font-semibold">
                            PRO FEATURE • LOGISTICS • GERMANY
                        </p>

                        <h1 className="text-2xl font-bold mt-2">
                            Scenario Planner
                        </h1>
                    </div>

                    <button className="flex items-center text-sm gap-2 rounded-xl border border-gray-200 bg-gray-100 px-5 py-2 shadow-sm hover:bg-gray-50">
                        <Save size={18} />
                        Save Scenario
                    </button>
                </div>

                {/* Banner */}

                <div className="rounded-xl border border-violet-200 bg-violet-100 px-6 py-3 text-violet-500">
                    Move the slider to model any Brent price scenario. Your personalised
                    cost impact updates live.
                </div>

                {/* Main */}

                <div className="grid gap-5 lg:grid-cols-[420px_1fr]">

                    <ScenarioSlider />


                    <div className="space-y-5">
                        <div className="grid md:grid-cols-3 gap-5">
                            <ScenarioCard
                                title="Current Situation"
                                price="$87.42"
                                impact="+€8,400"
                                budget="€169,400"
                                risk="HIGH"
                                days="9 days"
                            />

                            <ScenarioCard
                                active
                                title="Your Scenario ($95)"
                                price="$95.00"
                                impact="+€12,600"
                                budget="€173,600"
                                risk="HIGH"
                                days="9 days"
                            />

                            <ScenarioCard
                                danger
                                title="Worst Case ($98)"
                                price="$98.00"
                                impact="+€24,200"
                                budget="€185,200"
                                risk="CRITICAL"
                                days="7 days"
                            />

                        </div>

                        <BudgetComparison />
                    </div>
                    <div className=""></div>

                    <div className="rounded-3xl border border-gray-200 bg-white shadow-sm overflow-hidden">
                        {/* Header */}
                        <div className="border-b border-gray-200 px-6 py-3">
                            <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-slate-500">
                                Scenario Notes
                            </h2>
                        </div>

                        {/* Body */}
                        <div className="p-3">
                            <textarea
                                rows={3}
                                placeholder="Add notes about this scenario — contract decisions, budget implications, team briefing points..."
                                className="
            w-full
            resize-y
            rounded-2xl
            border
            border-gray-300
            bg-white
            px-5
            py-4
            text-base
            text-slate-700
            placeholder:text-slate-400
            outline-none
            transition
            focus:border-violet-500
            focus:ring-4
            focus:ring-violet-100
          "
                            />
                        </div>
                    </div>

                </div>

            </div>
        </main>
    );
}