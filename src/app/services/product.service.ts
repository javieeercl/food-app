import { IProduct } from './../interfaces/iproduct';
import { ICategory } from './../interfaces/icategory';
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

constructor(private fdb: AngularFireDatabase) {

}

getProducts(idCategory: number) {
  return this.fdb.list<IProduct>('products', ref => ref.orderByChild('idCategory').equalTo(idCategory)).valueChanges();
}

getCategories(){
  return this.fdb.list<ICategory>('categories').valueChanges();
}

}
