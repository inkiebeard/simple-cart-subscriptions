import def from "ajv/dist/vocabularies/discriminator";
import Sku, { ISku } from "./Sku";
import Tax, { ITax } from "./Tax";
import { IUser } from "./User";
import {v4 as uuid} from "uuid";

export interface ICart {
  id: string;
  items: ISku[];
  taxes?: ITax[];
  user: IUser;
  created: Date;
  updated: Date;
  totals: {
    subtotal: number;
    tax: number;
    shipping: number;
    total: number;
  }
  metadata?: {
    [key: string]: any;
  }
  addSku(sku: Sku): void;
  removeSku(skuId: string): void;
  addShipping(value: number, provider: string, service?: string, tracking?: string): void;
  addTax(tax: Tax): void;
  removeTax(taxId: string): void;
  addMetadata(key: string, value: any): void;
  removeMetadata(key: string): void;
  updateMetadata(key: string, value: any): void;
  updateShipping(args: {value?: number, provider?: string, service?: string, tracking?: string}): void;
}

class Cart implements ICart {
  id: string;
  items: Sku[];
  taxes?: Tax[] | undefined;
  user: IUser;
  created: Date;
  updated: Date;
  metadata?: { [key: string]: any; };
  constructor(userId: string, items?: Sku[], taxes?: Tax[], metadata?: { [key: string]: any; }) {
    this.id = uuid();
    this.items = items ?? [];
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
        avatar: ""
      },
      hash: "",
      salt: ""
    };
    this.created = new Date();
    this.updated = new Date();
  }
  addMetadata(key: string, value: any): void {
    if (!this.metadata) this.metadata = {};
    if (this.metadata[key]) throw new Error("Metadata already exists.");
    this.metadata = {
      ...this.metadata,
      [key]: value
    }
  }
  removeMetadata(key: string): void {
    delete this.metadata?.[key];
  }
  updateMetadata(key: string, value: any): void {
    this.metadata = {
      ...this.metadata,
      [key]: value
    }
  }
  updateShipping({
    value,
    provider,
    service,
    tracking
  }: { value?: number, provider?: string, service?: string, tracking?: string}): void {
    this.metadata = {
      ...this.metadata,
      shipping: {
        ...this.metadata?.shipping,
        ...(value && { value }),
        ...(provider && { provider }),
        ...(service && { service }),
        ...(tracking && { tracking })
      }
    }
  }

  get totals() {
    const subtotal = this.items.reduce((acc, item) => acc + (item.salePrice ?? item.price), 0);
    const tax = this.taxes?.reduce((acc, tax) => acc + tax.rate, 0) ?? 0;
    const shipping = this.metadata?.shipping?.value ?? 0;
    const total = subtotal + tax + shipping;

    return {
      subtotal,
      tax,
      shipping,
      total 
    }
  }

  addSku(sku: Sku) {
    this.items.push(sku);
  }

  removeSku(skuId: string) {
    this.items = this.items.filter((item) => item.id !== skuId);
  }

  addShipping(value: number, provider: string, service?: string, tracking?: string) {
    this.metadata = {
      ...this.metadata,
      shipping: {
        value,
        provider,
        service,
        tracking
      }
    }
  }

  addTax(tax: Tax) {
    this.taxes?.push(tax);
  }

  removeTax(taxId: string) {
    this.taxes = this.taxes?.filter((tax) => tax.id !== taxId);
  }
}

export default Cart;