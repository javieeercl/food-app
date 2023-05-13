/* eslint-env es6 */
/* eslint-disable */

const express = require('express');
const http = require('http');
const app = express();
const bodyParser = require('body-parser');

// Mercado Pago SDK
const mercadopago = require ('mercadopago');
// const { payment } = require('mercadopago');
// Add Your credentials
mercadopago.configure({
  // ACCESS TOKEN USER
  access_token: 'APP_USR-2067485852473680-122119-a03109e613acd458d1159068132adcf3-160431891'
});

app.set('port', 8101);
app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

const producto = {
  id: 12345678,
  title: 'Producto',
  unit_price: 100,
  picture_url: "https://www.mercadopago.com/org-img/MP3/home/logomp3.gif",
  quantity: 1
}

app.get('/pay', (req, res) =>{
  const usuarioId = req.query.usuario;
  let preference = {
    "statement_descriptor": "MINEGOCIO",
    // "binary_mode": true,
    // "purpose": "wallet_purchase",
    "back_urls": {
      "success": "http://localhost:8100/success",
      "failure": "http://localhost:8100/success",
      "pending": "http://localhost:8100/success"
    },
    "items": [
      {
          "id": producto.id,
          "title": producto.title,
          "currency_id": "CLP",
          "picture_url": producto.picture_url,
          "quantity": 1,
          "unit_price": producto.unit_price
      }
  ],
    //URL QUE RECIBE LA NOTIFICACION
    notification_url: `https://ca71-143-255-104-34.sa.ngrok.io/notificar/${usuarioId}/${producto.id}`
  };


  mercadopago.preferences.create(preference)
  .then(function(response){
  // This value replaces the String "<%= global.id %>" in your HTML
    console.log('body id:  i*d******', response.body.id);
    console.log('body init point:  i*n*i*t****', response.body.init_point);

    res.send(`<a href="${response.body.init_point}">IR A PAGAR</a>`)
    global.id = response.body.id;
  }).catch(function(error){
    console.log(error);
  });



});

// app.use('/', (req, res) => {
//   res.json({test: 123})
// })

app.get('/success', (req, res)  => {
  res.send('TODOSALIOBIEN')
})

app.post('/notificar/:usuarioId/:productoId', async (req, res) => {
  console.log('NOTIFICAR');
  const { query } = req;
  const { params } = req;

  console.log({params});
  const topic = query.topic || query.type;
  console.log({topic});

  switch(topic) {
    case "payment":
      const paymentId = query.id || query['data.id'];
      console.log(topic, 'getting payment', paymentId);
      const payment = await mercadopago.payment.findById(paymentId);
      console.log(payment.body);
      // console.log(topic, 'getting merch order');
      var { body }  = await mercadopago.merchant_orders.findById(payment.body.order.id);
      break;
    case "merchant_order":
      const orderId = query.id;
      console.log(topic, 'getting merch order', orderId);
      var { body } = await mercadopago.merchant_orders.findById(orderId);
      break;
  }
  console.log(body.payment);

  var paidAmount = 0;
  body.payments.forEach(payment => {
    if (payment.status === 'approved') {
      paidAmount += payment.transaction_amount;
    }
  });
  if (paidAmount >= body.total_amount) {
    console.log('Pago exitoso');

    // informarUsuario(params.usuarioId).getProductoComprado(params.productoId);
  } else {
    console.log('Error al procesar pago');
  }


  res.send();

})



// mercadopago.merchant_orders.findById('6966946563').then(res => console.log(res.body));

http.createServer(app).listen(app.get('port'), () => {
  console.log('HTTP Escuchando en puerto: ' + app.get('port'));
});


