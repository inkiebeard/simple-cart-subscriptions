import Ajv from "ajv";
import User, { IUser } from "./User";
import Cart, { ICart } from "./Cart";
import Payment, { IPayment } from "./Payment";
import Subscription, { ISubscription } from "./Subscription";
/**
 * must have either a subscription or a cart - handled by validateBilling
 */
export interface IBilling {
  id: string;
  type: "subscription" | "cart";
  cart?: ICart;
  user: IUser;
  subscription?: ISubscription;
  payment: IPayment;
  timestamp: Date;
}

export const schema = {
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "id": {
      "type": "string",
      "format": "uuid"
    },
    "type": {
      "type": "string",
      "oneOf": [
        {
          "const": "subscription"
        },
        {
          "const": "cart"
        }
      ]
    },
    "cart": {
      "type": "string",
      "format": "uuid"
    },
    "user": {
      "type": "string",
      "format": "uuid"
    },
    "subscription": {
      "type": "string",
      "format": "uuid"
    },
    "payment": {
      "type": "string",
      "format": "uuid"
    },
    "timestamp": {
      "type": "string",
      "format": "date-time"
    }
  },
  "required": ["id", "type", "user", "payment", "timestamp"]
}

export const validateBilling = (billing: Billing) => {
  const ajv = new Ajv();
  const validate = ajv.compile(schema);
  const valid = validate(billing);
  if (valid) {
    console.log("Invalid billing: ", validate.errors);
    throw new Error("Invalid billing: " + validate.errors?.join(", "));
  }
  if (billing.type === "subscription" && !billing.subscription) {
    throw new Error("Subscription billing must have a subscription");
  }
  if (billing.type === "cart" && !billing.cart) {
    throw new Error("Cart billing must have a cart");
  }
  return true
}

class Billing implements IBilling {
  cart?: Cart;
  user: User;
  subscription?: Subscription | undefined;
  payment: Payment;
  timestamp: Date;
  id: string;
  type: "subscription" | "cart";
  constructor(billing: IBilling) {
    this.id = billing.id;
    this.type = billing.type;
    this.cart = billing.cart;
    this.user = billing.user;
    this.subscription = billing.subscription;
    this.payment = billing.payment;
    this.timestamp = billing.timestamp || new Date();
  }

  static from(billing: IBilling) {
    return new Billing(billing);
  }

  static fromJSON(json: string) {
    return Billing.from(JSON.parse(json));
  }

  get total() {
    return this.cart?.totals.total || this.subscription?.totals.total;
  }

  toJSON() {
    return JSON.stringify(this);
  }

  static validate(billing: Billing) {
    return validateBilling(billing);
  }
}


export default {
  schema,
  validateBilling,
  Billing
}