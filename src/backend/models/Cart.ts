import def from "ajv/dist/vocabularies/discriminator";
import Sku, { ISku } from "./Sku";
import Tax, { ITax } from "./Tax";
import { IUser } from "./User";
import { v4 as uuid } from "uuid";
import { update } from "../utils/metadata";

export interface ICartItem {
  quantity: number;
  sku: ISku;
}
export interface ICart {
  id: string;
  items: {
    [skuid: string]: ICartItem;
  };
  taxes?: ITax[];
  user: IUser;
  created: Date;
  updated: Date;
  totals: {
    subtotal: number;
    tax: number;
    shipping: number;
    total: number;
  };
  metadata: {
    [key: string]: any;
  };
  addSku(sku: Sku): void;
  removeSku(skuId: string): void;
  addShipping(
    value: number,
    provider: string,
    service?: string,
    tracking?: string
  ): void;
  addTax(tax: Tax): void;
  removeTax(taxId: string): void;
  addMetadata(key: string, value: any): void;
  removeMetadata(key: string): void;
  updateMetadata(key: string, value: any): void;
  updateShipping(args: {
    value?: number;
    provider?: string;
    service?: string;
    tracking?: string;
  }): void;
  itemsArray: ICartItem[];
  updateQuantity(skuId: string, quantity: number): void;
  updateSku(skuId: string, qty: number): void;
}

class Cart implements ICart {
  id: string;
  items: {
    [skuid: string]: ICartItem;
  };
  taxes?: Tax[] | undefined;
  user: IUser;
  created: Date;
  updated: Date;
  metadata: { [key: string]: any };
  constructor(
    userId: string,
    items?: {
      [skuid: string]: {
        quantity: number;
        sku: ISku;
      };
    },
    taxes?: Tax[],
    metadata?: { [key: string]: any }
  ) {
    this.id = uuid();
    this.items = items ?? {};
    this.taxes = taxes ?? [];
    this.user = {
      id: userId,
      email: "",
      name: "",
      verified: false,
      created: new Date(),
      updated: new Date(),
      profile: {
        displayName: "",
        avatar: "",
      },
      hash: "",
      salt: "",
    };
    this.created = new Date();
    this.updated = new Date();
    this.metadata = metadata ?? {
      checkInventory: true,
    };
  }
  addMetadata(key: string, value: any): void {
    if (!this.metadata) this.metadata = {};
    if (this.metadata[key]) throw new Error("Metadata already exists.");
    this.metadata = {
      ...this.metadata,
      [key]: value,
    };
  }
  removeMetadata(key: string): void {
    delete this.metadata?.[key];
  }
  updateMetadata(key: string, value: any): void {
    this.metadata = {
      ...this.metadata,
      [key]: value,
    };
  }
  updateShipping({
    value,
    provider,
    service,
    tracking,
  }: {
    value?: number;
    provider?: string;
    service?: string;
    tracking?: string;
  }): void {
    update(this)("shipping", {
      ...this.metadata?.shipping,
      ...(value && { value }),
      ...(provider && { provider }),
      ...(service && { service }),
      ...(tracking && { tracking }),
    });
  }

  get itemsArray() {
    return Object.values(this.items);
  }

  get totals() {
    const subtotal = (this.itemsArray ?? []).reduce(
      (acc, { sku: item, quantity }) => acc + ((item.salePrice ?? item.price) * quantity),
      0
    );
    const tax = this.taxes?.reduce((acc, tax) => acc + tax.rate, 0) ?? 0;
    const shipping = this.metadata?.shipping?.value ?? 0;
    const total = subtotal + tax + shipping;

    return {
      subtotal,
      tax,
      shipping,
      total,
    };
  }

  addSku(sku: Sku) {
    if (this.metadata.checkInventory && !sku.hasInventory)
      throw new Error("Sku does not have inventory.");
    if (this.items[sku.id]) {
      this.items[sku.id].quantity++;
      return;
    }
    this.items[sku.id] = {
      quantity: 1,
      sku,
    };
  }

  removeSku(skuId: string) {
    delete this.items[skuId];
  }

  updateQuantity(skuId: string, quantity: number) {
    if (quantity < 0) throw new Error("Quantity must be greater than 0.");
    if (!this.items[skuId]) throw new Error("Sku must be in the cart to update quantity.");
    if (quantity === 0) {
      this.removeSku(skuId);
      return;
    }
    this.items[skuId].quantity = quantity;
  }

  updateSku(skuId: string, qty: number) {
    this.updateQuantity(skuId, qty);
  }

  addShipping(
    value: number,
    provider: string,
    service?: string,
    tracking?: string
  ) {
    this.metadata = {
      ...this.metadata,
      shipping: {
        value,
        provider,
        service,
        tracking,
      },
    };
  }

  addTax(tax: Tax) {
    this.taxes?.push(tax);
  }

  removeTax(taxId: string) {
    this.taxes = this.taxes?.filter((tax) => tax.id !== taxId);
  }
}

export default Cart;
