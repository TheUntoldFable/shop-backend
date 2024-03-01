/**
 * subscription controller
 */

import { factories } from '@strapi/strapi'
import { Context } from 'koa'

interface SubscriptionContext extends Context {
  body: { email?: string };
}

export default factories.createCoreController(
	'api::subscription.subscription',
	({ strapi }) => ({
		async create(ctx: SubscriptionContext) {
			const email = ctx.body.email

			if (!email) return

			try {
				const res = await strapi
					.service('api::subscription.subscription')
					.create({
						data: {
							email,
						},
					})

				return { emailData: res }
			} catch (error) {
				return { error }
			}
		},
	}),
)
