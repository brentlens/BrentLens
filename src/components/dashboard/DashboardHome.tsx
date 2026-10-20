/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { useEffect, useState } from 'react';
import { sectors } from "@/configs/sectors";
import { ShockThresHolds } from "@/configs/shock_thresholds";
import { ScenarioRules } from "@/configs/scenario_rules";

import { TrendingUp, IndianRupee, Clock3, AlertTriangle, ArrowRight, Copy, Download } from "lucide-react";
import LoaderOverlay from '../Loader';
import { convertToDecimal, percentFormatter, priceFormatter } from '@/utils/converter';
import ProcurementActionSignal from './ProcurementActionSignal';
import ExposureProfile from './ExposureProfile';
import { COUNTRIES } from '@/configs/countries';
import { BrentData, DashboardHomeProps, RiskBand, RiskLevels } from '@/types/dashboard';
import { onboarding_mappings } from '@/configs/onboarding_mappings';
import BrentForecastChart from './BrentForecastChart';


// 2. Renamed the function to DashboardHome and destructuring the parameters
export default function DashboardHome({ setActiveTab, tier, setTier }: DashboardHomeProps) {

  const [brentData, setBrentData] = useState<BrentData>({
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
  })
  const [brentChanges, setBrentChanges] = useState<any>()
  const [shockVal, setShockVal] = useState<RiskLevels>({
    shock: 0,
    risk: null,
    riskLevel: ''
  })
  const [regimeList, setRegimeList] = useState<any>();
  const [scenariosCalc, setScenariosCalc] = useState({
    base: '',
    basePrice: 0,
    bear: '',
    bearPrice: 0,
    bull: '',
    bullPrice: 0
  })
  const [loading, SetLoading] = useState(true)
  const [baselinePercent, setBaselinePercent] = useState<number>(0)
  const [marginImpact, setMarginImpact] = useState<number>(0);

  const fetchLatestData = async () => {
    const id = "7f1a5995-9933-4114-8702-8f7c458b4f50";
    // const id = "8c1c4b55-e94b-490d-9bb8-12d4b0fe6e44"; 

    const response = await fetch(`/api/user/userSettings?id=${id}`, {
      method: "GET",
    });

    let data = await response.json();
    data = data.record
    const countryConfig = COUNTRIES[data.country as keyof typeof COUNTRIES] ?? COUNTRIES.DEFAULT;

    const sectorConfig =
      sectors[data.sector as keyof typeof sectors] ?? sectors.logistics;

    const brent30Days = data.brent30Days?.["30d"]?.percent
    // - indicates saving and + indicates extra expense
    const todaysCost = (data.brent30Days?.["24h"]?.percent / 100) 
                  * countryConfig.pass_through_rate 
                  * sectorConfig.sensitivity_normalised 
                  * data.spendBucket

    // cost_impact
    const calcobj = Math.round((brent30Days / 100) * countryConfig.pass_through_rate * sectorConfig.sensitivity_normalised * data.spendBucket)

    let obj = {
      pass_through_rate: countryConfig.pass_through_rate,
      sensitivity_score: sectorConfig.sensitivity_normalised,
      spend_bracket: data.spendBucket,
      brent_30_days_move: brent30Days,
      sectorName: sectorConfig.display_name,
      impactLag: countryConfig.lag_midpoint_days + sectorConfig.lag_adjustment_days,
      currentPrice: data.currentPrice,
      formattedPrice: data.formattedPrice,
      additionalCostToday: todaysCost,
      totalCalc: calcobj,
      days_remaining: 0,
      latest_shock: null,
      last_shock: null
    }
    setBrentData(obj);
    localStorage.setItem('brentObj', JSON.stringify(obj))
    setBrentChanges(data.brent30Days)

    SetLoading(false)
    await shockCalculator(brent30Days, (countryConfig.lag_midpoint_days + sectorConfig.lag_adjustment_days)
      , sectorConfig.sensitivity_score, countryConfig.pass_through_rate, calcobj,data.currentPrice,data.spendBucket)
    // const scenarioPrices = await calculateScenarioPrices(data.currentPrice, brent30Days);


    calculateBaseLine(calcobj, data.spendBucket)
    calculateMarginImpact(calcobj, data.spendBucket)
  };


  const upsertImpactEvent = async (shock: number, totalCalc: number) => {
    const user_id = "7f1a5995-9933-4114-8702-8f7c458b4f50";

    let payload = {
      user_id: user_id,
      new_cost_impact: totalCalc,
      shock_index: shock
    }
    const response = await fetch('/api/impact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    let data = await response.json();

    let lastShockVal = getRiskBand(data.event.last_shock)
    let latestShockVal = getRiskBand(data.event.latest_shock)


    setBrentData((prev: any) => ({
      ...prev,
      days_remaining: data.event.days_remaining,
      last_shock: lastShockVal,
      latest_shock: latestShockVal,
    }))

    let obj = {
      days_remaining: data.event.days_remaining,
      last_shock: lastShockVal,
      latest_shock: latestShockVal,
    }

    localStorage.setItem('shockObj', JSON.stringify(obj))
  };

  const getRiskBand = (latestShock: number): (RiskBand & { riskLevel: string }) | null => {
    let riskBands = ShockThresHolds['risk_bands']
    const entry = Object.entries(riskBands).find(
      ([, band]) =>
        latestShock >= band.min &&
        latestShock <= band.max
    );

    if (!entry) {
      return null;
    }

    const [riskLevel, riskData] = entry;

    return {
      riskLevel,
      ...riskData
    };
  };

  useEffect(() => {
    fetchLatestData();
  }, []);

  const stats = [
    {
      title: "Annualised Impact",
      value: brentData.spend_bracket * 12,
      subtitle: "If trajectory holds",
    },
    {
      title: "Margin Impact",
      value: ` ${marginImpact > 0 ? '+' : '-'} ${marginImpact.toFixed(1)}%`,
      subtitle: "Based on mid spend",
    },
    {
      title: "Pass-through",
      value: brentData.pass_through_rate * 100,
      subtitle: "Germany • 12mo avg",
    },
    {
      title: "Arrives In",
      value: brentData.impactLag,
      subtitle: "Logistics sector lag",
    },
  ];

  const scenarios = [
    {
      name: "Bear",
      price: `$${scenariosCalc.bearPrice}`,
      probability: regimeList?.bear + '%',
      impact: `$${scenariosCalc.bear}`,
      bg: "bg-red-50",
      border: "border-red-200",
      color: "text-red-500",
    },
    {
      name: "Base",
      price: `$${scenariosCalc.basePrice}`,
      probability: regimeList?.base + '%',
      impact: `$${scenariosCalc.base}`,
      bg: "bg-violet-50",
      border: "border-violet-200",
      color: "text-violet-600",
    },
    {
      name: "Bull",
      price: `$${scenariosCalc.bullPrice}`,
      probability: regimeList?.bull + '%',
      impact: `$${scenariosCalc.bull}`,
      bg: "bg-emerald-50",
      border: "border-emerald-200",
      color: "text-emerald-600",
    },
  ];

  const shockCalculator = async (brent30Days: number, impactLag: number, sensitivity_score: number, pass_through_rate: number, cost_impact: number,currentPrice:number
    , spendBucket:number
  ) => {
    let shock = ShockThresHolds['formula_weights']
    const Momentum_Score = Math.min(100, Math.abs(brent30Days) * 10);
    const InverseLag_Score = Math.max(0, 100 - (impactLag * 5));
    const passThroughScore = pass_through_rate * 100;

    const cal = (Momentum_Score * shock.brent_momentum) +
      (sensitivity_score * shock.sector_sensitivity) +
      (passThroughScore * shock.pass_through_rate) +
      (InverseLag_Score * shock.inverse_lag);

    const finalShock = Math.round(cal);
    

    let riskData = {}
    let risk = ''

    if (cal >= 75) {
      risk = 'HIGH'
      riskData = ShockThresHolds.risk_bands.HIGH
    } else if (cal >= 50 && cal <= 74) {
      risk = 'MEDIUM'
      riskData = ShockThresHolds.risk_bands.MEDIUM
    } else if (cal >= 25 && cal <= 49) {
      risk = 'LOW'
      riskData = ShockThresHolds.risk_bands.LOW
    } else {
      risk = 'MINIMAL'
      riskData = ShockThresHolds.risk_bands.MINIMAL

    }
    setShockVal({
      shock: finalShock,
      riskLevel: risk,
      risk: riskData
    })

    calculateProbability(finalShock, currentPrice, brent30Days,spendBucket)
    await upsertImpactEvent(finalShock, cost_impact)
  }


  type RegimeName = keyof typeof ScenarioRules.market_regimes;

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

  const calculateBaseLine = (cost_impact: number, budget: number) => {
    let cal = (cost_impact / budget) * 100
    setBaselinePercent(cal)
  }

  const getLastMonthName = (): string => {
    const date = new Date();
    date.setMonth(date.getMonth() - 1);

    let name = date.toLocaleString("en-US", {
      month: "long",
    });
    return name + " baseline"
  };


  const calculateScenarioPrices = async (
    currentPrice: number,
    brent30Days: number
  ) => {
    const response = await fetch("/api/volatility_30d");
    const data = await response.json();
    const prices = ScenarioRules["price_targets"];
    const base = currentPrice * (1 + brent30Days / 100);
    // const bull = base + data.volatility * prices.bull_multiplier;
    // const bear = base - data.volatility * prices.bear_multiplier;

    const volatilityMove = currentPrice * (data.volatility / 100);
    const bull = base + volatilityMove * prices.bull_multiplier;
    const bear = base - volatilityMove * prices.bear_multiplier;

    return {
      base,
      bull,
      bear,
    };
  };

  const calculateMarginImpact = (cost_impact: number, monthlySpend: number,) => {
    let fuel_exposure = onboarding_mappings['fuel_exposure'];
    let expoMultiplier = fuel_exposure['low']['multiplier']
    const exposedSpend = monthlySpend * expoMultiplier;
    
    // const impact = (cost_impact / exposedSpend) * 100;
    let impact = cost_impact / (monthlySpend / expoMultiplier) * 100
    setMarginImpact(impact)
  }


  return (
    <>
      <div className="py-10">
        {
          !loading ?
            <>
              {/* one */}
              <div className="w-fit overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 m-auto ">
                <div className="grid grid-cols-5 divide-x divide-gray-200 gap-25">

                  {/* Status */}
                  <div className="flex items-center gap-3 border-l-4 border-red-500 px-6 py-5">
                    <div className="relative flex-shrink-0">
                      <div className="h-3 w-3 rounded-full bg-emerald-400" />
                      <div className="absolute inset-0 h-3 w-3 animate-ping rounded-full bg-emerald-400 opacity-60" />
                    </div>

                    <p className="text-xs font-bold uppercase tracking-[0.15em] text-red-500">
                      Since Yesterday
                    </p>
                  </div>

                  {/* Brent */}
                  <div className="px-6 py-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-gray-500">
                      Brent Move
                    </p>

                    <div className="mt-1 flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-red-500" />
                      <span className="text-sm font-bold text-red-500">
                        ${(brentChanges?.['24h']?.amount.toString())}
                      </span>
                      <span className="text-lg font-semibold text-red-500">
                        {brentChanges?.['24h']?.percent.toString()}%
                      </span>
                    </div>

                    <p className="mt-1 text-sm text-gray-500">
                      Today
                    </p>
                  </div>

                  {/* Cost */}
                  <div className="px-6 py-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-gray-500">
                      Your Cost Added
                    </p>

                    <div className="mt-1 flex items-center gap-2">
                      <IndianRupee className="h-4 w-4 text-red-500" />
                      <span className="text-sm font-bold text-red-500">
                        + {brentData.additionalCostToday?.toFixed(2)}
                      </span>
                    </div>

                    <p className="mt-1 text-sm text-gray-500">
                      Additional today
                    </p>
                  </div>

                  {/* Time */}
                  <div className="px-6 py-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-gray-500">
                      Time to Impact
                    </p>

                    <div className="mt-1 flex items-center gap-2">
                      <Clock3 className="h-4 w-4 text-red-500" />
                      <span className="text-sm font-bold text-red-500">
                        {brentData.days_remaining + 1} days → {brentData.days_remaining} days
                      </span>
                    </div>

                    <p className="mt-1 text-sm text-gray-500">
                      Getting closer
                    </p>
                  </div>

                  {/* Risk */}
                  <div className="px-6 py-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-gray-500">
                      Risk Level
                    </p>

                    <div className="mt-1 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                      <span className="text-sm font-bold text-red-500">
                        {brentData.last_shock?.riskLevel ?? 'N/A'} → {brentData.latest_shock?.riskLevel ?? 'N/A'}
                      </span>
                    </div>

                    <p className="mt-1 text-sm text-gray-500">
                      Threshold crossed
                    </p>
                  </div>
                </div>
              </div>

              {/* two */}
              <div className="w-370 mt-4 gap-45 m-auto flex items-center justify-between rounded-2xl border border-gray-200 bg-white px-8 py-6 shadow-sm">
                {/* Left Section */}
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.25em] text-violet-600">
                    Logistics · Germany · April 2026
                  </p>

                  <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
                    Know your fuel cost increase before it reaches your business.
                  </h1>
                </div>

                {/* Right Section */}
                <div className="flex items-center gap-4">
                  <button
                    className="
        rounded-xl
        border border-gray-300
        bg-white
        px-6
        py-3
        text-base
        font-semibold
        text-slate-700
        transition
        hover:bg-gray-50
      "
                  >
                    Edit Profile
                  </button>

                  <button
                    className="
        flex items-center gap-2
        rounded-xl
        bg-gradient-to-r
        from-violet-600
        to-sky-500
        px-6
        py-3
        text-base
        font-semibold
        text-white
        shadow-lg
        shadow-violet-500/20
        transition
        hover:scale-[1.02]
      "
                  >
                    <Download className="h-5 w-5" />
                    Download Report
                  </button>
                </div>
              </div>


              {/* three */}
              <div className="w-370 m-auto mt-5">
                <div className="grid grid-cols-12 gap-5">
                  {/* LEFT */}
                  <div className="col-span-9 space-y-4">
                    {/* Header */}
                    <div className="rounded-2xl border border-rose-200 bg-gradient-to-r from-rose-50 to-white">
                      <div className="grid grid-cols-5">
                        <div className="border-r p-6">
                          <p className="text-xs font-semibold tracking-widest uppercase text-slate-500">
                            Cost Shock Index
                          </p>
                          <div className="mt-2 flex items-end">
                            <span className="text-5xl font-bold text-red-500">
                              {shockVal.shock}
                            </span>
                            <span className="mb-2 text-sm text-slate-500">
                              /100
                            </span>

                          </div>

                          <p className="mt-3 text-red-500 font-bold text-xs uppercase">
                            {shockVal.riskLevel} · {shockVal.risk?.action}
                          </p>

                        </div>


                        <div className="border-r last:border-none p-5"
                        >
                          <p className="text-xs uppercase tracking-widest text-slate-500 font-bold">
                            Brent Momentum
                          </p>

                          <h3 className="mt-2 text-lg font-bold">
                            {brentData.brent_30_days_move} %
                          </h3>

                          <div className="mt-3 h-1 rounded-full bg-slate-200">
                            <div
                              className="h-full rounded-full bg-orange-500"
                              style={{ width: `50%` }}
                            />
                          </div>

                          <p className="mt-2 text-xs text-slate-500">
                            Accelerating 30D
                          </p>
                        </div>

                        {/* Sector Sensitivity */}
                        <div className="border-r last:border-none p-5"
                        >
                          <p className="text-xs uppercase tracking-widest text-slate-500 font-bold">
                            Sector Sensitivity
                          </p>

                          <h3 className="mt-2 text-lg font-bold">
                            {brentData.sensitivity_score * 100} /100
                          </h3>

                          <div className="mt-3 h-1 rounded-full bg-slate-200">
                            <div
                              className="h-full rounded-full bg-orange-500"
                              style={{ width: `50%` }}
                            />
                          </div>

                          <p className="mt-2 text-xs text-slate-500">
                            {brentData.sectorName}
                          </p>
                        </div>

                        {/* Pass-Through Rate */}
                        <div className="border-r last:border-none p-5"
                        >
                          <p className="text-xs uppercase tracking-widest text-slate-500 font-bold">
                            Pass-Through Rate
                          </p>

                          <h3 className="mt-2 text-lg font-bold">
                            {brentData.pass_through_rate * 100} %
                          </h3>

                          <div className="mt-3 h-1 rounded-full bg-slate-200">
                            <div
                              className="h-full rounded-full bg-orange-500"
                              style={{ width: `50%` }}
                            />
                          </div>

                          <p className="mt-2 text-xs text-slate-500">
                            Germany model
                          </p>
                        </div>

                        {/* Impact Lag */}
                        <div className="border-r last:border-none p-5"
                        >
                          <p className="text-xs uppercase tracking-widest text-slate-500 font-bold">
                            Impact Lag
                          </p>

                          <h3 className="mt-2 text-lg font-bold">
                            {brentData.impactLag} days
                          </h3>

                          <div className="mt-3 h-1 rounded-full bg-slate-200">
                            <div
                              className="h-full rounded-full bg-orange-500"
                              style={{ width: `50%` }}
                            />
                          </div>

                          <p className="mt-2 text-xs text-slate-500">
                            Short — fast exposure
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Main Forecast */}
                    <div className="relative overflow-hidden rounded-2xl border border-violet-200 bg-gradient-to-br from-indigo-50 via-white to-violet-50 p-7">
                      <div className="absolute -right-12 -top-10 h-72 w-72 rounded-full bg-violet-200/30" />
                      <div className="flex justify-between">
                        <div>
                          <p className="text-xs uppercase tracking-widest text-slate-500 font-bold">
                            Expected Fuel Cost Increase
                          </p>
                          <div className="mt-3 inline-flex border border-red-400 rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-500">
                            ● Budget Risk • {brentData.latest_shock?.riskLevel}
                          </div>
                          <h1 className="mt-6 text-7xl font-bold text-violet-600">
                            +€ {convertToDecimal(brentData.totalCalc)}
                          </h1>
                          <p className="mt-2 text-xl font-semibold text-red-500">
                            {percentFormatter(baselinePercent.toString())}
                            {baselinePercent > 0 ? ' above ' : ' below '}
                            {getLastMonthName()}
                          </p>

                        </div>

                        <div className="rounded-full bg-violet-100 border border-violet-400 px-4 py-2 text-xs font-semibold text-violet-600 h-fit">
                          Forecast Reliability 72%
                        </div>

                      </div>

                      {/* Budget */}

                      <div className="mt-10 rounded-xl bg-rose-100/60 p-6 flex items-center justify-between bg-[linear-gradient(90deg,theme(colors.gray.100)_55%,theme(colors.rose.100)_45%)]">

                        <div className=''>
                          <p className="text-xs uppercase tracking-wide  text-slate-500 font-semibold">
                            Monthly Fuel Budget
                          </p>
                          <h2 className="text-xl text-gray-500 font-bold">
                            € {brentData.spend_bracket}
                          </h2>
                        </div>
                        <ArrowRight className="text-red-500" />
                        <div className="">
                          <div className=' '>
                            <p className="text-xs uppercase tracking-wide text-slate-500 font-semibold">
                              Revised Forecast
                            </p>
                            <h2 className="text-xl font-bold text-red-500">
                              € {Math.round(Number(brentData.spend_bracket) + Number(convertToDecimal(brentData.totalCalc)))}
                            </h2>
                          </div>
                        </div>
                      </div>

                      {/* Stats */}

                      <div className="mt-5 grid grid-cols-2 gap-4">
                        {stats.map((item) => (
                          <div
                            key={item.title}
                            className="rounded-xl border border-gray-300 bg-gray-200 p-2 "
                          >
                            <p className="text-xs uppercase tracking-widest text-slate-500 font-semibold">
                              {item.title}
                            </p>
                            <h3 className="mt-2 text-lg font-bold">
                              {item.value}
                            </h3>
                            <p className="mt-1 text-xs text-slate-500">
                              {item.subtitle}
                            </p>
                          </div>
                        ))}
                      </div>
                      <div className="mt-5 rounded-xl border border-gray-300 bg-gray-200 p-5 flex justify-between">
                        <span className="text-xs uppercase tracking-widest text-slate-500 font-semibold">
                          Why this estimate?
                        </span>
                        <button className="text-xs font-semibold text-slate-600 hover:text-black">
                          ▶ Show Basis
                        </button>
                      </div>
                    </div>
                    <BrentForecastChart />
                    <ProcurementActionSignal />
                    <ExposureProfile fuel_sensitivity={(brentData.sensitivity_score * 100) / 100}
                      impact_lag={brentData.impactLag}
                      pass_through_rate={(brentData.pass_through_rate * 100)}
                      risk_category={shockVal.riskLevel}
                      shock_index={shockVal.shock}
                    />

                  </div>
                  {/* RIGHT */}

                  <div className="col-span-3 space-y-4">
                    {/* Outlook */}
                    <div className="rounded-2xl  bg-white">
                      <div className="flex items-center justify-between border-b border-slate-300 p-5">
                        <span className="text-xs font-bold tracking-wider uppercase text-slate-600">
                          Impact Outlook
                        </span>
                        <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-bold text-violet-600">
                          PRO
                        </span>
                      </div>
                      <div className="p-5">
                        <div className="flex items-end gap-2">
                          <h2 className="text-2xl font-bold">
                            {brentData.currentPrice + (1 + brentData.brent_30_days_move)}
                          </h2>

                          <span className="pb-2 text-red-500 font-semibold">
                            Rising ↑
                          </span>

                        </div>

                        <p className="mt-2 text-xs text-slate-500">
                          30-day Brent forecast
                        </p>

                        <div className="mt-6 flex justify-between text-xs font-semibold">
                          <span>Forecast Reliability</span>
                          <span className="text-violet-600">72%</span>
                        </div>

                        <div className="mt-2 h-1 rounded-full bg-slate-200">
                          <div className="h-full w-[72%] rounded-full bg-gradient-to-r
                              from-violet-600
                              to-sky-500" />
                        </div>

                        <div className="mt-5 space-y-3">

                          {scenarios.map((item) => (
                            <div
                              key={item.name}
                              className={`rounded-xl border p-4 ${item.bg} ${item.border}`}
                            >
                              <div className="flex justify-between text-xs">
                                <div>
                                  <p className={`font-bold ${item.color}`}>
                                    {item.name}
                                  </p>
                                  <p className={`text-sm font-bold ${item.color}`}>
                                    {item.price}
                                  </p>
                                </div>
                                <div className="text-center text-xs text-slate-500">
                                  {item.probability}
                                </div>
                                <div className="text-right">
                                  <p className="text-xs uppercase text-slate-500">
                                    Your Impact
                                  </p>
                                  <p className={`font-bold ${item.color}`}>
                                    {item.impact}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}

                        </div>

                        <button className="text-xs mt-5 w-full rounded-xl bg-slate-100 border border-slate-200 py-3 font-semibold hover:bg-slate-50">
                          Full Analysis →
                        </button>

                      </div>

                    </div>

                    {/* Finance Snapshot */}
                    <div className="rounded-2xl bg-white">
                      <div className="flex justify-between border-b border-slate-300 p-5">
                        <span className="text-sm font-bold uppercase tracking-wider text-slate-600">
                          CFO Finance Snapshot
                        </span>
                        <button className="flex items-center gap-1 rounded-lg border px-3 py-1 text-xs">
                          <Copy size={14} />
                          Copy
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-3 p-5">
                        {[
                          ["Monthly Variance", `+€${convertToDecimal(brentData.totalCalc)}`, "vs April baseline"],
                          ["Annualised", "€100,800", "If trend holds"],
                          ["Budget Risk", "HIGH", "Action required"],
                          ["Reliability", "72%", "Forecast model"],
                        ].map(([title, value, sub]) => (
                          <div
                            key={title}
                            className="rounded-xl border bg-slate-100 p-4"
                          >
                            <p className="text-xs uppercase font-semibold tracking-wider text-slate-500">
                              {title}
                            </p>

                            <h3 className="mt-2 text-sm font-bold">
                              {value}
                            </h3>

                            <p className="mt-1 text-xs text-slate-500">
                              {sub}
                            </p>

                          </div>
                        ))}

                      </div>

                      <div className="border-t border-slate-300 p-5">

                        <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500">
                          Primary Drivers
                        </h4>

                        <ul className="mt-3 space-y-2 text-xs text-slate-600 list-disc pl-5">
                          <li>Brent crude +4.1% accelerating</li>
                          <li>Germany pass-through rate 78%</li>
                          <li>Logistics sector exposure remains high</li>
                          <li>Forecast reliability at 72%</li>
                        </ul>

                      </div>

                    </div>

                  </div>

                </div>
              </div>


            </>
            : LoaderOverlay()
        }

      </div>

    </>
  );
}