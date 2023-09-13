/**
 * subscription controller
 */

import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::subscription.subscription',({ strapi }) => ({
	async create(ctx) {
		const { email } = ctx.request.body

		if(!email) return

		try {
			const res = await strapi.service('api::subscription.subscription').create({
				data: {
					email
				},
			})

			return { emailData: res }

		} catch (error) {
			return { error }
		}
	}

}))
