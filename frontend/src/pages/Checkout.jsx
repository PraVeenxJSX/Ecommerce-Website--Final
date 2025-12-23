import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import api from "../services/api";


const Checkout = () => {
  const { cartItems } = useCart();
  const navigate = useNavigate();

  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");

  const totalItems = cartItems.reduce((acc, item) => acc + item.qty, 0);
  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.qty * item.price,
    0
  );

 const placeOrderHandler = async () => {
  try {
    const { data } = await api.post("/orders", {
      orderItems: cartItems.map((item) => ({
        name: item.name,
        qty: item.qty,
        price: item.price,
        image: item.image,
        product: item._id,
      })),
      shippingAddress: {
        address,
        city,
        postalCode,
        country,
      },
      totalPrice,
    });

    alert("Order placed successfully 🎉");
    navigate("/myorders");
  } catch (error) {
    alert("Order failed");
  }
};


  return (
    <div className="p-6 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* LEFT - SHIPPING */}
      <div className="md:col-span-2 bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold mb-6">Shipping Address</h2>

        <div className="space-y-4">
          <input
            type="text"
            placeholder="Address"
            className="w-full border p-3 rounded"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />

          <input
            type="text"
            placeholder="City"
            className="w-full border p-3 rounded"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />

          <input
            type="text"
            placeholder="Postal Code"
            className="w-full border p-3 rounded"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
          />

          <input
            type="text"
            placeholder="Country"
            className="w-full border p-3 rounded"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          />
        </div>
      </div>

      {/* RIGHT - ORDER SUMMARY */}
      <div className="bg-white p-6 rounded shadow h-fit">
        <h2 className="text-2xl font-bold mb-4">Order Summary</h2>

        <div className="space-y-3 mb-4">
          {cartItems.map((item) => (
            <div
              key={item._id}
              className="flex justify-between text-sm"
            >
              <span>
                {item.name} × {item.qty}
              </span>
              <span>₹{item.qty * item.price}</span>
            </div>
          ))}
        </div>

        <hr className="my-4" />

        <div className="flex justify-between mb-2">
          <span>Total Items</span>
          <span>{totalItems}</span>
        </div>

        <div className="flex justify-between font-semibold mb-6">
          <span>Total Price</span>
          <span>₹{totalPrice.toFixed(2)}</span>
        </div>

        <button
          onClick={placeOrderHandler}
          className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700 transition"
        >
          Place Order
        </button>
      </div>
    </div>
  );
};

export default Checkout;
