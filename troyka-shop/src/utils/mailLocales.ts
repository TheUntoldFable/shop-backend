export const selectSubject: Record<string, string> = {
	it: 'Il tuo ordine!',
	en: 'Your order!',
	bg: 'Вашата поръчка!',
}

export const selectTemplateId: Record<string, string> = {
	it: process.env.ORDER_TEMPLATE_IT,
	en: process.env.ORDER_TEMPLATE_EN,
	bg: process.env.ORDER_TEMPLATE_BG,
}

export const officeType = {
	it: 'Ufficio',
	en: 'Office',
	bg: 'Офис',
}

export const homeType = {
	it: 'Indirizzo personale',
	en: 'Personal Address',
	bg: 'Личен адрес',
}

export const paymentCard = {
	it: 'Con carta',
	bg: 'С карта',
	en: 'With credit card',
}

export const paymentArrive = {
	it: 'Pagamento alla consegna',
	bg: 'Наложен Платеж',
	en: 'Cash on Delivery',
}
