import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

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

    const supabase = await createSupabaseAdminClient();

    console.log("🚀 Webhook Code Version: v3 (Admin Client Fix)");
    console.log("🔔 Stripe Webhook received:", event.type);

    switch (event.type) {
        case "checkout.session.completed": {
            const session = event.data.object as any;
            // 🎯 Fallback logic: check both metadata and client_reference_id
            const supabaseUUID = session.metadata?.supabaseUUID || session.client_reference_id;

            console.log("📦 Checkout Session Data:", {
                id: session.id,
                customer: session.customer,
                client_reference_id: session.client_reference_id,
                metadata: session.metadata
            });

            if (supabaseUUID) {
                console.log("👤 Attempting to update profile for user:", supabaseUUID);
                const plan = session.metadata?.plan || "pro"; // 🎯 Dynamic plan from metadata

                const { data: updated, error: updateError } = await supabase
                    .from("profiles")
                    .update({
                        stripe_customer_id: session.customer as string,
                        stripe_subscription_id: session.subscription as string,
                        subscription_status: "active",
                        plan: plan,
                    })
                    .eq("id", supabaseUUID)
                    .select();

                if (updateError) {
                    console.error("❌ Supabase Update Error:", updateError);
                } else if (updated && updated.length > 0) {
                    console.log("✅ Profile updated successfully:", updated[0].email);
                    revalidatePath("/dashboard", "layout");
                    revalidatePath("/pricing");
                } else {
                    console.warn("⚠️ No profile found with ID:", supabaseUUID);
                }
            } else {
                console.warn("⚠️ No user ID (supabaseUUID or client_reference_id) in session");
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
                const plan = subscription.metadata?.plan || "pro";

                await supabase
                    .from("profiles")
                    .update({
                        subscription_status: subscription.status,
                        plan: subscription.status === "active" ? plan : "free",
                    })
                    .eq("id", supabaseUUID);

                revalidatePath("/dashboard", "layout");
                revalidatePath("/pricing");
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
