import Sku from "./Sku";
import Tax from "./Tax";
import { IUser } from "./User";
import { v4 as uuid } from "uuid";

export interface ISubscription {
  id: string;
  user: IUser;
  frequency: "custom" | "monthly" | "yearly";
  created: Date;
  updated: Date;
  items: Sku[];
  totals: {
    subtotal: number;
    taxes: number;
    shipping: number;
    total: number;
  }
  metadata: {
    [key: string]: any;
  }
}

class Subscription implements ISubscription {
  id: string;
  user: IUser;
  items: Sku[];
  taxes?: Tax[] | undefined;
  frequency: "custom" | "monthly" | "yearly";
  created: Date;
  updated: Date;
  metadata: { [key: string]: any; };

  constructor(user: IUser, frequency: "custom" | "monthly" | "yearly", items: Sku[], metadata?: { [key: string]: any; }) {
    this.id = uuid();
    this.user = user;
    this.items = items;
    this.frequency = frequency;
    this.created = new Date();
    this.updated = new Date();
    this.metadata = metadata || {};
  }

  get totals() {
    const subtotal = this.items.reduce((acc, item) => {
      return acc + item.price;
    }, 0);
    const taxes = this.taxes?.reduce((acc, tax) => {
      return acc + tax.rate;
    }, 0) ?? 0;
    const total = subtotal + taxes;

    return {
      total,
      subtotal,
      taxes,
      shipping: this.metadata.shipping ?? 0
    }
  }

}

export default Subscription;