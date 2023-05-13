export interface IProduct {
  name: string;
  img: string;
  price: number;
  idCategory: number;
  quantity: number;
  showDetail: boolean;
  extras: any[];
  getExtras(): void,
  totalPrice(): void
}

