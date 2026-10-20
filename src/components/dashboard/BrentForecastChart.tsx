"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  generateBrentForecast,
  BrentPrice,
} from "@/lib/brentForecast";

import { supabase } from "@/lib/supabaseClient";


/* =========================================================
   TYPES
========================================================= */

interface DatabaseBrentRow {
  id: number;
  created_at: string;
  code: string;
  price: number | string;
}

interface ChartPoint {
  date: string;
  timestamp: number;

  historical?: number;

  forecast?: number;

  lower?: number;

  upper?: number;
}


/* =========================================================
   COMPONENT
========================================================= */

export default function BrentForecastChart() {
  const [
    priceData,
    setPriceData,
  ] = useState<BrentPrice[]>([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState<string | null>(
    null
  );


  /* =======================================================
     FETCH DATA
  ======================================================= */

  useEffect(() => {
    async function loadBrentData() {
      try {
        setLoading(true);

        setError(null);

        const {
          data,
          error,
        } = await supabase
          .from(
            "brentLens_brent_crude"
          )
          .select(
            "id, created_at, code, price"
          )
          .eq(
            "code",
            "BRENT_CRUDE_USD"
          )
          .order(
            "created_at",
            {
              ascending: true,
            }
          );

        if (error) {
          throw error;
        }

        const formattedData: BrentPrice[] =
          (
            (data ??
              []) as DatabaseBrentRow[]
          )
            .map(item => ({
              date:
                item.created_at,

              price:
                Number(
                  item.price
                ),
            }))
            .filter(
              item =>
                Number.isFinite(
                  item.price
                ) &&
                item.price > 0
            );

        setPriceData(
          formattedData
        );
      } catch (err) {
        console.error(
          "Brent price loading error:",
          err
        );

        setError(
          "Unable to load Brent price data."
        );
      } finally {
        setLoading(false);
      }
    }

    loadBrentData();
  }, []);


  /* =======================================================
     GENERATE FORECAST
  ======================================================= */

const forecastResult = useMemo(() => {
  return generateBrentForecast(
    priceData,
    12 // 12 weeks forecast projection
  );
}, [priceData]);


  /* =======================================================
     BUILD CHART DATA
  ======================================================= */

  const chartData =
    useMemo(() => {
      if (
        !forecastResult
          .historical.length
      ) {
        return [];
      }

      /*
       * -----------------------------
       * HISTORICAL
       * -----------------------------
       */

      const historicalPoints: ChartPoint[] =
        forecastResult.historical.map(
          item => ({
            date: item.date,

            timestamp:
              new Date(
                item.date
              ).getTime(),

            historical:
              item.price,
          })
        );


      /*
       * Last historical point.
       */
      const lastHistorical =
        forecastResult.historical[
          forecastResult.historical
            .length - 1
        ];


      /*
       * -----------------------------
       * FORECAST START
       * -----------------------------
       *
       * IMPORTANT:
       *
       * We add the last historical
       * point again as the forecast
       * starting point.
       *
       * This makes the blue line and
       * purple line meet exactly.
       */

      const forecastStartPoint:
        ChartPoint = {
          date:
            lastHistorical.date,

          timestamp:
            new Date(
              lastHistorical.date
            ).getTime(),

          historical:
            lastHistorical.price,

          forecast:
            lastHistorical.price,

          lower:
            lastHistorical.price,

          upper:
            lastHistorical.price,
        };


      /*
       * -----------------------------
       * FUTURE FORECAST
       * -----------------------------
       */

      const forecastPoints:
        ChartPoint[] =
        forecastResult.forecast.map(
          item => ({
            date: item.date,

            timestamp:
              new Date(
                item.date
              ).getTime(),

            forecast:
              item.forecast,

            lower:
              item.lower,

            upper:
              item.upper,
          })
        );


      /*
       * Remove the original final
       * historical point because it
       * is replaced by the combined
       * TODAY point above.
       */

      const historicalWithoutLast =
        historicalPoints.slice(
          0,
          -1
        );


      return [
        ...historicalWithoutLast,

        forecastStartPoint,

        ...forecastPoints,
      ];
    }, [forecastResult]);


  /* =======================================================
     TODAY
  ======================================================= */

  const todayTimestamp =
    forecastResult.historical
      .length > 0
      ? new Date(
          forecastResult
            .historical[
            forecastResult
              .historical.length -
              1
          ].date
        ).getTime()
      : null;


  /* =======================================================
     Y AXIS DOMAIN
  ======================================================= */

  const yDomain = useMemo(() => {
    if (!chartData.length) {
      return [0, 100];
    }

    const values: number[] = [];

    chartData.forEach(point => {
      if (
        typeof point.historical ===
        "number"
      ) {
        values.push(
          point.historical
        );
      }

      if (
        typeof point.forecast ===
        "number"
      ) {
        values.push(
          point.forecast
        );
      }

      if (
        typeof point.lower ===
        "number"
      ) {
        values.push(
          point.lower
        );
      }

      if (
        typeof point.upper ===
        "number"
      ) {
        values.push(
          point.upper
        );
      }
    });

    const min =
      Math.min(...values);

    const max =
      Math.max(...values);

    /*
     * Small padding so the lines
     * don't touch the chart edges.
     */
    const range = max - min;

    const padding =
      Math.max(
        range * 0.12,
        2
      );

    return [
      Math.max(
        0,
        Math.floor(
          min - padding
        )
      ),
      Math.ceil(
        max + padding
      ),
    ];
  }, [chartData]);


  /* =======================================================
     DATE FORMAT
  ======================================================= */

  const formatDate = (
    timestamp: number
  ) => {
    return new Date(
      timestamp
    ).toLocaleDateString(
      "en-US",
      {
        month: "short",
        day: "numeric",
      }
    );
  };


  const formatFullDate = (
    timestamp: number
  ) => {
    return new Date(
      timestamp
    ).toLocaleDateString(
      "en-US",
      {
        month: "short",
        day: "numeric",
        year: "numeric",
      }
    );
  };


  /* =======================================================
     LOADING
  ======================================================= */

  if (loading) {
    return (
      <div className="w-full overflow-hidden rounded-xl border border-[#dfe3ea] bg-white shadow-sm">

        <div className="flex items-start justify-between border-b border-[#edf0f4] px-5 py-4">

          <div>
            <div className="h-5 w-64 animate-pulse rounded bg-gray-100" />

            <div className="mt-2 h-3 w-96 animate-pulse rounded bg-gray-100" />
          </div>

          <div className="flex gap-5">
            <div className="h-3 w-20 animate-pulse rounded bg-gray-100" />

            <div className="h-3 w-20 animate-pulse rounded bg-gray-100" />
          </div>

        </div>

        <div className="h-[300px] animate-pulse bg-white" />

        <div className="border-t border-[#edf0f4] bg-[#fafbfc] px-5 py-3">
          <div className="h-4 w-3/4 animate-pulse rounded bg-gray-100" />
        </div>

      </div>
    );
  }


  /* =======================================================
     ERROR
  ======================================================= */

  if (error) {
    return (
      <div className="w-full rounded-xl border border-red-100 bg-white p-5">

        <p className="text-sm font-medium text-red-600">
          {error}
        </p>

      </div>
    );
  }


  /* =======================================================
     EMPTY
  ======================================================= */

  if (!priceData.length) {
    return (
      <div className="w-full rounded-xl border border-[#dfe3ea] bg-white p-8 text-center">

        <p className="text-sm text-gray-500">
          No Brent crude price
          data available.
        </p>

      </div>
    );
  }


  /* =======================================================
     MAIN
  ======================================================= */

  return (
    <div className="w-full overflow-hidden rounded-xl border border-[#dfe3ea] bg-white shadow-sm">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="flex items-start justify-between border-b border-[#edf0f4] px-5 py-4">

        <div>

          <h2 className="text-[16px] font-semibold text-[#111827]">
            Brent Crude — Source Data
          </h2>

          <p className="mt-0.5 text-[13px] text-[#64748b]">
            Supporting signal behind your
            cost forecast · Not the product
            · Hover to inspect
          </p>

        </div>


        {/* LEGEND */}

        <div className="flex items-center gap-5 pt-1 text-[13px]">

          <div className="flex items-center gap-2">

            <span
              className="h-[2px] w-5"
              style={{
                backgroundColor:
                  "#6366F1",
              }}
            />

            <span className="text-[#475569]">
              Historical
            </span>

          </div>


          <div className="flex items-center gap-2">

            <span
              className="h-[2px] w-5"
              style={{
                backgroundColor:
                  "#A855F7",
              }}
            />

            <span className="text-[#475569]">
              Forecast
            </span>

          </div>

        </div>

      </div>


      {/* =================================================
          CHART
      ================================================= */}

      <div className="px-3 pb-1 pt-5">

        <ResponsiveContainer
          width="100%"
          height={300}
        >

          <ComposedChart
            data={chartData}
            margin={{
              top: 20,
              right: 10,
              left: 25,
              bottom: 5,
            }}
          >

            {/* ===========================================
                GRADIENT
            =========================================== */}

            <defs>

              <linearGradient
                id="brentForecastGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >

                <stop
                  offset="0%"
                  stopColor="#C084FC"
                  stopOpacity={0.20}
                />

                <stop
                  offset="100%"
                  stopColor="#C084FC"
                  stopOpacity={0.04}
                />

              </linearGradient>

            </defs>


            {/* ===========================================
                GRID
            =========================================== */}

            <CartesianGrid
              horizontal={true}
              vertical={false}
              stroke="#EEF1F5"
              strokeWidth={1}
            />


            {/* ===========================================
                X AXIS
            =========================================== */}

            <XAxis
              type="number"
              dataKey="timestamp"
              domain={[
                "dataMin",
                "dataMax",
              ]}
              scale="time"
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "#CBD5E1",
                fontSize: 12,
              }}
              tickFormatter={
                formatDate
              }
              minTickGap={45}
            />


            {/* ===========================================
                Y AXIS
            =========================================== */}

            <YAxis
              axisLine={false}
              tickLine={false}
              width={55}
              domain={yDomain}
              tick={{
                fill: "#CBD5E1",
                fontSize: 12,
              }}
              tickFormatter={value =>
                `$${Math.round(
                  value
                )}`
              }
            />


            {/* ===========================================
                TOOLTIP
            =========================================== */}

            <Tooltip
              cursor={{
                stroke: "#A5B4FC",
                strokeDasharray:
                  "4 4",
              }}
              content={({
                active,
                payload,
              }) => {

                if (
                  !active ||
                  !payload ||
                  !payload.length
                ) {
                  return null;
                }

                const point =
                  payload[0]
                    ?.payload as ChartPoint;

                if (!point) {
                  return null;
                }

                return (
                  <div className="min-w-[180px] rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-lg">

                    <p className="mb-1 text-xs text-gray-500">
                      {formatFullDate(
                        point.timestamp
                      )}
                    </p>


                    {typeof point.historical ===
                      "number" && (
                      <p className="text-sm font-semibold text-[#6366F1]">
                        Historical: $
                        {point.historical.toFixed(
                          2
                        )}
                      </p>
                    )}


                    {typeof point.forecast ===
                      "number" && (
                      <p className="text-sm font-semibold text-[#A855F7]">
                        Forecast: $
                        {point.forecast.toFixed(
                          2
                        )}
                      </p>
                    )}


                    {typeof point.lower ===
                      "number" &&
                      typeof point.upper ===
                        "number" && (
                        <p className="mt-1 text-xs text-gray-500">
                          Range: $
                          {point.lower.toFixed(
                            2
                          )}{" "}
                          – $
                          {point.upper.toFixed(
                            2
                          )}
                        </p>
                      )}

                  </div>
                );
              }}
            />


            {/* ===========================================
                FORECAST RANGE
            =========================================== */}

            <Area
              type="monotone"
              dataKey="upper"
              stroke="none"
              fill="url(#brentForecastGradient)"
              connectNulls={false}
              activeDot={false}
              isAnimationActive={false}
            />


            <Area
              type="monotone"
              dataKey="lower"
              stroke="none"
              fill="#FFFFFF"
              fillOpacity={1}
              connectNulls={false}
              activeDot={false}
              isAnimationActive={false}
            />


            {/* ===========================================
                HISTORICAL LINE
            =========================================== */}

            <Line
              type="monotone"
              dataKey="historical"
              stroke="#6366F1"
              strokeWidth={3}
              dot={false}
              connectNulls={false}
              activeDot={{
                r: 5,
                fill: "#6366F1",
                stroke: "#FFFFFF",
                strokeWidth: 2,
              }}
              isAnimationActive={false}
            />


            {/* ===========================================
                FORECAST LINE
            =========================================== */}

            <Line
              type="monotone"
              dataKey="forecast"
              stroke="#A855F7"
              strokeWidth={2}
              strokeDasharray="6 4"
              dot={false}
              connectNulls={false}
              activeDot={{
                r: 5,
                fill: "#A855F7",
                stroke: "#FFFFFF",
                strokeWidth: 2,
              }}
              isAnimationActive={false}
            />


            {/* ===========================================
                TODAY
            =========================================== */}

            {todayTimestamp !== null && (
              <ReferenceLine
                x={todayTimestamp}
                stroke="#A5B4FC"
                strokeDasharray="4 4"
                label={{
                  value: "TODAY",
                  position:
                    "insideTopRight",
                  fill: "#A5B4FC",
                  fontSize: 12,
                }}
              />
            )}

          </ComposedChart>

        </ResponsiveContainer>

      </div>


      {/* =================================================
          FOOTER
      ================================================= */}

      <div className="border-t border-[#edf0f4] bg-[#fafbfc] px-5 py-3">

        <p className="text-[13px] leading-5 text-[#526784]">

          <span className="mr-1">
            📌
          </span>

          This chart shows the Brent crude
          upstream signal. Your personalised
          cost impact is calculated above using
          this data combined with your
          operational profile.

        </p>

      </div>

    </div>
  );
}