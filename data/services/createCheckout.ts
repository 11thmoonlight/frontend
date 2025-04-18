import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLICATION_KEY!
);

export async function createCheckout(total: number) {
  try {
    const amountInCents = Math.round(total * 100);
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/create-checkout-session`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: amountInCents,
        }),
      }
    );

    const { id: sessionId } = await res.json();
    const stripe = await stripePromise;

    if (stripe) {
      const { error } = await stripe.redirectToCheckout({
        sessionId,
      });

      if (error) {
        console.error(error.message);
      }
    } else {
      console.error("Stripe has not loaded correctly");
    }
  } catch (err) {
    console.error("Error in Checkout:", err);
  }
}
