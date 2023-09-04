export default {
  async afterCreate(event) {
    const { result } = event;
    try {
      await strapi.plugins["email"].services.email.send({
        to: "pilyovmartin20@gmail.com",
        from: "threeoyka@gmail.com", //e.g. single sender verification in SendGrid
        subject: "Нова поръчка",
        html: `<div><h2>Поръка №: ${result.orderId}</h2></br>
        <div>Адрес:</div></br>
        <div>Град: ${result.addressInfo.city}</div></br>
        <div>Улица: ${result.addressInfo.street}</div></br>
        <div>Номер на вход/сграда: ${result.addressInfo.houseNumber}</div></br>
        <div>Пощенски код: ${result.addressInfo.postalCode}</div></br>
        <div>Име: ${result.addressInfo.firstName}</div></br>
        <div>Фамилия: ${result.addressInfo.secondName}</div></br>
        <div>Мобилен: ${result.addressInfo.phoneNumber}</div></br>
        <div>Акаунт: ${result.user}</div></br>
        <div>Имейл: ${result.addressInfo.email}</div></br>
        <h3>Стойност на поръчка: ${result.totalPrice}лв</h3></div>`,
      });
    } catch (error) {
      console.log(error, "e-mail error.");
      throw new Error("Can not send email, there has been an issue");
    }
  },
};
