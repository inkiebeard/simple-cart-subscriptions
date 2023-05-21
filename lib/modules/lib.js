"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartLib = void 0;
var CartLib;
(function (CartLib) {
    class SCSCart {
        constructor() {
            // load cart from local storage first for type safety
            const savedCart = localStorage.getItem("cart");
            this.cart = savedCart ? JSON.parse(savedCart) : {};
            // check for singleton
            if (window.SCSCart) {
                return window.SCSCart;
            }
            // Expose SCSCart to the global scope
            window.SCSCart = SCSCart;
            // When the DOM is ready, initialize CartLib
            document.addEventListener("DOMContentLoaded", function () {
                const cart = new window.SCSCart();
                cart.init();
            });
        }
        init() {
            const elements = document.querySelectorAll("[data-scs-sku-id]");
            elements.forEach((el) => {
                var _a;
                const skuId = el.getAttribute("data-scs-sku-id");
                if (!skuId)
                    return;
                const qtyInput = document.createElement("input");
                qtyInput.type = "number";
                qtyInput.min = "0";
                qtyInput.step = "1";
                qtyInput.value = ((_a = this.cart[skuId].quantity) !== null && _a !== void 0 ? _a : 1).toString();
                el.appendChild(qtyInput);
                const addButton = document.createElement("button");
                addButton.innerText = "Add to Cart";
                addButton.onclick = () => {
                    const qty = parseInt(qtyInput.value);
                    this.addToCart(skuId, isNaN(qty) ? 0 : qty);
                };
                el.appendChild(addButton);
                const removeButton = document.createElement("button");
                removeButton.innerText = "Remove from Cart";
                removeButton.onclick = () => {
                    const qty = parseInt(qtyInput.value);
                    this.removeFromCart(skuId, isNaN(qty) ? 0 : qty);
                };
                el.appendChild(removeButton);
            });
        }
        addToCart(skuId, quantity) {
            if (!this.cart[skuId]) {
                this.cart[skuId].quantity = 0;
            }
            this.cart[skuId].quantity += quantity;
            this.updateCart();
        }
        removeFromCart(skuId, quantity) {
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
})(CartLib = exports.CartLib || (exports.CartLib = {}));
exports.default = CartLib;
