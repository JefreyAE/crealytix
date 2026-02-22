import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
    try {
        const supabase = await createSupabaseServerClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { priceId, planKey } = await req.json();

        if (!priceId) {
            return NextResponse.json({ error: "Price ID is required" }, { status: 400 });
        }

        // Get or create Stripe customer
        const { data: profile } = await supabase
            .from("profiles")
            .select("stripe_customer_id, email")
            .eq("id", user.id)
            .single();

        let stripeCustomerId = profile?.stripe_customer_id;

        if (!stripeCustomerId) {
            const customer = await stripe.customers.create({
                email: user.email || profile?.email,
                metadata: {
                    supabaseUUID: user.id,
                },
            });
            stripeCustomerId = customer.id;

            await supabase
                .from("profiles")
                .update({ stripe_customer_id: stripeCustomerId })
                .eq("id", user.id);
        }

        const session = await stripe.checkout.sessions.create({
            customer: stripeCustomerId,
            client_reference_id: user.id, // 🎯 High-reliability backup for User ID
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            mode: "subscription",
            success_url: `${req.headers.get("origin")}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${req.headers.get("origin")}/pricing`,
            metadata: {
                supabaseUUID: user.id,
                plan: planKey // 🚀 Dynamic plan (pro, agency)
            },
            subscription_data: {
                metadata: {
                    supabaseUUID: user.id,
                    plan: planKey
                },
            },
        });

        return NextResponse.json({ url: session.url });
    } catch (error: any) {
        console.error("Stripe Checkout Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
