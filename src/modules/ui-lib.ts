import { Cart } from "../types";

class SCSCart {
  cart: Cart;

  constructor() {
    // load cart from local storage first for type safety
    const savedCart = localStorage.getItem("cart");
    this.cart = savedCart ? JSON.parse(savedCart) : {};

    // check for singleton
    if ((window as any).SCSCart) {
      return (window as any).SCSCart;
    }

    // Expose SCSCart to the global scope
    (window as any).SCSCart = SCSCart;
    // When the DOM is ready, initialize CartLib
    document.addEventListener("DOMContentLoaded", () => {
      const cart = new (window as any).SCSCart();
      cart.init();
    });
  }

  init() {
    const elements = document.querySelectorAll("[data-scs-sku-id]");
    elements.forEach((el: Element) => {
      const skuId = el.getAttribute("data-scs-sku-id");
      if (!skuId) return;

      const qtyInput = document.createElement("input");
      qtyInput.type = "number";
      qtyInput.min = "0";
      qtyInput.step = "1";
      qtyInput.value = (this.cart[skuId].quantity ?? 1).toString();
      el.appendChild(qtyInput);

      const addButton = document.createElement("button");
      addButton.innerText = "Add to Cart";
      addButton.onclick = () => {
        const qty = parseInt(qtyInput.value, 10);
        this.addToCart(skuId, isNaN(qty) ? 0 : qty);
      };
      el.appendChild(addButton);

      const removeButton = document.createElement("button");
      removeButton.innerText = "Remove from Cart";
      removeButton.onclick = () => {
        const qty = parseInt(qtyInput.value, 10);
        this.removeFromCart(skuId, isNaN(qty) ? 0 : qty);
      };
      el.appendChild(removeButton);
    });
  }

  addToCart(skuId: string, quantity: number) {
    if (!this.cart[skuId]) {
      this.cart[skuId].quantity = 0;
    }
    this.cart[skuId].quantity += quantity;
    this.updateCart();
  }

  removeFromCart(skuId: string, quantity: number) {
    if (this.cart[skuId]) {
      this.cart[skuId].quantity -= quantity;
      if (this.cart[skuId].quantity <= 0) {
        delete this.cart[skuId];
      }
      this.updateCart();
    }
  }

  updateCart() {
    localStorage.setItem("cart", JSON.stringify(this.cart));
  }
}


export default SCSCart;
