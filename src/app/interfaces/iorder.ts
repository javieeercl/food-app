import { Product } from './../models/product';
export interface IOrder {
    productsOrder: Product[],
    address: string,
    user: string,
    addProduct,
    oneMoreProduct,
    oneLessProduct,
    removeProduct,
    numProducts,
    totalOrder
}
