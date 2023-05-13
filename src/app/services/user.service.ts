import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { unset } from 'lodash-es';

@Injectable({
  providedIn: 'root'
})
export class UserService {

constructor(private afd: AngularFireDatabase) { }

  addUser(user: User){
    unset(user, 'data.password');
    this.afd.list('users').push(user.getData())
  }

  getAddressUser(email: string){
    return this.afd.list<User>('users', ref => ref.orderByChild('email').equalTo(email)).valueChanges();
  }

}
