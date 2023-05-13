import { Component, OnInit } from '@angular/core';
import { CheckoutService } from 'src/app/services/checkout.service';
import { get } from 'scriptjs';

@Component({
  selector: 'app-mercadopago-button',
  templateUrl: './mercadopago-button.component.html',
  styleUrls: ['./mercadopago-button.component.scss']
})
export class MercadopagoButtonComponent implements OnInit {

  init_point: any;

  preference = {
    // statement_descriptor: "MINEGOCIO",
    items: [
        {
          id: 12345678,
          title: 'Producto',
          unit_price: 100,
          picture_url: "https://www.mercadopago.com/org-img/MP3/home/logomp3.gif",
          quantity: 1
        }
    ]
  };

  constructor(private checkoutService: CheckoutService) { }

  ngOnInit(): void {

    get("https://www.mercadopago.cl/integrations/v1/web-payment-checkout.js", () => {
      //library has been loaded...
    });
  }

  onBuy() {
    this.checkoutService.goCheckOut(this.preference).then(result => {
      // Read result of the Cloud Function.
      this.init_point = result.data.result;
      console.log(this.init_point);
      window.location.href = this.init_point;
    }).catch(error => {
      console.log(error);
      return error
    });
  }

}

/* part of the https://medium.com/@jolvinisland/mercadopago-angular-ddfbe875c6a1 article */
