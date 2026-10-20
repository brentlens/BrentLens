import { Save } from "lucide-react";
import ScenarioCard from "./ScenarioCard";
import BudgetComparison from "./BudgetComparison";
import ScenarioSlider from "./ScenarioSlider";
import { useEffect, useState } from "react";
import { ScenarioRules } from "@/configs/scenario_rules";
import { convertToDecimal } from "@/utils/converter";
import { ShockThresHolds } from "@/configs/shock_thresholds";

export default function ScenarioPlanner() {
    type RegimeName = keyof typeof ScenarioRules.market_regimes;

    const [sliderValues, setSliderValues] = useState<any>({});
    const [brentValues, setbrentValues] = useState<any>({})
    const [shockValues, setShockValues] = useState<any>({})
    const [scenarioValues, setScenarioValues] = useState<any>({})
    const [regimeList, setRegimeList] = useState<any>();
    const [scenariosCalc, setScenariosCalc] = useState({
        base: '',
        basePrice: 0,
        bear: '',
        bearPrice: 0,
        bull: '',
        bullPrice: 0
    })
    const fetchData = () => {
        let brentObj = JSON.parse(localStorage.getItem('brentObj') || '');
        let shockObj = JSON.parse(localStorage.getItem('shockObj') || '')
        if (brentObj && shockObj) {
            setbrentValues(brentObj)
            setShockValues(shockObj)
            setScenarioValues({
                price: brentObj.formattedPrice,
                impact: brentObj.totalCalc,
                budget: (Number(brentObj.spend_bracket) + Number(brentObj.totalCalc)).toString(),
                risk: shockObj?.latest_shock?.riskLevel,
                days: shockObj?.days_remaining + ' days'
            })
            shockCalculator(brentObj.brent_30_days_move, brentObj.impactLag, brentObj.sensitivity_score, brentObj.pass_through_rate
                , brentObj.currentPrice, brentObj.spend_bracket
            )
        }
    }

    const shockCalculator = async (brent30Days: number, impactLag: number, sensitivity_score: number, pass_through_rate: number, currentPrice: number
        , spendBucket: number
    ) => {
        let shock = ShockThresHolds['formula_weights']
        const Momentum_Score = Math.min(100, Math.abs(brent30Days) * 10);
        const InverseLag_Score = Math.max(0, 100 - (impactLag * 5));
        const passThroughScore = pass_through_rate * 100;

        const cal = (Momentum_Score * shock.brent_momentum) +
            ((sensitivity_score * 100) * shock.sector_sensitivity) +
            (passThroughScore * shock.pass_through_rate) +
            (InverseLag_Score * shock.inverse_lag);

        const finalShock = Math.round(cal);

        calculateProbability(finalShock, currentPrice, brent30Days, spendBucket)
    }

    const calculateProbability = (shock: number, currentPrice: number, brent30Days: number
        , spendBucket: number
    ) => {
        let regimeName: RegimeName;

        if (brent30Days > 0.05 && shock > 70) {
            regimeName = "strong_uptrend";
        } else if (brent30Days >= 0.02 && brent30Days <= 0.05) {
            regimeName = "moderate_uptrend";
        } else if (brent30Days > -0.02 && brent30Days < 0.02) {
            regimeName = "flat_sideways";
        } else if (brent30Days <= -0.02 && brent30Days >= -0.05) {
            regimeName = "moderate_downtrend";
        } else {
            regimeName = "strong_downtrend";
        }

        const regime = ScenarioRules.market_regimes[regimeName];

        setRegimeList({
            regime: regimeName,
            bear: Math.round(regime.bear_probability * 100),
            base: Math.round(regime.base_probability * 100),
            bull: Math.round(regime.bull_probability * 100),
        });

        const basePrice = currentPrice * (1 + brent30Days / 100);
        const baseChange = spendBucket * (Math.abs(basePrice - 100) / 100)


        const bearMove = basePrice * regime.bear_probability;
        const bullMove = basePrice * regime.bull_probability;

        const bearPrice = basePrice - bearMove;
        const bullPrice = basePrice + bullMove;

        const bearChange = spendBucket * ((basePrice * regime.bear_probability) / 100);
        const bullChange = spendBucket * ((basePrice * regime.bull_probability) / 100);

        setScenariosCalc({
            base: Math.round(baseChange).toString(),
            bull: convertToDecimal(bullChange),
            bear: convertToDecimal(bearChange),
            bullPrice: Number(convertToDecimal(bullPrice)),
            basePrice: Number(convertToDecimal(basePrice)),
            bearPrice: Number(convertToDecimal(bearPrice))
        });
    };


    useEffect(() => {
        fetchData()
    }, [])

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

                    <div className="">
                        <ScenarioSlider setScenarioValues={setScenarioValues} />
                    </div>


                    <div className="space-y-5">
                        <div className="grid md:grid-cols-3 gap-5">
                            <ScenarioCard
                                title="Current Situation"
                                price={brentValues.formattedPrice}
                                impact={brentValues.totalCalc}
                                budget={(Number(brentValues.spend_bracket) + Number(brentValues.totalCalc)).toString()}
                                risk={shockValues?.latest_shock?.riskLevel}
                                days={shockValues?.days_remaining + ' days'}
                            />

                            <ScenarioCard
                                active
                                title={"Your Scenario " + '$' + scenarioValues.price}
                                price={scenarioValues.price}
                                impact={scenarioValues.impact}
                                budget={scenarioValues.budget}
                                risk={scenarioValues.risk}
                                days={scenarioValues.days}
                            />

                            <ScenarioCard
                                danger
                                title={`Worst Case $${scenariosCalc.bullPrice}`}
                                price={'$' +`${scenariosCalc.bullPrice}`}
                                impact={`${scenariosCalc.bull}`}
                                budget={`${Number(brentValues.spend_bracket) + Number(scenariosCalc.bull)}`}
                                risk="CRITICAL"
                                days={(shockValues?.days_remaining - 2) + ' days'}
                            />

                        </div>

                        <BudgetComparison/>
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