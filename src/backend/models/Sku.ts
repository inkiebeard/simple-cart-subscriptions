import {v4 as uuid} from "uuid";

export interface ISku {
  id: string; // uuid
  skuCode: string;
  name: string;
  description: string;
  image: string; // url
  price: number;
  cost?: number;
  salePrice?: number;
  currency?: string;
  inventory: {
    type: "finite" | "infinite";
    value?: number;
  }
  created: Date;
  updated: Date;
  metadata: {
    [key: string]: any;
  }
}

class Sku implements ISku {
  id: string;
  skuCode: string;
  name: string;
  description: string;
  image: string;
  price: number;
  cost?: number | undefined;
  salePrice?: number | undefined;
  currency?: string | undefined;
  inventory: { type: "finite" | "infinite"; value?: number | undefined; };
  created: Date;
  updated: Date;
  metadata: { [key: string]: any; };

  constructor(skuCode: string, name: string, price: number, inventory: number, inventoryType?: "finite" | "infinite", description?: string, image?: string,  cost?: number | undefined, salePrice?: number | undefined, currency?: string | undefined, metadata?: { [key: string]: any; }) {
    this.id = uuid();
    this.skuCode = skuCode;
    this.name = name;
    this.description = description || "";
    this.image = image || "";
    this.price = price;
    this.cost = cost;
    this.salePrice = salePrice;
    this.currency = currency;
    this.inventory = {
      type: inventoryType || "finite",
      value: inventory
    };
    this.created = new Date();
    this.updated = new Date();
    this.metadata = metadata || {};
  }
}

export default Sku;