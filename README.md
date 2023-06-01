# simple-cart-subscriptions
simple cart &amp; subscriptions library, trying to make as plug and play as possible. Pull the UI library in and you have a cart and subscription system ready to go.

## Installation

```bash
npm install simple-cart-subscriptions
```

## Proposed API Usage

```javascript
import { Cart, Subscription, SKU, Billing } from 'simple-cart-subscriptions/api';

// ID, Name, Price, Inventory
const sku = new SKU('UUID-SKU-ID', 'SKU Name', 51.98, 100);
sku.setCost(25.99); // set cost price
sku.setInventory(50); // set inventory to 50
sku.setSalePrice(sku.price * 0.7); // set sale price to 70% of price

// Add SKU to cart with quantity of 2
const cart = new Cart(User.id);
// Sku ID, Quantity
cart.add(sku.id, 2);

// display cart contents
const { items } = cart.getContents(); // { items: [{ id: 'UUID-SKU-ID', name: 'SKU Name', price: 51.98, quantity: 2 }] }
// display cart totals at checkout
const { shipping, subtotal, tax, total } = cart.getTotals(); // { shipping: 0, subtotal: 103.96, tax: 10.40, total: 114.36 }

const checkoutBilling = new Billing(User.id, cart.id);

// Create a subscription for the cart charged monthly from today's date
// date is optional, defaults to today but can be set to a specified future date
// ID, Cart ID, Interval, Start Date
const subscription = new Subscription(User.id, cart.id, 'monthly', Date.now());

// Create a billing object to charge the user
// User ID, Subscription ID
const subscriptionBilling = new Billing(User.id, subscription.id);
```


## Roadmap

* [x] UI library
  * [x] Cart
  * [ ] Subscription
  * [ ] Checkout
  * [ ] API service
  * [ ] Wishlists
* [ ] API library
  * [ ] Cart
  * [ ] Subscription
  * [ ] SKU
  * [ ] Billing
  * [ ] Wishlists
