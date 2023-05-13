import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { reject } from 'lodash-es';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _isLogged: boolean

constructor(private afAuth: AngularFireAuth) {
  this._isLogged = false;

  this.afAuth.authState.subscribe(user => {
    if(user){
      this._isLogged = true;
    }
  })
}

  get isLogged() {
    return this._isLogged;
  }

  set isLogged(value: boolean) {
    this._isLogged = value;
  }

  login(email: string, password: string){
    return this.afAuth.signInWithEmailAndPassword(email, password);
  }

  logout(){
    this.afAuth.signOut();
    this._isLogged = false;
  }

  currentUser(){
    if(this.afAuth.currentUser){
      return this.afAuth.currentUser;
    }
    return null;
  }

  createAccount(email: string, password: string){
    return this.afAuth.isSignInWithEmailLink(email).then(result => {
      if(result){
        return new Promise((resolve, reject) => {
          reject('El usuario ya existe');
        })
      } else {
        return this.afAuth.createUserWithEmailAndPassword(email, password).then(auth => {
          return auth;
        }).catch(error => {
          throw error;
        })
      }
    })
  }

}
