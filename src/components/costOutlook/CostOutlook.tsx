import React from 'react'
import CostSummary from './CostSummary'
import ForecastTable from './ForecastTable'
import MarketDrivers from './MarketDrivers'

const CostOutlook = () => {
    return (
        <main className=" p-10 mx-40">
            <div className="m-auto w-fit space-y-6">
                <div>
                    <p className="text-xs font-semibold tracking-widest uppercase text-indigo-500">
                        Cost Intelligence • Logistics • Germany
                    </p>
                    <h1 className="mt-2 text-xl font-bold text-gray-900">
                        Cost Outlook
                    </h1>
                </div>

                <CostSummary />

                <ForecastTable />

                <MarketDrivers />
            </div>
        </main>
    )
}

export default CostOutlook