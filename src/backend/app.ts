import 'dotenv/config'
import express from "express";
import * as auth from "./auth";
import { Cart, Sku } from "./models";
import { AuthRequest } from "./types";
import { presentCartItems } from "./presenters/cart";

export const setupApp = () => {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static("public"));
  app.use((req, res, next) => {
    console.log(
      `[request ${new Date().toISOString()}] ${req.method}: ${req.url}`,
      {
        ...(req.body && { body: req.body }),
        ...(req.params && { params: req.params }),
        ...(req.query && { query: req.query }),
      }
    );
    next();
  });

  app.use(auth.middleware);

  // Cart Endpoints
  app.get("/cart", (req: AuthRequest, res) => {
    let cart: Cart;
    // todo add persistence fetching of existing cart
    // @ts-ignore
    if (!cart) {
      // with middleware, we can assume req.user is present
      cart = new Cart(req.user);
    }
    res.send({
      cart: cart.id,
      items: presentCartItems(cart.items),
      totals: cart.totals,
    });
  });

  app.post("/cart/add-items", (req: AuthRequest, res) => {
    // todo add persistence fetching of existing cart
    // @ts-ignore
    const cart = new Cart(req.user);
    const { items } = req.body;
    const errors = []

    // todo add validation of items
    /* Start Placeholder Sku */
    const Skus = []
    for(let item of Object.values(items)) {
      const { sku: { skuCode, name, price, salePrice }, quantity } = item as any
      const sku = new Sku(skuCode, name, price, quantity + 1, "finite", "", undefined, price * 0.6, (salePrice ?? price * 0.85))
      Skus.push(sku)
    }
    /* End Placeholder Sku */

    for (const item of Object.values(items)) {
      const sku = Skus.find(sku => sku.skuCode === (item as any).sku.skuCode) // todo replace with persistence fetching of sku
      if(!sku) {
        errors.push(`sku ${(item as any).sku.skuCode} not found`)
        continue
      }
      cart.addSku(sku)
      cart.updateQuantity(sku.id, (item as any).quantity)
    }

    res.send({cart: {
      cart: cart.id,
      items: presentCartItems(cart.items),
      totals: cart.totals,
    }, errors});
  });

  return app;
};

export default {
  setupApp,
};
