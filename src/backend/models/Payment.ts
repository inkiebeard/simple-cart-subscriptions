import Address, { IAddress } from "./Address";
import { v4 as uuid } from "uuid";

export interface IPayment {
  id: string;
  type: "stripe" | "paypal" | "bitcoin";
  card?: IStripe;
  paypal?: IPaypal;
  bitcoin?: IBitcoin;
  timestamp: Date;
  value: number;
  address?: IAddress;
}

export interface IStripe {
  id: string;
  card: string;
  profile: string;
}

export interface IPaypal {
  id: string;
  email: string;
}

export interface IBitcoin {
  id: string;
  wallet: string;
}

class Payment implements IPayment {
  id: string;
  type: "stripe" | "paypal" | "bitcoin";
  card?: IStripe | undefined;
  paypal?: IPaypal | undefined;
  bitcoin?: IBitcoin | undefined;
  timestamp: Date;
  value: number;
  address?: Address | undefined;

  constructor(type: "stripe" | "paypal" | "bitcoin", value: number, card?: IStripe | undefined, paypal?: IPaypal | undefined, bitcoin?: IBitcoin | undefined, address?: IAddress | undefined) {
    if (type === "stripe" && !card) throw new Error("Stripe payment requires card information");
    if (type === "paypal" && !paypal) throw new Error("Paypal payment requires paypal information");
    if (type === "bitcoin" && !bitcoin) throw new Error("Bitcoin payment requires bitcoin information");

    this.id = uuid();
    this.type = type;
    switch(type) {
      case "stripe":
        this.card = card;
        break;
      case "paypal":
        this.paypal = paypal;
        break;
      case "bitcoin":
        this.bitcoin = bitcoin;
        break;
      default:
        throw new Error("Invalid payment type");
    }
    
    this.timestamp = new Date();
    this.value = value;
    this.address = address;
  }
}

export default Payment;