('use strict')
import { v4 as uuidv4 } from 'uuid'

const stripe = require('stripe')(
	process.env.NODE_ENV === 'development'
		? process.env.STRIPE_SK_KEY_TEST
		: process.env.STRIPE_SK_KEY_LIVE
)
/**
 * order controller
 */
const { createCoreController } = require('@strapi/strapi').factories

module.exports = createCoreController('api::order.order', ({ strapi }) => ({
	async create(ctx) {
		const {
			products,
			paymentMethod,
			status,
			addressInfo,
			credentialsInfo,
			billingAddressInfo,
			user,
			totalPrice,
		} = ctx.request.body
		const { host } = ctx.request

		try {
			if (paymentMethod === 'card') {
				const orderId = await uuidv4()


				const lineItems = await Promise.all(
					products.map(async (product) => {
						const item = await strapi
							.service('api::product.product')
							.findOne(product.id)

						return {
							price_data: {
								currency: 'bgn',
								product_data: {
									name: item.name,
								},
								unit_amount: Math.round(item.price * 100),
							},
							quantity: product.quantity,
						}
					})
				)


				const session = await stripe.checkout.sessions.create({
					payment_method_types: ['card'],
					mode: 'payment',
					success_url: host.includes('localhost')
						? 'http://localhost:3000/success'
						: `https://${host}/success`,
					cancel_url: host.includes('localhost')
						? 'http://localhost:3000/failed'
						: `https://${host}/failed`,
					line_items: lineItems,
					shipping_options:  totalPrice < 50 ? [
						{
							shipping_rate_data: {
								type: 'fixed_amount',
								fixed_amount: {
									amount: 750,
									currency: 'bgn',
								},
								display_name: 'Speedy',
								delivery_estimate: {
									minimum: {
										unit: 'business_day',
										value: 1,
									},
									maximum: {
										unit: 'business_day',
										value: 3,
									},
								},
							},
						},
					] : [],
				})

				const data = {
					products,
					stripeId: session.id,
					paymentMethod,
					orderId,
					status,
					addressInfo,
					billingAddressInfo,
					credentialsInfo,
					user,
					totalPrice,
				}


				if (session) {

					await strapi.service('api::order.order').create({data})
				}


				return { stripeSession: session }
			} else {
				const orderId = await uuidv4()

				await Promise.all(
					products.map(async (product) => {
						const item = await strapi
							.service('api::product.product')
							.findOne(product.id)

						return {
							price_data: {
								currency: 'bgn',
								product_data: {
									name: item.name,
								},
								unit_amount: Math.round(item.price * 100),
							},
							quantity: product.quantity,
						}
					})
				)


				const defaultData = {
					products,
					stripeId: undefined,
					paymentMethod,
					orderId,
					status,
					addressInfo,
					billingAddressInfo,
					credentialsInfo,
					user,
					totalPrice,
				}

				await strapi.service('api::order.order').create({
					data: defaultData,
				})

				return defaultData
			}
		} catch (error) {
			console.log(error, 'error')
			ctx.response.status = 500
			return { error, message: 'Something went wrong' }
		}
	},
}))
