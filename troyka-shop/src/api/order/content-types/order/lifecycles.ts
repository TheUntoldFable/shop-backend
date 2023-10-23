export default {
	async afterCreate(event) {
		const { result } = event
		if(result?.addressInfo?.officeAddress) {
			try {
				await strapi.plugins['email'].services.email.send({
					to: 'pilyovmartin20@gmail.com',
					from: 'info.troyka@gmail.com', //e.g. single sender verification in SendGrid
					subject: 'Нова поръчка',
					html: `<div><h2>Поръка №: ${result.orderId}</h2></br>
			<div>Адрес:</div></br>
			<div>Офис Адрес: ${result.addressInfo.officeAddress}</div></br>
			<div>Име: ${result.credentialsInfo.firstName}</div></br>
			<div>Фамилия: ${result.credentialsInfo.secondName}</div></br>
			<div>Мобилен: ${result.credentialsInfo.phoneNumber}</div></br>
			<div>Акаунт: ${result.user}</div></br>
			<div>Имейл: ${result.credentialsInfo.email}</div></br>
			<h3>Стойност на поръчка: ${result.totalPrice}лв</h3></div>`,
				})
			} catch (error) {
				console.log(error, 'e-mail error.')
				throw new Error('Can not send email, there has been an issue')
			}

		} else {
			try {
				await strapi.plugins['email'].services.email.send({
					to: 'pilyovmartin20@gmail.com',
					from: 'info.troyka@gmail.com', //e.g. single sender verification in SendGrid
					subject: 'Нова поръчка',
					html: `<div><h2>Поръка №: ${result.orderId}</h2></br>
			<div>Адрес:</div></br>
			<div>Град: ${result.addressInfo.city}</div></br>
			<div>Улица: ${result.addressInfo.street}</div></br>
			<div>Номер на вход/сграда: ${result.addressInfo.houseNumber}</div></br>
			<div>Пощенски код: ${result.addressInfo.postalCode}</div></br>
			<div>Име: ${result.credentialsInfo.firstName}</div></br>
			<div>Фамилия: ${result.credentialsInfo.secondName}</div></br>
			<div>Мобилен: ${result.credentialsInfo.phoneNumber}</div></br>
			<div>Акаунт: ${result.user}</div></br>
			<div>Имейл: ${result.credentialsInfo.email}</div></br>
			<h3>Стойност на поръчка: ${result.totalPrice}лв</h3></div>`,
				})
			} catch (error) {
				console.log(error, 'e-mail error.')
				throw new Error('Can not send email, there has been an issue')
			}
		}
	}
}
