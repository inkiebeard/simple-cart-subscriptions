import { v4 as uuid } from "uuid";
import { add, remove, updateInPlace } from "../utils/metadata";

export interface ISku {
  id: string; // uuid
  skuCode: string;
  name: string;
  description: string;
  images: string[]; // url
  price: number;
  cost?: number;
  salePrice?: number;
  currency?: string;
  inventory: {
    type: "finite" | "infinite";
    value: number;
  };
  created: Date;
  updated: Date;
  metadata: {
    [key: string]: any;
  };
  addImage(image: string): void;
  removeImage(image: string): void;
  updateInventory(value: number): void;
  update(
    data: ISkuInput
  ): void;
  updateMetadata(metadata: { [key: string]: any }): void;
  addMetadata(key: string, value: any): void;
  removeMetadata(key: string): void;
  addInventory(value: number): void;
  removeInventory(value: number): void;
  hasInventory: boolean;
}

export interface ISkuInput {
  name: string,
  price: number,
  description: string,
  images: string[],
  cost: number,
  salePrice: number,
  currency: string,
  inventory: {
    type: "finite" | "infinite",
    value: number,
  },
  metadata: {[key: string]: any},
  skuCode: string,
}

class Sku implements ISku {
  id: string;
  skuCode: string;
  name: string;
  description: string;
  images: string[];
  price: number;
  cost?: number | undefined;
  salePrice?: number | undefined;
  currency?: string | undefined;
  inventory: { type: "finite" | "infinite"; value: number };
  created: Date;
  updated: Date;
  metadata: { [key: string]: any };

  constructor(
    skuCode: string,
    name: string,
    price: number,
    inventory: number,
    inventoryType?: "finite" | "infinite",
    description?: string,
    image?: string,
    cost?: number | undefined,
    salePrice?: number | undefined,
    currency?: string | undefined,
    metadata?: { [key: string]: any }
  ) {
    this.id = uuid();
    this.skuCode = skuCode;
    this.name = name;
    this.description = description || "";
    this.images = image?.split(",") || [];
    this.price = price;
    this.cost = cost;
    this.salePrice = salePrice;
    this.currency = currency;
    this.inventory = {
      type: inventoryType || "finite",
      value: inventory,
    };
    this.created = new Date();
    this.updated = new Date();
    this.metadata = metadata || {};
  }
  update(
    data: ISkuInput
  ): void {
    Object.keys(data).forEach((key) => {
      if (key === "metadata") {
        this.updateMetadata(data.metadata);
      } else {
        (this as any)[key] = (data as any)[key];
      }
    });
  }

  addImage(image: string) {
    this.images.push(image);
  }

  removeImage(image: string) {
    const index = this.images.findIndex((img) => img === image);
    if (index > -1) {
      this.images.splice(index, 1);
    }
  }

  updateInventory(value: number, type?: "finite" | "infinite") {
    if (type) {
      this.inventory.type = type;
    }
    this.inventory.value = value;
  }

  addInventory(value: number) {
    if (this.inventory.type === "infinite") return;
    this.inventory.value = (this.inventory.value ?? 0) + value;
  }

  removeInventory(value: number) {
    if (this.inventory.type === "infinite") return;
    this.inventory.value = (this.inventory.value ?? 0) - value;
  }

  updateMetadata(metadata: { [key: string]: any }): void {
    updateInPlace(this)(metadata);
  }
  addMetadata(key: string, value: any): void {
    add(this)(key, value);
  }
  removeMetadata(key: string): void {
    remove(this)(key);
  }

  get hasInventory() {
    return this.inventory.type === "infinite" || this.inventory.value > 0;
  }
}

export default Sku;
