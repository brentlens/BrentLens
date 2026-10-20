import { ScenarioRules } from "@/configs/scenario_rules";
import { convertToDecimal } from "@/utils/converter";
import { useEffect, useState } from "react";
import LoaderOverlay from "../Loader";
import { ShockThresHolds } from "@/configs/shock_thresholds";

export default function ForecastTable() {
  const [loading, SetLoading] = useState(true)
  type RegimeName = keyof typeof ScenarioRules.market_regimes;
  const [regimeList, setRegimeList] = useState<any>();
  const [scenariosCalc, setScenariosCalc] = useState({
    base: '',
    basePrice: 0,
    bear: '',
    bearPrice: 0,
    bull: '',
    bullPrice: 0
  })
  const [brentData,setBrentData] = useState({
     pass_through_rate: 0,
    sensitivity_score: 0,
    spend_bracket: 0,
    brent_30_days_move: 0,
    sectorName: '',
    impactLag: 0,
    currentPrice: 0,
    formattedPrice: '',
    additionalCostToday: 0,
    totalCalc: 0,
    days_remaining: 0,
    latest_shock: null,
    last_shock: null
  });

  // const scenarioCalculator = (brent30Days: number, sensitivity_score: number, pass_through_rate: number, currentPrice: number, spend_bracket: number, bearVolatility: number, bullVolatility: number): number => {
  //   const basePrice = currentPrice * (1 + brent30Days / 100);
  //   const baseChange = (basePrice - currentPrice) / currentPrice;

  //   const bearPrice = basePrice - bearVolatility;
  //   const bullPrice = basePrice + bullVolatility;

  //   const bearChange = (bearPrice - currentPrice) / currentPrice;
  //   const bullChange = (bullPrice - currentPrice) / currentPrice;

  //   const baseImpact = spend_bracket * baseChange * pass_through_rate * sensitivity_score;
  //   const bearImpact = spend_bracket * bearChange * pass_through_rate * sensitivity_score;
  //   const bullImpact = spend_bracket * bullChange * pass_through_rate * sensitivity_score;

  //   // setScenariosCalc({
  //   //   base: Math.round(baseImpact).toString(),
  //   //   bull: convertToDecimal(bullImpact),
  //   //   bear: convertToDecimal(bearImpact),
  //   //   bullPrice: Number(convertToDecimal(bullPrice)),
  //   //   basePrice: Number(convertToDecimal(basePrice)),
  //   //   bearPrice: Number(convertToDecimal(bearPrice))
  //   // })
  //   return 0;
  // }

  const calculateProbability = (shock: number, currentPrice: number, brent30Days: number
    , spendBucket:number
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
    const baseChange = spendBucket * (Math.abs(basePrice-100)/100)  


    const bearMove = basePrice * regime.bear_probability;
    const bullMove = basePrice * regime.bull_probability;

    const bearPrice = basePrice - bearMove;
    const bullPrice = basePrice + bullMove;

    const bearChange = spendBucket * ((basePrice * regime.bear_probability)/100);
    const bullChange = spendBucket * ((basePrice * regime.bull_probability)/100);
    
    setScenariosCalc({
      base: Math.round(baseChange).toString(),
      bull: convertToDecimal(bullChange),
      bear: convertToDecimal(bearChange),
      bullPrice: Number(convertToDecimal(bullPrice)),
      basePrice: Number(convertToDecimal(basePrice)),
      bearPrice: Number(convertToDecimal(bearPrice))
    });

  };

  const scenarios = [
    {
      name: `Base Case • ${regimeList?.base}%`,
      color: "text-violet-500",
      bg: "bg-violet-50",
      brent: `$${scenariosCalc.basePrice}`,
      impact: `$${scenariosCalc.base}`,
      budget: `$${Number(brentData.spend_bracket) + Number(scenariosCalc.base)}`,
      trigger: "Status quo. Hormuz partially open. OPEC+ unchanged. Demand steady.",
      action: "Act now. Increase fuel surcharge 3–5%. Reserve €3,200. Review expiring contracts.",
    },
    {
      name: `Bull Case • ${regimeList?.bull}%`,
      color: "text-red-500",
      brent: `$${scenariosCalc.bullPrice}`,
      impact: `$${scenariosCalc.bull}`,
      budget: `$${Number(brentData.spend_bracket) + Number(scenariosCalc.bull) }`,
      trigger: "Hormuz fully closes. Escalation extends. Supply shock drives Brent above $95.",
      action: "Emergency response. Pause fixed-price contracts. Activate fuel clauses.",
    },
    {
      name: `Bear Case • ${regimeList?.bear}%`,
      color: "text-green-500",
      brent: `$${scenariosCalc.bearPrice}`,
      impact: `$${scenariosCalc.bear}`,
      budget: `$${Number(brentData.spend_bracket) - Number(scenariosCalc.bear) }`,
      trigger: "Surprise OPEC+ output increase. Hormuz reopens. Demand softens.",
      action: "Hold. Delay spot purchases. Lock current rates.",
    },
  ];

  const calculateScenarioPrices = async (currentPrice: number,brent30Days: number) => {
    const response = await fetch("/api/volatility_30d");
    const data = await response.json();
    const prices = ScenarioRules["price_targets"];
    const base = currentPrice * (1 + brent30Days / 100);
    const bull = base + data.volatility * prices.bull_multiplier;
    const bear = base - data.volatility * prices.bear_multiplier;

    return {
      base,
      bull,
      bear,
    };
  };

  const fetchData = async () => {
    SetLoading(true)
    let brentObj = JSON.parse(localStorage.getItem('brentObj') || '');
    let shockObj = JSON.parse(localStorage.getItem('shockObj') || '')
    if (brentObj) {
      shockCalculator(brentObj.brent_30_days_move,brentObj.impactLag,brentObj.sensitivity_score,brentObj.pass_through_rate
        ,brentObj.currentPrice,brentObj.spend_bracket
      )
        setBrentData(brentObj)
        SetLoading(false)
    }
  }

  const shockCalculator = async (brent30Days: number, impactLag: number, sensitivity_score: number, pass_through_rate: number, currentPrice:number
      , spendBucket:number
    ) => {
      let shock = ShockThresHolds['formula_weights']
      const Momentum_Score = Math.min(100, Math.abs(brent30Days) * 10);
      const InverseLag_Score = Math.max(0, 100 - (impactLag * 5));
      const passThroughScore = pass_through_rate * 100;
  
      const cal = (Momentum_Score * shock.brent_momentum) +
        ((sensitivity_score*100) * shock.sector_sensitivity) +
        (passThroughScore * shock.pass_through_rate) +
        (InverseLag_Score * shock.inverse_lag);
  
      const finalShock = Math.round(cal);
      
      calculateProbability(finalShock, currentPrice, brent30Days,spendBucket)
    }

  useEffect(() => {
    fetchData()
  }, [])


  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
      {
        loading ? LoaderOverlay() :
          <>
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <h2 className="font-semibold tracking-wide uppercase text-sm text-gray-600">
                Three Scenarios • 30-Day Brent Forecast
              </h2>

              <p className="text-sm text-gray-500">
                Updated Daily • May 1, 2026
              </p>
            </div>

            <table className="w-full">

              <thead className="bg-gray-50">
                <tr>
                  <th className="p-4 text-sm text-left">Metric</th>
                  {scenarios.map((s) => (
                    <th
                      key={s.name}
                      className={`p-4 text-sm text-left ${s.bg ?? ""}`}
                    >
                      <span className={s.color}>{s.name}</span>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>

                <Row
                  title="Brent Target"
                  values={scenarios.map((s) => (
                    <span className={`font-bold ${s.color}`}>
                      {s.brent}
                    </span>
                  ))}
                />

                <Row
                  title="Your Cost Impact"
                  values={scenarios.map((s) => (
                    <span className={`font-bold ${s.color}`}>
                      {s.impact}
                    </span>
                  ))}
                />

                <Row
                  title="Budget Revision"
                  values={scenarios.map((s) => (
                    <span className="font-semibold">
                      {s.budget}
                    </span>
                  ))}
                />

                <Row
                  title="Trigger Conditions"
                  values={scenarios.map((s) => s.trigger)}
                />

                <Row
                  title="Recommended Action"
                  values={scenarios.map((s) => (
                    <span className={s.color}>{s.action}</span>
                  ))}
                />

              </tbody>

            </table>
          </>

      }

    </div>
  );
}

function Row({
  title,
  values,
}: {
  title: string;
  values: React.ReactNode[];
}) {
  return (
    <tr className="border-t border-gray-200 text-sm">

      <td className="w-52 p-5 font-semibold uppercase tracking-wide text-gray-500">
        {title}
      </td>

      {values.map((value, i) => (
        <td key={i} className="p-5 align-top">
          {value}
        </td>
      ))}
    </tr>
  );
}