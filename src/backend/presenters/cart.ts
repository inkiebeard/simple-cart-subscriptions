import { ICartItem } from "../models/Cart";

export interface PCartItem {
  quantity: number;
  sku: {
    price: number;
    name: string;
    description: string;
    images: string[];
    salePrice?: number;
    skuCode: string;
  };
}

export const presentCartItems = (items: { [skuId: string]: ICartItem }) => {
  const output: { [skuId: string]: PCartItem } = {};
  Object.keys(items).map((skuId) => {
    const item = items[skuId];
    output[skuId] = {
      sku: {
        skuCode: item.sku.skuCode,
        price: item.sku.price,
        name: item.sku.name,
        description: item.sku.description,
        images: item.sku.images ?? [],
        salePrice: item.sku.salePrice,
      },
      quantity: item.quantity,
    };
  });
  return output;
};
