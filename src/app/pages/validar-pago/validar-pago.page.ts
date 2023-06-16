import { Component } from '@angular/core';
import { OrderService } from 'src/app/services/order.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-validar-pago',
  templateUrl: 'validar-pago.page.html',
  styleUrls: ['validar-pago.page.scss'],
})
export class ValidarPagoPage {

  constructor(private orderService: OrderService,private toastController: ToastController) {}

  getOrderProducts() {
    return this.orderService.order.productsOrder;
  }

  async validatePayment() {
    const order = this.orderService.order;

    if (order.productsOrder.length > 0) {
      // La orden tiene productos
      await this.showToast('El pago no fue validado correctamente');
    } else {
      // La orden no tiene productos
      await this.showToast('El pago fue validado correctamente');
    }
  }

  async showToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'bottom'
    });

    toast.present();
  }
}  