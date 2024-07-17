import { eq } from "drizzle-orm";
import { headers } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import Stripe from "stripe";

import db from "@/db/drizzle";
import { userSubscription } from "@/db/schema";
import { stripe } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("Stripe-Signature") as string;

  console.log("Received signature:", signature);

  if (!signature) {
    console.error("Missing Stripe-Signature header");
    return new NextResponse("Missing Stripe-Signature header", { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET as string
    );
  } catch (error: unknown) {
    console.error("Webhook signature verification failed:", error);
    return new NextResponse(`Webhook error ${JSON.stringify(error)}`, {
      status: 400,
    });
  }

  console.log("Constructed event:", event);

  const session = event.data.object as Stripe.Checkout.Session;

  try {
    // User subscription completed
    if (event.type === "checkout.session.completed") {
      const subscription = await stripe.subscriptions.retrieve(
        session.subscription as string
      );

      if (!session?.metadata?.userId) {
        console.error("User id is required in session metadata");
        return new NextResponse("User id is required.", { status: 400 });
      }

      await db.insert(userSubscription).values({
        userId: session.metadata.userId,
        stripeSubscriptionId: subscription.id,
        stripeCustomerId: subscription.customer as string,
        stripePriceId: subscription.items.data[0].price.id,
        stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000), // in ms
      });
    }

    // Renew user subscription
    if (event.type === "invoice.payment_succeeded") {
      const subscription = await stripe.subscriptions.retrieve(
        session.subscription as string
      );

      await db
        .update(userSubscription)
        .set({
          stripePriceId: subscription.items.data[0].price.id,
          stripeCurrentPeriodEnd: new Date(
            subscription.current_period_end * 1000 // in ms
          ),
        })
        .where(eq(userSubscription.stripeSubscriptionId, subscription.id));
    }
  } catch (dbError) {
    console.error("Database operation failed:", dbError);
    return new NextResponse(`Database error ${JSON.stringify(dbError)}`, {
      status: 500,
    });
  }

  console.log("Webhook processed successfully");
  return new NextResponse(null, { status: 200 });
}

