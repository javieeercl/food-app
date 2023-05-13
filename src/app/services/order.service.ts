import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Injectable } from '@angular/core';
import { Order } from '../models/order';
import * as moment from 'moment';
import { forEach } from 'lodash-es';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private _order: Order;

constructor(private fdb: AngularFireDatabase) {
  this.clearOrder();
}

  get order() {
    return this._order;
  }

  numProducts() {
    return this._order.numProducts();
  }

  totalOrder() {
    return this._order.totalOrder();
  }

  clearOrder() {
    this._order = new Order({});
  }

  convertOrder(){
    const finalOrder = {
      "products": [],
      "date": moment().format('ll'),
      "address": this._order.address,
      "user": this._order.user,
      "priceOrder": this.totalOrder()
    }
    forEach(this._order.productsOrder, product => {
      const finalProduct = {
        "name": product.name,
        "priceFinal": product.totalPrice() * product.quantity,
        "extras": product.getExtras(),
        "quantity": product.quantity
      }

      finalOrder.products.push(finalProduct);
    })
    return finalOrder;
  }

  createOrder(){
    return this.fdb.list('orders').push(this.convertOrder());
  }

}
