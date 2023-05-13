import { Product } from './product';
import { IOrder } from './../interfaces/iorder';

import { set, get, find, cloneDeep, unset, isEqual, remove, forEach } from 'lodash-es';

export class Order implements IOrder {

    constructor(data) {
        set(this, 'data', data);
        this.productsOrder = [];
    }

    get productsOrder(): any {
        return get(this, 'data.productsOrder');
    }

    set productsOrder(value: Product[]) {
        set(this, 'data.productsOrder', value);
    }


    get address(): any {
        return get(this, 'data.address');
    }

    set address(value: string) {
        set(this, 'data.address', value);
    }

    get user(): any {
      return get(this, 'data.user');
  }

  set user(value: string) {
      set(this, 'data.user', value);
  }

    addProduct(product: Product) {

        console.log("product ", product);
        const productFound: Product = find(this.productsOrder, p => {
            let copy = cloneDeep(p);
            unset(copy, 'data.quantity');
            return isEqual(copy, product);
        })

        if (productFound) {
            productFound.quantity++;
        } else {
            product.quantity = 1;
            this.productsOrder.push(product);
        }


    }


    oneMoreProduct(product: Product) {
        product.quantity++;
    }

    oneLessProduct(product: Product) {
        product.quantity--;
        if (product.quantity == 0) {
            this.removeProduct(product);
        }
    }

    removeProduct(product: Product) {
        remove(this.productsOrder, p => {
            return isEqual(p, product);
        })
    }

    numProducts() {
        return this.productsOrder.length;
    }

    totalOrder() {

        let total = 0;

        forEach(this.productsOrder, p => {
            total += p.totalPrice() * p.quantity
        })

        return total.toFixed(2);
    }


}
