import { Injectable } from '@angular/core';
import firebase from "firebase/compat/app"
import 'firebase/compat/functions'

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

constructor() { }

goCheckOut(products) {
  // const checkO = firebase
  const CheckOut = firebase.functions().httpsCallable('checkout');
  return  CheckOut(products);
}

}
