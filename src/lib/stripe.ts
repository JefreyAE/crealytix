import Stripe from "stripe";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
    console.warn("STRIPE_SECRET_KEY is missing from environment variables. Stripe functionality will be disabled.");
}

export const stripe = new Stripe(stripeSecretKey || "", {
    apiVersion: "2026-01-28.clover",
    appInfo: {
        name: "Crealytix",
        version: "0.1.0",
    },
});
