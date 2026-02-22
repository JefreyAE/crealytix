import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
    const body = await req.text();
    const signature = (await headers()).get("Stripe-Signature") as string;

    let event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (error: any) {
        return NextResponse.json({ error: `Webhook Error: ${error.message}` }, { status: 400 });
    }

    const supabase = await createSupabaseServerClient();

    console.log("🔔 Stripe Webhook received:", event.type);

    switch (event.type) {
        case "checkout.session.completed": {
            const session = event.data.object as any;
            const supabaseUUID = session.metadata?.supabaseUUID;

            console.log("📦 Checkout Session Metadata:", session.metadata);

            if (supabaseUUID) {
                console.log("👤 Updating profile for user:", supabaseUUID);
                const { error: updateError } = await supabase
                    .from("profiles")
                    .update({
                        stripe_customer_id: session.customer as string,
                        stripe_subscription_id: session.subscription as string,
                        subscription_status: "active",
                        plan: "pro",
                    })
                    .eq("id", supabaseUUID);

                if (updateError) {
                    console.error("❌ Error updating profile:", updateError);
                } else {
                    console.log("✅ Profile updated successfully");
                }
            } else {
                console.warn("⚠️ No supabaseUUID found in session metadata");
            }
            break;
        }
        case "customer.subscription.updated":
        case "customer.subscription.deleted": {
            const subscription = event.data.object as any;
            const supabaseUUID = subscription.metadata?.supabaseUUID;

            console.log("📝 Subscription Metadata:", subscription.metadata);

            if (supabaseUUID) {
                console.log("👤 Updating subscription status for user:", supabaseUUID);
                await supabase
                    .from("profiles")
                    .update({
                        subscription_status: subscription.status,
                        plan: subscription.status === "active" ? "pro" : "free",
                    })
                    .eq("id", supabaseUUID);
            } else {
                console.warn("⚠️ No supabaseUUID found in subscription metadata");
            }
            break;
        }
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    return NextResponse.json({ received: true });
}
