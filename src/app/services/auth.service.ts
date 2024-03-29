import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { reject } from 'lodash-es';
import { InteractionService } from './interaction.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _isLogged: boolean

constructor(private afAuth: AngularFireAuth,
            private interaction: InteractionService) {
  this._isLogged = false;

  this.afAuth.authState.subscribe(user => {
    if(user){
      this._isLogged = true;
    }
  })
}

  async currentUserId(): Promise<string> {
    let user = await this.afAuth.currentUser;
    return user ? user.uid : null;
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

  async requestPassword(email: string){
    return await this.afAuth.sendPasswordResetEmail(email)
    .catch((error) => {
      this.interaction.toastError(error);
      throw new Error(error);
    });;
  }

  async passwordReset(password: string, oobCode: string){
    return await this.afAuth.confirmPasswordReset(oobCode, password)
      .catch((error) => {
        this.interaction.toastError(error);
        throw new Error(error);
      });
  }

}
