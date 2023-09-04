("use strict");
import { v4 as uuidv4 } from "uuid";
const stripe = require("stripe")(process.env.STRIPE_KEY_LIVE);
/**
 * order controller
 */
const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::order.order", ({ strapi }) => ({
  async create(ctx) {
    const { products, paymentMethod, status, addressInfo, user, totalPrice } =
      ctx.request.body;
    const { host } = ctx.request;
    try {
      if (paymentMethod === "card") {
        const orderId = await uuidv4();

        const lineItems = await Promise.all(
          products.map(async (product) => {
            const item = await strapi
              .service("api::product.product")
              .findOne(product.id);

            return {
              price_data: {
                currency: "bgn",
                product_data: {
                  name: item.name,
                },
                unit_amount: Math.round(item.price * 100),
              },
              quantity: product.quantity,
            };
          })
        );

        const session = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          mode: "payment",
          success_url: host.includes("localhost")
            ? "http://localhost:3000/success"
            : `${host}/success`,
          cancel_url: host.includes("localhost")
            ? "http://localhost:3000/failed"
            : `${host}/failed`,
          line_items: lineItems,
        });


        if (session) {
          await strapi.service("api::order.order").create({
            data: {
              products,
              stripeId: session.id,
              paymentMethod,
              orderId,
              status,
              addressInfo,
              user,
              totalPrice,
            },
          });
        }

        return { stripeSession: session };
      } else {
        const orderId = await uuidv4();

        await Promise.all(
          products.map(async (product) => {
            const item = await strapi
              .service("api::product.product")
              .findOne(product.id);

            console.log("this is item------->", item);
            console.log("this is product------->", product);

            return {
              price_data: {
                currency: "bgn",
                product_data: {
                  name: item.name,
                },
                unit_amount: Math.round(item.price * 100),
              },
              quantity: product.quantity,
            };
          })
        );

        await strapi.service("api::order.order").create({
          data: {
            addressInfo,
            products,
            stripeId: undefined,
            paymentMethod,
            orderId,
            status,
            user,
            totalPrice,
          },
        });

        return {
          products,
          stripeId: undefined,
          paymentMethod,
          addressInfo,
          user,
          totalPrice,
        };
      }
    } catch (error) {
      ctx.response.status = 500;
      return { error };
    }
  },
}));
