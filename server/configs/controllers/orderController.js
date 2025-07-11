

//Place order via COD: /api/order/cod
import stripe from "stripe";
import User from "../models/User.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";export const placeOrderCOD = async (req, res) => {
  try {
    console.log("Order route hit");

    const userId = req.user._id; // ✅ Secure way (from middleware)
    const { items, address } = req.body;

    console.log("userId:", userId);
    console.log("items:", items);
    console.log("address:", address);

    if (!address || !items || items.length === 0) {
      return res.json({ success: false, message: "Missing Details" });
    }

    let amount = 0;
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.json({ success: false, message: "Product not found" });
      }
      amount += product.price * item.quantity;
    }

    amount += Math.floor(amount * 0.02); // 2% tax

    await Order.create({
      userId,
      items,
      amount,
      address,
      paymentType: 'COD',
    });

    return res.json({ success: true, message: "Order Placed" });
  } catch (err) {
    console.error("Error placing order:", err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};


//Get orders by User ID: /api/order/user

    export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user._id; // ✅ from middleware

    const orders = await Order.find({
      userId,
      $or: [{ paymentType: "COD" }, { isPaid: true }]
    })
      .populate("items.product address")
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};


// GET ALL ORDERS (FOR SELLER): /api/order/seller

// GET ALL ORDERS (FOR SELLER): /api/order/seller

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      $or: [{ paymentType: "COD" }, { isPaid: true }]
    })
      .populate("items.product address")
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (err) {
    res.json({ success: false, message: err.message });
  }
};

export const placeOrderStripe = async (req, res) => {
  try {
    console.log("Order route hit");

    const userId = req.user._id;
    const { items, address } = req.body;
    const { origin } = req.headers;

    if (!address || !items || items.length === 0) {
      return res.json({ success: false, message: "Missing Details" });
    }

    let productData = [];
    let amount = 0;

    for (const item of items) {
      const product = await Product.findById(item.product);

      if (!product) {
        return res.json({ success: false, message: "Product not found" });
      }

      amount += product.price * item.quantity;

      productData.push({
        name: product.name,
        price: product.offerPrice,
        quantity: item.quantity,
      });
    }

    amount += Math.floor(amount * 0.02); // Add 2% tax

    const order = await Order.create({
      userId,
      items,
      amount,
      address,
      paymentType: "Online",
    });

    // Stripe
    const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);

    const line_items = productData.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
        },
        // Correct tax & cents conversion (Stripe expects cents!)
        unit_amount: Math.round(item.price * 1.02 * 100),
      },
      quantity: item.quantity,
    }));

    const session = await stripeInstance.checkout.sessions.create({
      line_items,
      mode: "payment",
      success_url: `${origin}/loader?next=my-orders`,
      cancel_url: `${origin}/cart`,
      metadata: {
        orderId: order._id.toString(),
        userId,
      },
    });

    return res.json({ success: true, url: session.url });
  } catch (err) {
    console.error("Stripe order error →", err);
    res.status(500).json({ success: false, message: "Stripe Checkout Failed" });
  }
};
export const stripeWebhooks = async (request, response) => {
  // Stripe Gateway Initialize
  const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);

  const sig = request.headers["stripe-signature"];
  let event;

  try {
    event = stripeInstance.webhooks.constructEvent(
      request.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    return response.status(400).send(`Webhook Error: ${error.message}`);
  }

  //Handel the event 
  switch (event.type) {
  case "payment_intent.succeeded": {
    const paymentIntent = event.data.object;
    const paymentIntentId = paymentIntent.id;

    // Get Stripe Session Metadata
    const session = await stripeInstance.checkout.sessions.list({
      payment_intent: paymentIntentId,
    });

    const { orderId, userId } = session.data[0].metadata;

    // Mark payment as paid in DB
    await Order.findByIdAndUpdate(orderId, { isPaid: true });

    // Clear user's cart
    await User.findByIdAndUpdate(userId, { cartItems: {} });

    break;
  }
  case "payment_intent.payment_failed": {
    const paymentIntent = event.data.object;
    const paymentIntentId = paymentIntent.id;

    // Get Stripe Session Metadata
    const session = await stripeInstance.checkout.sessions.list({
      payment_intent: paymentIntentId,
    });

    const { orderId } = session.data[0].metadata;
    await Order.findByIdAndDelete(orderId);

    break;

  }
  default:
    console.log(`Unhandled event type ${event.type}`);
    break;
}
res.json({ received: true });

};
