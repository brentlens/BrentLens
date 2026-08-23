"use client";

import * as Slider from "@radix-ui/react-slider";

export default function ScenarioSlider() {
  return (
    <div className="rounded-3xl border border-gray-100 bg-white p-7 shadow-sm h-fit">

      <p className="text-gray-500 text-xs">
        Modelled Brent Price
      </p>

      <h1 className="mt-1 text-5xl font-bold text-violet-600">
        $95.00
      </h1>

      <Slider.Root
        defaultValue={[95]}
        max={130}
        min={60}
        className="relative mt-8 flex h-6 items-center"
      >
        <Slider.Track className="relative h-2 grow rounded-full bg-gray-200">
          <Slider.Range className="absolute h-full rounded-full bg-violet-500" />
        </Slider.Track>

        <Slider.Thumb className="block h-6 w-6 rounded-full border bg-white shadow-lg" />
      </Slider.Root>

      <div className="mt-3 flex justify-between text-sm text-gray-500">
        <span>$60</span>
        <span>$95</span>
        <span>$130</span>
      </div>

      <hr className="my-6" />

      <div className="rounded-2xl border border-red-200 bg-red-50 p-3 text-center">

        <p className="text-sm font-bold uppercase tracking-wider text-red-500">
          Your Additional Cost
        </p>

        <h2 className="mt-2 text-3xl font-bold text-red-500">
          +€12,600
        </h2>

      </div>

      <div className="mt-6 text-sm space-y-3">

        <Row label="Budget before" value="€161,000" />
        <Row label="Budget after" value="€173,600" red />
        <Row label="Time to impact" value="9 days" />
        <Row label="Annualised" value="€151,200" red />

      </div>

      <div className="mt-6 rounded-xl border border-red-200 bg-red-50 text-sm p-4 text-red-500">
        Increase fuel surcharge by 5–7%. Add emergency reserve. Brief executive
        team.
      </div>

    </div>
  );
}

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
      <span className="text-gray-500">{label}</span>

      <span className={`font-semibold ${red ? "text-red-500" : ""}`}>
        {value}
      </span>
    </div>
  );
}