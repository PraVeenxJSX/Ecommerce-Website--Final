import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

const Cart = () => {
  const {
    cartItems,
    updateCartQty,
    removeFromCart,
  } = useCart();

  const navigate = useNavigate();

  const totalItems = cartItems.reduce(
    (acc, item) => acc + item.qty,
    0
  );

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.qty * item.price,
    0
  );

  if (cartItems.length === 0) {
    return (
      <div className="p-10 text-center">
        <h2 className="text-2xl font-bold mb-4">
          Your cart is empty 🛒
        </h2>
        <Link to="/" className="text-blue-600 hover:underline">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* LEFT */}
      <div className="md:col-span-2 space-y-6">
        <h1 className="text-3xl font-bold">Shopping Cart</h1>

        {cartItems.map((item) => (
          <div
            key={item._id}
            className="flex gap-6 border rounded-lg p-4"
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-28 h-28 object-cover rounded"
            />

            <div className="flex-1">
              <Link
                to={`/product/${item._id}`}
                className="font-semibold text-lg hover:underline"
              >
                {item.name}
              </Link>

              <p className="text-gray-600">₹{item.price}</p>

              {/* QTY CONTROLS */}
              <div className="flex items-center gap-3 mt-3">
                <button
                  onClick={() =>
                    updateCartQty(item._id, item.qty - 1)
                  }
                  disabled={item.qty === 1}
                  className="px-3 py-1 border rounded"
                >
                  −
                </button>

                <span className="font-medium">{item.qty}</span>

                <button
                  onClick={() =>
                    updateCartQty(item._id, item.qty + 1)
                  }
                  disabled={item.qty === item.countInStock}
                  className="px-3 py-1 border rounded"
                >
                  +
                </button>
              </div>

              <button
                onClick={() => removeFromCart(item._id)}
                className="mt-3 text-red-600 hover:underline"
              >
                Remove
              </button>
            </div>

            <div className="font-semibold text-lg">
              ₹{item.price * item.qty}
            </div>
          </div>
        ))}
      </div>

      {/* RIGHT */}
      <div className="border rounded-lg p-6 h-fit">
        <h2 className="text-2xl font-bold mb-4">
          Order Summary
        </h2>

        <div className="flex justify-between mb-2">
          <span>Total Items</span>
          <span>{totalItems}</span>
        </div>

        <div className="flex justify-between mb-4">
          <span>Total Price</span>
          <span className="font-semibold">
            ₹{totalPrice.toFixed(2)}
          </span>
        </div>

        <button
          onClick={() => navigate("/checkout")}
          className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;
