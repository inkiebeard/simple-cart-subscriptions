import request from "supertest";
import { setupApp } from "./app"; // Update this with the actual path to your app file
import { Cart, User } from "./models";
import { AuthRequest } from "./types";

// Mock the middleware to allow us to send a fake user
jest.mock("./auth", () => ({
  middleware: (req: AuthRequest, res: any, next: () => void) => {
    req.user = new User("john@fake.com", "test user"); // Make sure to replace 'test' with appropriate data for your User model
    next();
  },
}));

describe("Cart Endpoint", () => {
  let app: any;
  beforeEach(() => {
    app = setupApp();
  });

  it("should return a cart for an authenticated user", async () => {
    const response = await request(app).get("/cart");

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      cart: expect.any(String),
      items: {},
      totals: {
        subtotal: 0,
        tax: 0,
        total: 0,
      },
    });
  });

  it("should add items to cart", async () => {
    const items = {
      "sku-fake-123": {
        sku: {
          skuCode: "sku-fake-123",
          name: "Fake Item",
          price: 100,
          salePrice: 80,
        },
        quantity: 1,
      },
    };
    const presentedItems = {
      sku: {
        skuCode: "sku-fake-123",
        name: "Fake Item",
        price: 100,
        salePrice: 80,
        description: "",
        images: [],
      },
      quantity: 1,
    }


    const response = await request(app)
      .post("/cart/add-items")
      .send({
        items,
      });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("cart");
    expect(response.body).toHaveProperty("errors");
    expect(response.body.errors).toHaveLength(0);
    expect(response.body.cart).toHaveProperty("items");
    expect(Object.values(response.body.cart.items)[0]).toMatchObject(presentedItems)

    expect(response.body.cart).toHaveProperty("totals");
    expect(response.body.cart.totals).toMatchObject({
      subtotal: presentedItems.sku.salePrice * presentedItems.quantity,
      tax: 0,
      total: presentedItems.sku.salePrice * presentedItems.quantity,
    });
  });
});
