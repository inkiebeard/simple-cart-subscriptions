export type Cart = {
  items: {
    [skuId: string]: {
      quantity: number,
      price: number,
      name: string,
      description: string,
      images: string[],
      salePrice?: number,
    }
  }
}

export interface SCSLibrary {
  cart: Cart,
  init: () => void,
  addToCart: (skuId: string) => void,
  removeFromCart: (skuId: string) => void,
  updateCart: () => void
}