import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Injectable } from '@angular/core';
import { Order } from '../models/order';
import * as moment from 'moment';
import { forEach } from 'lodash-es';
import { getDatabase, ref, push } from "firebase/database";

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

  isOrderAllowed() {
    const now = moment();
    const start = moment('00:00:01', 'HH:mm:ss');
    const end = moment('11:59:59', 'HH:mm:ss');

    return !now.isBetween(start, end);
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
      "date": moment().format('ll'), // sólo la fecha
      "time": moment().format('LT'), // hora de la compra
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

  createHistOrder(order: any, userId: string) {
    const db = getDatabase();

    // Get the current month and year
    const monthYear = moment().format('MMYYYY');

    // Include the month and year in the reference path
    const histOrdersRef = ref(db, `histOrder/${userId}/${monthYear}`);

    return push(histOrdersRef, order);
  }

  createOrder() {
    const db = this.fdb.database.ref();

    // Get the current month and year
    const monthYear = moment().format('MMYYYY');

    // Include the month and year in the reference path
    const orderRef = db.child(`orders/${monthYear}`);

    // Generate a new unique ID for the order
    const newOrderId = orderRef.push().key;

    // Almacenar la orden en la referencia adecuada
    return orderRef.child(newOrderId).set(this.convertOrder());
  }



}
