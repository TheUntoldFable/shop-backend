import { sendMailTo } from '../../../../../helpers/mailer'
import {
	homeType,
	officeType,
	paymentArrive,
	paymentCard,
	selectSubject,
	selectTemplateId,
} from '../../../../utils/mailLocales'

export default {
	async afterCreate(event) {
		const { result } = event

		const locale = result.products.find((item) => item?.attributes?.locale)
			.attributes?.locale

		const calculateDelivery = () => {
			if (result.totalPrice >= 50) {
				return 0
			}
			if (result.totalPrice < 50) {
				return result.addressInfo?.officeAddress ? 5 : 7.5
			}
		}

		await Promise.all([
			sendMailTo('pilyovmartin20@gmail.com', result),
			sendMailTo('georgi.yankov.24@gmail.com', result),
      sendMailTo('tsvetomir.uzunoff@gmail.com', result),
		])

			try {
				await strapi.plugins['email'].services.email.send({
					to: result?.credentialsInfo?.email,
					from: 'info.troyka@gmail.com',
					subject: selectSubject[locale],
					template_id: selectTemplateId[locale],
					content: [],
					dynamic_template_data: {
						order_id: result.orderId.toUpperCase(),
						address: result.addressInfo,
						office_address: result.addressInfo?.officeAddress,
						payment_option: result.payment_method,
						payment_method:
            result.paymentMethod === 'arrive' ? paymentArrive[locale]: paymentCard[locale],
						delivery_option: result.addressInfo?.officeAddress
							? officeType[locale]
							: homeType[locale],
						subtotal: result.totalPrice - calculateDelivery(),
						total: result.totalPrice - calculateDelivery(),
						delivery_price: calculateDelivery(),
						billing_address: result?.billingAddressInfo,
						products: result.products,
					},
				})
			} catch (error) {

				console.log(JSON.stringify(error), 'Error when sending email.')
			}
	},
}
