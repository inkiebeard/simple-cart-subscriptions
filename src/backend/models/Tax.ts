import {v4 as uuid} from "uuid";

export interface ITax {
  id: string;
  name: string;
  description: string;
  rate: number;
  rateType: "percentage" | "fixed";
  applyToShipping: boolean;

  created: Date;
  updated: Date;
  metadata: {
    [key: string]: any;
  }
}

class Tax implements ITax {
  id: string;
  name: string;
  description: string;
  rate: number;
  rateType: "percentage" | "fixed";
  applyToShipping: boolean;
  created: Date;
  updated: Date;
  metadata: { [key: string]: any; };
  constructor(name: string, rate: number, rateType: "percentage" | "fixed", applyToShipping: boolean, description?: string, metadata?: { [key: string]: any; }) {
    this.id = uuid();
    this.name = name;
    this.description = description || "";
    this.rate = rate;
    this.rateType = rateType;
    this.applyToShipping = applyToShipping;
    this.created = new Date();
    this.updated = new Date();
    this.metadata = metadata || {};
  }
}

export default Tax;