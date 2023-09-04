import Stripe from "stripe";
import { Order } from "../../../models/order";

const stripeConfig: Stripe.StripeConfig = {
  apiVersion: "2022-11-15",
};

const stripe = new Stripe(process.env.STRIPE_SK_KEY_LIVE, stripeConfig);

export default {
  async handler(ctx, next) {
    // This is your Stripe CLI webhook secret for testing your endpoint locally.
    const endpointSecret = process.env.WEBHOOK_SECRET

    let event;

    const raw = ctx.request.body[Symbol.for("unparsedBody")];

    try {
      const sig = ctx.request.header["stripe-signature"];
      if (sig) {
        event = stripe.webhooks.constructEvent(raw, sig, endpointSecret);
        ctx.response.status = 200;
      }
    } catch (err) {
      console.log(err, "err");
      ctx.response.status = 400;
      return;
    }

    // Handle the event

    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntentSucceeded = event.data.object;

        if (paymentIntentSucceeded) {
          let orders: Order[];

          try {
            orders = await strapi.entityService.findMany("api::order.order", {
              sort: { id: "desc" },
            });
          } catch (error) {
            console.log(error, "Error fetching orders");
          }

          const itemToUpdate = orders.find((item) => item);

          if (itemToUpdate) {
            try {
              const entry = await strapi.entityService.update(
                "api::order.order",
                itemToUpdate?.id,
                {
                  fields: ["orderId", "paymentMethod", "totalPrice"],
                  data: {
                    isPaid: true,
                  },
                }
              );
              console.log(entry, "- Order");
            } catch (error) {
              console.log(error, "Error updating item.");
            }
          }
        }
        break;

      // case "charge.succeeded":
      //   const chargeSucceeded = event.data.object;
      //   const { phone, email, billing_details, name} = chargeSucceeded;

      //   const customer = await stripe.customers.create(
      //     {
      //       name,
      //       address: billing_details.address,
      //       email,
      //       phone,
      //     },
      //     { apiKey: process.env.STRIPE_KEY_TEST }
      //   );

      //   console.log(customer, "[Created] - Customer in Stripe");
      //   break;

      // Then define and call a function to handle the event payment_intent.succeeded
      // ... handle other event types
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    // Return a 200 ctx.request to acknowledge receipt of the event
  },
};
