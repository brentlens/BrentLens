"use client";

import {
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { CountryCode } from "dodopayments/resources/misc.mjs";
import {
  Factory,
  HardHat,
  Plane,
  Ship,
  Sprout,
  Truck,
} from "lucide-react";

import { COUNTRIES } from "@/configs/countries";


// ============================================================
// Types
// ============================================================

interface IndustryConfig {
  id: string;
  label: string;
  desc: string;
  icon: ReactNode;
  sensitivity: number;
  lag_adjustment_days: number;
}

interface ScenarioValues {
  price: number;
  impact: number;
  budget: number;
  risk: string;
  days: string;
}

interface BrentValues {
  currentPrice: number;
  spend_bracket: number;
  cost_impact: number;
  brent_30_days_move: number;
  pass_through_rate: number;
  sensitivity_score: number;
}

interface ShockValues {
  days_remaining: number;
}

interface ScenarioSliderProps {
  setScenarioValues: Dispatch<SetStateAction<ScenarioValues>>;
}

const INDUSTRY_OPTIONS: IndustryConfig[] = [
  {
    id: "logistics",
    label: "Logistics & Freight",
    desc: "Road freight, fleet management, and distribution operations.",
    icon: <Truck className="w-6 h-6 stroke-[1.8]" />,
    sensitivity: 0.92,
    lag_adjustment_days: 0,
  },
  {
    id: "aviation",
    label: "Aviation",
    desc: "Commercial airlines, cargo charters, and ground handlers.",
    icon: <Plane className="w-6 h-6 stroke-[1.8]" />,
    sensitivity: 0.97,
    lag_adjustment_days: -1,
  },
  {
    id: "maritime",
    label: "Maritime Shipping",
    desc: "Container shipping, bulk transport, and marine operations.",
    icon: <Ship className="w-6 h-6 stroke-[1.8]" />,
    sensitivity: 0.88,
    lag_adjustment_days: 3,
  },
  {
    id: "manufacturing",
    label: "Manufacturing",
    desc: "Industrial processing, equipment operation, and heavy plant.",
    icon: <Factory className="w-6 h-6 stroke-[1.8]" />,
    sensitivity: 0.74,
    lag_adjustment_days: 2,
  },
  {
    id: "construction",
    label: "Construction",
    desc: "Heavy machinery, earthmoving, and site infrastructure.",
    icon: <HardHat className="w-6 h-6 stroke-[1.8]" />,
    sensitivity: 0.71,
    lag_adjustment_days: 1,
  },
  {
    id: "agribusiness",
    label: "Agribusiness",
    desc: "Large-scale harvesting, irrigation, and processing.",
    icon: <Sprout className="w-6 h-6 stroke-[1.8]" />,
    sensitivity: 0.68,
    lag_adjustment_days: 2,
  },
];

export default function ScenarioSlider({
  setScenarioValues,
}: ScenarioSliderProps) {
  const [industry, setIndustry] = useState<string>("logistics");
  const [country, setCountry] = useState<CountryCode>("DE");
  const [fuelSpendKey, setFuelSpendKey] = useState<string>("50-250k");
  const [spendValue, setSpendValue] = useState<number>(125000);
  const [brentPrice, setBrentPrice] = useState<number>(94);
  const [brentValues, setBrentValues] = useState<BrentValues | null>(null);
  const [shockValues, setShockValues] = useState<ShockValues | null>(null);
  const [baselineBrent, setbaselineBrentPercent] = useState<number>(0)
  const [additionalCost, setAdditionalCost] = useState<number>(0)

  const countryConfig = COUNTRIES[country] ?? COUNTRIES.DEFAULT;

  const sectorConfig =
    INDUSTRY_OPTIONS.find(
      (item) => item.id === industry
    ) ?? INDUSTRY_OPTIONS[0];

  // const baselineBrent = 87.42;

  const pt = countryConfig.pass_through_rate;

  const sens = sectorConfig.sensitivity;

  const calculateBaseLine = (cost_impact: number, budget: number) => {
    let cal = (cost_impact / budget) * 100
    setbaselineBrentPercent(cal)
  }

  useEffect(() => {
    try {
      const brentRaw = localStorage.getItem("brentObj");

      const shockRaw = localStorage.getItem("shockObj");

      if (!brentRaw || !shockRaw) {
        return;
      }

      const brentObj: BrentValues = JSON.parse(brentRaw);

      const shockObj: ShockValues = JSON.parse(shockRaw);

      setBrentValues(brentObj);
      setShockValues(shockObj);
      let brent = JSON.parse(localStorage.getItem("brentObj") || '');
      calculateBaseLine(brent.totalCalc, brent.spend_bracket)
      setBrentPrice(brentObj.currentPrice);
      setSpendValue(brent.spend_bracket)
      setAdditionalCost(Math.round(brent.additionalCostToday))

    } catch (error) {
      console.error(
        "Failed to load scenario data:",
        error
      );
    }
  }, []);

  if (!brentValues || !shockValues) {
    return (
      <div className="lg:col-span-5 bg-white rounded-3xl p-7 border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
        <div className="flex items-center justify-center min-h-[300px]">
          <span className="text-sm text-slate-500">
            Loading scenario data...
          </span>
        </div>
      </div>
    );
  }

  const impactLag = shockValues.days_remaining;
  let userImpact = additionalCost
  const budgetBefore = brentValues.spend_bracket;
  const userBudgetRevision = budgetBefore + userImpact;
  const userAnnualised = userImpact * 12;

  const formatCurrency = (
    val: number,
    showSign: boolean = true
  ) => {
    const sign = val >= 0 ? "+" : "";

    const formatted =
      Math.abs(val).toLocaleString("en-US");

    return showSign
      ? `${sign}$${formatted}`
      : `$${formatted}`;
  };


  const getSignalMessage = (
    price: number
  ) => {

    if (price >= 105) {
      return "Critical cost risk. Implement emergency hedging, activate high fuel surcharges (8-12%), and mandate immediate executive review.";
    }

    if (price >= 95) {
      return "Increase fuel surcharge by 5-7%. Add emergency budget reserve. Brief executive team.";
    }

    if (price >= 88) {
      return "Increase fuel surcharge 3-5%. Add budget reserve. Review expiring contracts immediately.";
    }

    return "Favourable conditions vs baseline. Maintain regular hedging policy and monitor 30-day moving average.";
  };

  const onSliderChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const scenarioPrice = Number(e.target.value);

    const baselinePrice =
      brentValues.currentPrice /
      (1 + brentValues.brent_30_days_move / 100);

    const scenarioMovePercent =
      ((scenarioPrice - baselinePrice) / baselinePrice) * 100;

    const scenarioImpact = Math.round(
      (scenarioMovePercent / 100) *
      brentValues.pass_through_rate *
      brentValues.sensitivity_score *
      brentValues.spend_bracket
    );
	setAdditionalCost(scenarioImpact);
	// userImpact=scenarioImpact;
    const budget = budgetBefore + scenarioImpact;

    setBrentPrice(scenarioPrice);

    setScenarioValues({
      price: scenarioPrice,
      impact: scenarioImpact,
      budget: budget,
      risk: "HIGH",
      days: `${impactLag} days`,
    });
  };

  return (
    <div className="lg:col-span-5 bg-white rounded-3xl p-7 border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">

      {/* ---------------------------------------------------- */}
      {/* Header */}
      {/* ---------------------------------------------------- */}

      <div className="mb-2">

        <span className="inline-block bg-indigo-600 text-white text-[12px] font-bold px-2 py-0.5 rounded tracking-wide">
          Modelled Brent Price
        </span>

        <div className="text-5xl font-black text-indigo-600 tracking-tight mt-1">
          ${brentPrice.toFixed(2)}
        </div>

      </div>


      {/* ---------------------------------------------------- */}
      {/* Range Slider */}
      {/* ---------------------------------------------------- */}

      <div className="my-5">

        <input
          type="range"
          min={Math.round(
            brentValues.currentPrice - 60
          )}
          max={Math.round(
            brentValues.currentPrice + 60
          )}
          step={1}
          value={brentPrice}
          onChange={onSliderChange}
          className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 focus:outline-none"
        />

        <div className="flex justify-between text-xs font-semibold text-slate-400 mt-2">

          <span>
            $
            {Math.round(
              brentValues.currentPrice - 60
            )}
          </span>

          <span>
            $
            {Math.round(
              brentValues.currentPrice
            )}
          </span>

          <span>
            $
            {Math.round(
              brentValues.currentPrice + 60
            )}
          </span>

        </div>

      </div>


      {/* ---------------------------------------------------- */}
      {/* Divider */}
      {/* ---------------------------------------------------- */}

      <div className="h-px bg-slate-100 w-full mb-5" />


      {/* ---------------------------------------------------- */}
      {/* Impact Box */}
      {/* ---------------------------------------------------- */}

      <div className="bg-rose-50 border border-rose-200/70 rounded-2xl p-5 text-center mb-6">

        <div className="text-[11px] font-extrabold uppercase tracking-wider text-rose-500 mb-1">
          Your Additional Cost
        </div>

        <div className="text-4xl font-black text-rose-500 tracking-tight">
          {formatCurrency(additionalCost)}
        </div>

      </div>


      {/* ---------------------------------------------------- */}
      {/* Metrics */}
      {/* ---------------------------------------------------- */}

      <div className="space-y-3 text-sm mb-6">

        {/* Budget Before */}

        <div className="flex justify-between items-center">

          <span className="text-slate-500 font-medium">
            Budget before
          </span>

          <span className="font-extrabold text-slate-900">
            {formatCurrency(
              Number(
                brentValues.spend_bracket
              ),
              false
            )}
          </span>

        </div>


        {/* Budget After */}

        <div className="flex justify-between items-center">

          <span className="text-slate-500 font-medium">
            Budget after
          </span>

          <span
            className={`font-extrabold ${userBudgetRevision > budgetBefore
              ? "text-rose-500"
              : "text-emerald-600"
              }`}
          >
            {formatCurrency(
              userBudgetRevision,
              false
            )}
          </span>

        </div>


        {/* Time to Impact */}

        <div className="flex justify-between items-center">

          <span className="text-slate-500 font-medium">
            Time to impact
          </span>

          <span className="font-extrabold text-slate-900">
            {impactLag}{" "}
            {impactLag === 1
              ? "day"
              : "days"}
          </span>

        </div>


        {/* Annualised */}

        <div className="flex justify-between items-center">

          <span className="text-slate-500 font-medium">
            Annualised
          </span>

          <span
            className={`font-extrabold ${userAnnualised >= 0
              ? "text-rose-500"
              : "text-emerald-600"
              }`}
          >
            {formatCurrency(
              userAnnualised
            )}
          </span>

        </div>

      </div>


      {/* ---------------------------------------------------- */}
      {/* Recommendation */}
      {/* ---------------------------------------------------- */}

      <div className="bg-rose-50/80 border border-rose-200/60 rounded-xl p-3.5 text-xs text-rose-600 leading-relaxed font-medium">

        {getSignalMessage(brentPrice)}

      </div>

    </div>
  );
}


// ============================================================
// Row Component
// ============================================================

function Row({
  label,
  value,
  red,
}: {
  label: string;
  value: string;
  red?: boolean;
}) {
  return (
    <div className="flex justify-between">

      <span className="text-gray-500">
        {label}
      </span>

      <span
        className={`font-semibold ${red ? "text-red-500" : ""
          }`}
      >
        {value}
      </span>

    </div>
  );
}