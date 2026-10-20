import { supabase } from "@/lib/supabaseClient";
import { NextResponse } from "next/server";

type BrentPrice = {
    created_at: string;
    price: number;
};

const calculateVolatility = (
    prices: number[]
): number => {

    if (prices.length < 2) {
        return 0;
    }

    // Calculate daily log returns
    const returns: number[] = [];

    for (let i = 1; i < prices.length; i++) {
        const dailyReturn =
            Math.log(prices[i] / prices[i - 1]);

        returns.push(dailyReturn);
    }

    if (returns.length < 2) {
        return 0;
    }

    // Mean return
    const mean =
        returns.reduce(
            (sum, value) => sum + value,
            0
        ) / returns.length;

    // Variance
    const variance =
        returns.reduce(
            (sum, value) =>
                sum + Math.pow(value - mean, 2),
            0
        ) / (returns.length - 1);

    // Standard deviation
    const standardDeviation =
        Math.sqrt(variance);

    // Convert to percentage
    return standardDeviation * 100;
};

export async function GET() {

    try {
        const {
            data,
            error
        } = await supabase.rpc(
            "get_daily_brent_prices_volatility",
            {
                days_limit: 30
            }
        );

        if (error) {
            console.error(
                "Failed to fetch Brent prices:",
                error
            );

            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Failed to fetch Brent prices"
                },
                { status: 500 }
            );
        }

        const prices =
            (data as BrentPrice[]) ?? [];

        if (prices.length < 2) {

            return NextResponse.json({
                success: true,
                volatility: 0,
                days_used: prices.length,
                message:
                    "Not enough historical data to calculate volatility"
            });
        }

        const sortedPrices =
            prices.sort(
                (a, b) =>
                    new Date(a.created_at).getTime() -
                    new Date(b.created_at).getTime()
            );

        const priceValues =
            sortedPrices.map(
                row => Number(row.price)
            );

        const volatility =
            calculateVolatility(priceValues);

        return NextResponse.json({
            success: true,

            volatility: Number(
                volatility.toFixed(4)
            ),

            days_used: prices.length,

            is_full_30d:
                prices.length >= 30
        });

    } catch (error) {

        console.error(
            "Volatility API error:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message:
                    "Internal server error"
            },
            { status: 500 }
        );
    }
}