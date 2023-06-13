import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { unset } from 'lodash-es';
import { getDatabase, ref, set } from 'firebase/database';

@Injectable({
  providedIn: 'root'
})
export class UserService {

constructor(private afd: AngularFireDatabase) { }

addUser(user: User){
  unset(user, 'data.password');

  // Get the uid from user object (it's already set now)
  const uid = user.uid;

  // Add uid to the user data
  user.data.uid = uid;

  const db = getDatabase();

  // Use set() method to save data under the uid
  set(ref(db, `users/${uid}`), user.getData());
}


  getAddressUser(email: string){
    return this.afd.list<User>('users', ref => ref.orderByChild('email').equalTo(email)).valueChanges();
  }

}
