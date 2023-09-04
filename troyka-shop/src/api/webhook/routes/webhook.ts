export default {
  routes: [
    {
     method: 'POST',
     path: '/webhook',
     handler: 'webhook.handler',
     config: {
       policies: [],
       middlewares: [],
     },
    },
  ],
};
