export type Cart = {
  [skuId: string]: {
    quantity: number,
    price: number,
    name: string,
  }
}

export interface SCSLibrary {
  cart: Cart,
  init: () => void,
  addToCart: (skuId: string) => void,
  removeFromCart: (skuId: string) => void,
  updateCart: () => void
}