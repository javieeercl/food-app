import { IProduct } from './../interfaces/iproduct';
import { set, get, forEach } from 'lodash-es'

export class Product implements IProduct {

  constructor(data: any){
    set(this, 'data', data);
  }

  get price(): any {
    return get(this, 'data.price');
  }
  get extras(): any {
    return get(this, 'data.extras');
  }
  get name(): any {
    return get(this, 'data.name');
  }
  get img(): any {
    return get(this, 'data.img');
  }
  get idCategory(): any {
    return get(this, 'data.idCategory');
  }
  get quantity(): any {
    return get(this, 'data.quantity');
  }
  set quantity(value: number){
    set(this, 'data.quantity', value);
  }
  get showDetail(): any {
    return get(this, 'data.showDetail');
  }
  set showDetail(value: boolean){
    set(this, 'data.showDetail', value);
  }

  getExtras(){
    const extras: any = [];

    forEach(this.extras, extra => {
      const products = extra.products;
      forEach(products, product => {
        if(product.optionSelected){
          extras.push(
            {
              "name": product.name,
              "selected": product.optionSelected.name
            }
          );
        } else if (product.options[0].activate){
          extras.push(
            {
              "name": product.name
            }
          );
        }
      });
    });
    return extras;
  }

  totalPrice(){
    let total = this.price;
    forEach(this.extras, extra => {
      const products = extra.products;
      forEach(products, product => {
        if(product.optionSelected){
          total += product.optionSelected.price;
        } else if (product.options[0].activate) {
          total += product.options[0].price;
        }
      });
    });
    return total;
  }
}
