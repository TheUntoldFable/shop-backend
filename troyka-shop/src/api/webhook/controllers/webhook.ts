import Stripe from 'stripe'
import { Order } from '../../../models/order'

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

						const selectMesage = {
							it: `<div><h3>Grazie per aver acquistato con noi!</h3>
							<br/>
							<p>Il tuo numero d'ordine è: <strong>${itemToUpdate.orderId}</strong></p>
							<p>Prevedi la consegna del tuo ordine entro 5 giorni lavorativi.</p>
							<div>`,
							bg: `<div><h3>Благодарим ви, че пазарувахте с нас!</h3>
						<br/>
						<p>Номерът на вашата поръчка е: <strong>${itemToUpdate.orderId}</strong></p>
						<p>Очаквайте доставката на вашата поръчка до 5 работни дни.</p>
						<div>`,
							en: `<div><h3>Thank you for shopping with us!</h3>
							<br/>
							<p>Your order number is: <strong>${itemToUpdate.orderId}</strong></p>
							<p>Expect delivery of your order within 5 working days.</p>
							<div>`,
						}

						const selectSubject = {
							it: 'Il tuo ordine!',
							en: 'Your order!',
							bg: 'Вашата поръчка!'
						}

						//Send message to recipient
						await strapi.plugins['email'].services.email.send({
							to: itemToUpdate?.credentialsInfo?.email,
							from: 'info.troyka@gmail.com', //e.g. single sender verification in SendGrid
							subject: selectSubject[locale],
							html: selectMesage[locale],
						})

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
