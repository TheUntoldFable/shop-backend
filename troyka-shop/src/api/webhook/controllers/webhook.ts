import Stripe from 'stripe'
import { Order } from '../../../models/order'
import { homeType, officeType, paymentArrive, paymentCard, selectSubject, selectTemplateId } from '../../../utils/mailLocales'

const stripeConfig: Stripe.StripeConfig = {
	apiVersion: '2022-11-15',
}

const stripe = new Stripe(
	process.env.NODE_ENV === 'development'
		? process.env.STRIPE_SK_KEY_TEST
		: process.env.STRIPE_SK_KEY_LIVE,
	stripeConfig
)
const endpointSecret = process.env.WEBHOOK_SECRET

export default {
	async handler(ctx, _next) {
		// This is your Stripe CLI webhook secret for testing your endpoint locally.
		let event

		const raw = ctx.request.body[Symbol.for('unparsedBody')]

		try {
			const sig = ctx.request.header['stripe-signature']
			if (sig) {
				event = stripe.webhooks.constructEvent(raw, sig, endpointSecret)
				ctx.response.status = 200
			}
		} catch (err) {
			console.log(err, 'err')
			ctx.response.status = 400
			return
		}

		// Handle the event

		switch (event.type) {
		case 'payment_intent.succeeded':
			if (event.data.object) {
				let orders: Order[]

				try {
					orders = await strapi.entityService.findMany('api::order.order', {
						sort: { id: 'desc' },
					})
				} catch (error) {
					console.log(error, 'Error fetching orders')
				}

				const itemToUpdate = orders.find((item) => item)

				const locale = itemToUpdate.products.find(
					(item) => item.attributes.locale
				).attributes.locale

				if (itemToUpdate) {
					try {
						const entry = await strapi.entityService.update(
							'api::order.order',
							itemToUpdate?.id,
							{
								fields: ['orderId', 'paymentMethod', 'totalPrice'],
								data: {
									isPaid: true,
								},
							}
						)

						const calculateDelivery = () => {
							if (itemToUpdate.totalPrice >= 50) {
								return 0
							}
							if (itemToUpdate.totalPrice < 50) {
								return itemToUpdate.addressInfo?.officeAddress ? 5 : 7.5
							}
						}

						try {
							await strapi.plugins['email'].services.email.send({
								to: itemToUpdate?.credentialsInfo?.email,
								from: 'info.troyka@gmail.com',
								subject: selectSubject[locale],
								template_id: selectTemplateId[locale],
								dynamic_template_data: {
									order_id: itemToUpdate.orderId.toUpperCase(),
									address: itemToUpdate.addressInfo,
									office_address: itemToUpdate.addressInfo?.officeAddress,
									payment_option: itemToUpdate.paymentMethod,
									payment_method: itemToUpdate.paymentMethod === 'arrive'? paymentArrive[locale]: paymentCard[locale],
									delivery_option: itemToUpdate.addressInfo?.officeAddress
										? officeType[locale]
										: homeType[locale],
									subtotal: itemToUpdate.totalPrice - calculateDelivery(),
									total: itemToUpdate.totalPrice - calculateDelivery(),
									delivery_price: calculateDelivery(),
									billing_address: itemToUpdate?.billingAddressInfo,
									products: itemToUpdate.products
								}
							})
						}catch (error) {
							console.log(error,' error')
						}

						console.log(entry, '- Order')
					} catch (error) {
						console.log(error, 'Error updating item.')
					}
				}
			}
			break

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
			console.log(`Unhandled event type ${event.type}`)
		}
	},
}
