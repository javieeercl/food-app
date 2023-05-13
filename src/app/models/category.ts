import { ICategory } from "../interfaces/icategory";
import { set, get } from 'lodash-es'

export class Category implements ICategory{
  constructor(data: any){
    set(this, 'data', data);
  }

  get id(): any {
    return get(this, 'data.id')
  }
  get name(): any {
    return get(this, 'data.name')
  }
  get img(): any {
    return get(this, 'data.img')
  }
}
