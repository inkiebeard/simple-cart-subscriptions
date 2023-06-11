import Cart from "./Cart";
import Sku from "./Sku";
import User from "./User";
import Tax from "./Tax";
import { v4 as uuid } from "uuid";

describe("Full Cart Functionality", () => {
  let user: User, sku: Sku, tax: Tax;

  describe("User", () => {
    it("should create a user", () => {
      user = new User("john@fake.com", "John Doe");
      expect(user).toEqual({
        id: expect.any(String),
        email: "john@fake.com",
        name: "John Doe",
        verified: false,
        created: expect.any(Date),
        updated: expect.any(Date),
        profile: {
          displayName: "",
          avatar: "",
        },
        hash: "",
        salt: "",
      });
    });
  });

  describe("Sku", () => {
    it("should create a sku", () => {
      sku = new Sku(
        "sku-1",
        "Sku 1",
        10.5,
        10,
        "finite",
        "a test sku",
        "https://fake.url/to/image/sku_1.jpg,https://fake.url/to/image/sku_2.jpg",
        6.3,
        9.0,
        "AU"
      );

      expect(sku).toEqual({
        id: expect.any(String),
        skuCode: "sku-1",
        name: "Sku 1",
        price: 10.5,
        created: expect.any(Date),
        updated: expect.any(Date),
        description: "a test sku",
        images: [
          "https://fake.url/to/image/sku_1.jpg",
          "https://fake.url/to/image/sku_2.jpg",
        ],
        cost: 6.3,
        salePrice: 9.0,
        currency: "AU",
        inventory: {
          type: "finite",
          value: 10,
        },
        metadata: {},
      });
    });

    it("should add an image", () => {
      sku.addImage("https://fake.url/to/image/sku_3.jpg");
      expect(sku.images).toEqual([
        "https://fake.url/to/image/sku_1.jpg",
        "https://fake.url/to/image/sku_2.jpg",
        "https://fake.url/to/image/sku_3.jpg",
      ]);
    });

    it("should update the sku", () => {
      sku.update({
        name: "Sku 1 Updated",
        price: 11.5,
        description: "an updated test sku",
        images: ["https://fake.url/to/image/sku_1_updated.jpg"],
        cost: 7.3,
        salePrice: 10.0,
        currency: "US",
        inventory: {
          type: "finite",
          value: 20,
        },
        metadata: {
          key: "value",
        },
        skuCode: "sku-fake-123",
      });

      expect(sku).toEqual({
        id: expect.any(String),
        skuCode: "sku-fake-123",
        name: "Sku 1 Updated",
        price: 11.5,
        created: expect.any(Date),
        updated: expect.any(Date),
        description: "an updated test sku",
        images: ["https://fake.url/to/image/sku_1_updated.jpg"],
        cost: 7.3,
        salePrice: 10.0,
        currency: "US",
        inventory: {
          type: "finite",
          value: 20,
        },
        metadata: {
          key: "value",
        },
      });
      expect(sku.hasInventory).toEqual(true);
    });

    it("should remove an image", () => {
      sku.removeImage("https://fake.url/to/image/sku_1_updated.jpg");
      expect(sku.images).toEqual([]);
    });

    it("add inventory", () => {
      sku.addInventory(10);
      expect(sku.inventory.value).toEqual(30);
    });

    it("remove inventory", () => {
      sku.removeInventory(10);
      expect(sku.inventory.value).toEqual(20);
    });
  });

  describe("Cart", () => {
    it("should add a sku", () => {
      const cart = new Cart(user.id);

      cart.addSku(sku);

      expect(cart.items).toEqual({ [sku.id]: { quantity: 1, sku } });
      expect(cart.totals.subtotal).toEqual(sku.salePrice);
    });

    it("should change quantity when adding same sku twice", () => {
      const cart = new Cart(user.id);

      cart.addSku(sku);
      cart.addSku(sku);

      expect(cart.items).toEqual({ [sku.id]: { quantity: 2, sku } });
      expect(cart.totals.subtotal).toEqual((sku.salePrice ?? sku.price) * 2); // sku sale price is always defined in test context ಠ_ಠ
    });

    it("should update a sku quantity", () => {
      const cart = new Cart(user.id);

      cart.addSku(sku);
      cart.updateQuantity(sku.id, 5);

      expect(cart.items).toEqual({ [sku.id]: { quantity: 5, sku } });
      expect(cart.totals.subtotal).toEqual((sku.salePrice ?? sku.price) * 5); // sku sale price is always defined in test context ಠ_ಠ

      // test alias
      cart.updateSku(sku.id, 3);

      expect(cart.items).toEqual({ [sku.id]: { quantity: 3, sku } });
      expect(cart.totals.subtotal).toEqual((sku.salePrice ?? sku.price) * 3); // sku sale price is always defined in test context ಠ_ಠ
    });
  });
});
