import { createClient } from "@/lib/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        // const { searchParams } = new URL(request.url);
        const id = 'lifetime_founding';
        if (!id) {
            return NextResponse.json(
                { message: "Unable to find promotion quota" },
                { status: 400 }
            );
        }
        const supabase = await createClient();

        /**
         select up.id,up.email, up.name, up.role, up.preference,
            s.status as subscriptionStatus, s.expires_at, s."isOnTrial",s.activated_at,
            ppp.promotion_id,ppp.plan_id, ppp.special_price,ppp.billing_interval,
            p.name,p.price as originalPrice
            from users_profile up  left join subscriptions s
            on s.user_id = up.id
            left join promotion_plan_prices ppp 
            on ppp.id = s.plan_id
            left join plans p on p.id = ppp.plan_id
            where up.id = 'dba654a4-bd49-4ce8-a3a4-9c995ff720cb'
         */
      const { data, error: dbError } = await supabase
  .from("users_profile")
  .select(`
    id,
    email,
    name,
    role,
    preference,

    subscriptions (
      status,
      expires_at,
      isOnTrial,
      activated_at,

      promotion_plan_prices (
        promotion_id,
        plan_id,
        special_price,
        billing_interval,

        plans (
          name,
          description,
          currency,
          price
        )
        )
    )
  `)
  .eq("id", 'dba654a4-bd49-4ce8-a3a4-9c995ff720cb')
  .eq("subscriptions.promotion_plan_prices.plans.is_active", true);

        if (dbError) {
            return NextResponse.json(
                { message: `Database crash: ${dbError.message}` },
                { status: 500 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: "Fetched data",
                record: data
            },
            { status: 200 }
        );

    } catch (error: any) {
        return NextResponse.json(
            { message: error.message || "Internal server processing failure exceptions." },
            { status: 500 }
        );
    }
}