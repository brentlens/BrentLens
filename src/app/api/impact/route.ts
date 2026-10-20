import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

interface ImpactEventRequest {
    user_id: string;
    shock_index: number;
    new_cost_impact: number;
}

// Calculate days remaining from impact_date
function getDaysRemaining(impactDate: string): number {
    const today = new Date();

    const todayOnly = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
    );

    const [year, month, day] = impactDate
        .split("-")
        .map(Number);

    const impactOnly = new Date(
        year,
        month - 1,
        day
    );

    return Math.round(
        (impactOnly.getTime() - todayOnly.getTime()) /
        (1000 * 60 * 60 * 24)
    );
}

// Format Date as YYYY-MM-DD
function formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(
        date.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
        date.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

export async function POST(request: Request) {
    try {
        const body: ImpactEventRequest = await request.json();
        const {user_id,shock_index,new_cost_impact,} = body;

        if (!user_id || shock_index === undefined || new_cost_impact === undefined
        ) {
            return NextResponse.json(
                {
                    success: false,
                    message:
                        "user_id, shock_index and new_cost_impact are required",
                },
                { status: 400 }
            );
        }

        if (shock_index <= 25) {
            return NextResponse.json({
                success: true,
                action: "none",
                message:
                    "No active event and shock index is not greater than 25",
            });
        }

        const { data: activeEvent, error: selectError } =
            await supabase
                .from("brent_user_impact_events")
                .select("*")
                .eq("user_id", user_id)
                .eq("status", "active")
                .maybeSingle();

        if (selectError) {
            console.error(
                "Error finding active event:",
                selectError
            );

            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Failed to check active impact event",
                },
                { status: 500 }
            );
        }

        if (activeEvent) {
            const daysRemaining = getDaysRemaining(
                activeEvent.impact_date
            );

            const updateData: {
                cost_impact: number;
                days_remaining: number;
                status?: string;
                latest_shock:number;
                last_shock: number
            } = {
                cost_impact: new_cost_impact,
                days_remaining: daysRemaining,
                latest_shock: shock_index,
                last_shock: activeEvent?.latest_shock
            };

            // Impact date has arrived
            if (daysRemaining <= 0) {
                updateData.status = "arrived";
            }

            // store both last & lates shock then find medium / high

            const {data: updatedEvent,error: updateError,} = await supabase.from("brent_user_impact_events")
                .update(updateData)
                .eq("id", activeEvent.id)
                .select()
                .single();

            if (updateError) {
                console.error("Error updating event:",updateError);

                return NextResponse.json({success: false,message:"Failed to update impact event",},
                    { status: 500 }
                );
            }



            return NextResponse.json({
                success: true,
                action: "updated",
                event: updatedEvent,
            });
        }

        const impactDate = new Date();

        impactDate.setDate(
            impactDate.getDate() + 9
        );

        const formattedImpactDate =
            formatDate(impactDate);

        const { data: newEvent, error: insertError } =
            await supabase
                .from("brent_user_impact_events")
                .insert({
                    user_id,
                    cost_impact: new_cost_impact,
                    impact_date: formattedImpactDate,
                    days_remaining: 9,
                    status: "active",
                    detected_on: new Date(),
                    last_shock: 0,
                    latest_shock: shock_index
                })
                .select()
                .single();

        if (insertError) {
            console.error(
                "Error creating impact event:",
                insertError
            );

            return NextResponse.json(
                {
                    success: false,
                    message:
                        "Failed to create impact event",
                },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            action: "created",
            event: newEvent,
        });

    } catch (error) {
        console.error(
            "Impact event API error:",
            error
        );

        return NextResponse.json(
            {
                success: false,
                message: "Internal server error",
            },
            { status: 500 }
        );
    }
}
