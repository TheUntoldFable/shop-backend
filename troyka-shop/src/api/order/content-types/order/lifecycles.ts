export default {
	async afterCreate(event) {
		const { result } = event

		const locale = result.products.find((item) => item?.attributes?.locale)
			.attributes?.locale

		if (result.paymentMethod !== 'card') {
			const selectMesage = {
				it: `<div><h3>Grazie per aver acquistato con noi!</h3>
				<br/>
				<p>Il tuo numero d'ordine è: <strong>${result.orderId}</strong></p>
				<p>Importo dovuto: <strong>${result.totalPrice} ${locale === 'bg' ? 'лв' : '€'}</strong></p>
				<p>Indirizzo di spedizione:
				${result?.addressInfo.officeAddress ? result?.addressInfo.officeAddress: `${result?.addressInfo.city}, ${result?.addressInfo.street}, ${result?.addressInfo.houseNumber}, ${result?.addressInfo.streetNumber}, ${result?.addressInfo.postalCode}`}</p>
				<p>Prevedi la consegna del tuo ordine entro 5 giorni lavorativi.</p>
				<div>`,
				bg: `<div><h3>Благодарим ви, че пазарувахте с нас!</h3>
				<br/>
				<p>Номерът на вашата поръчка е: <strong>${result.orderId}</strong></p>
				<p>Адрес на доставка: 
				${result?.addressInfo.officeAddress ? result?.addressInfo.officeAddress: `${result?.addressInfo.city}, ${result?.addressInfo.street}, ${result?.addressInfo.houseNumber}, ${result?.addressInfo.streetNumber}, ${result?.addressInfo.postalCode}`}</p>
				<p>Дължима сума: <strong>${result.totalPrice} ${locale === 'bg' ? 'лв' : '€'}</strong>
				<p>Очаквайте доставката на вашата поръчка до 5 работни дни.</p>
				<div>`,
				en: `<div><h3>Thank you for shopping with us!</h3>
				<br/>
				<p>Your order number is: <strong>${result.orderId}</strong></p>
				<p>Shipping address: 
				${result?.addressInfo.officeAddress ? result?.addressInfo.officeAddress: `${result?.addressInfo.city}, ${result?.addressInfo.street}, ${result?.addressInfo.houseNumber}, ${result?.addressInfo.streetNumber}, ${result?.addressInfo.postalCode}`}</p>
				<p>Amount due: <strong>${result.totalPrice} ${locale === 'bg' ? 'лв' : '€'}</strong></p>
				<p>Expect delivery of your order within 5 working days.</p>
				<div>`,
			}

			const selectSubject = {
				it: 'Il tuo ordine!',
				en: 'Your order!',
				bg: 'Вашата поръчка!',
			}

			await strapi.plugins['email'].services.email.send({
				to: result?.credentialsInfo?.email,
				from: 'info.troyka@gmail.com',
				subject: selectSubject[locale],
				html: selectMesage[locale],
			})
		}

		if (result?.addressInfo?.officeAddress) {
			try {
				await strapi.plugins['email'].services.email.send({
					to: 'kikaya4979@weirby.com',
					from: 'info.troyka@gmail.com',
					subject: 'Нова поръчка',
					html: `<div><h2>Поръка №: ${result.orderId}</h2></br>
					<div>Адрес:</div></br>
					<div>Офис Адрес: ${result.addressInfo.officeAddress}</div></br>
					<div>Име: ${result.credentialsInfo.firstName}</div></br>
					<div>Фамилия: ${result.credentialsInfo.secondName}</div></br>
					<div>Мобилен: ${result.credentialsInfo.phoneNumber}</div></br>
					<div>Акаунт: ${result.user}</div></br>
					<div>Имейл: ${result.credentialsInfo.email}</div></br>
					<h3>Стойност на поръчка: ${result.totalPrice} ${locale === 'bg' ? 'лв' : '€'}</h3></div>`,
				})
			} catch (error) {
				console.log(error, 'e-mail error.')
				throw new Error('Can not send email, there has been an issue')
			}
		} else {
			try {
				await strapi.plugins['email'].services.email.send({
					to: 'kikaya4979@weirby.com',
					from: 'info.troyka@gmail.com',
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
					<h3>Стойност на поръчка: ${result.totalPrice} ${locale === 'bg' ? 'лв' : '€'}</h3></div>`,
				})
			} catch (error) {
				console.log(error, 'e-mail error.')
				throw new Error('Can not send email, there has been an issue')
			}
		}
	},
}
