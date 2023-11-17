import { homeType, officeType, paymentArrive, paymentCard, selectSubject, selectTemplateId } from '../../../../utils/mailLocales'

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

		await strapi.plugins['email'].services.email.send({
			to: 'pilyovmartin20@gmail.com',
			from: 'info.troyka@gmail.com',
			subject: 'Нова поръчка',
			html: `<div><h2>Поръка №: ${result.orderId}</h2></br>
				<div>Адрес:</div></br>
				<div>Град: ${result.addressInfo.city}</div></br>
				<div>Улица: ${result.addressInfo.street}</div></br>
				<div>Номер на вход/сграда: ${result.addressInfo?.houseNumber}</div></br>
				<div>Пощенски код: ${result.addressInfo?.postalCode}</div></br>
				<div>Име: ${result.credentialsInfo?.firstName}</div></br>
				<div>Фамилия: ${result.credentialsInfo?.secondName}</div></br>
				<div>Мобилен: ${result.credentialsInfo?.phoneNumber}</div></br>
				<div>Акаунт: ${result?.user}</div></br>
				<div>Имейл: ${result.credentialsInfo?.email}</div></br>
				<div>Офис адрес: ${result.addressInfo?.officeAddress}</div>
				<h3>Стойност на поръчка: ${result.totalPrice} ЛВ}</h3></div>`})

		if(result.paymentMethod !== 'card'){
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
						payment_method: result.paymentMethod === 'arrive'? paymentArrive[locale]: paymentCard[locale],
						delivery_option: result.addressInfo?.officeAddress
							? officeType[locale]
							: homeType[locale],
						subtotal: result.totalPrice - calculateDelivery(),
						total: result.totalPrice - calculateDelivery(),
						delivery_price: calculateDelivery(),
						billing_address: result?.billingAddressInfo,
						products: result.products
					}
				})
			} catch (error) {
				console.log(JSON.stringify(error),' error')
			}
		}

	}

}
