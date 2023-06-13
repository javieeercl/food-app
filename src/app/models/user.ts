import { IUser } from './../interfaces/iuser';
import { set, get } from 'lodash-es'

export class User implements IUser {
  data: any;
  constructor(data: any){
    set(this, 'data', data);
  }

  getData(){
    return get(this, 'data');
  }

  get uid(): any {
    return get(this, 'data.uid');
  }
  set uid(value: string) {
    set(this, 'data.uid', value);
  }

  get email(): any {
    return get(this, 'data.email');
  }
  set email(value: string) {
    set(this, 'data.email', value);
  }
  get password(): any {
    return get(this, 'data.password');
  }
  set password(value: string) {
    set(this, 'data.password', value);
  }
  get address(): any {
    return get(this, 'data.address');
  }
  set address(value: string) {
    set(this, 'data.address', value);
  }
}
