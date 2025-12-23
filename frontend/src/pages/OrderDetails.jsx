import { useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import api from "../services/api";

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      const { data } = await api.get(`/orders/${id}`);
      setOrder(data);
    };
    fetchOrder();
  }, [id]);

  if (!order) {
    return <div className="p-6">Loading order...</div>;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Order Details</h1>

      {/* ORDER INFO */}
      <div className="border rounded p-4">
        <p><strong>Order ID:</strong> {order._id}</p>
        <p><strong>Placed On:</strong> {new Date(order.createdAt).toLocaleString()}</p>
        <p>
          <strong>Payment:</strong>{" "}
          <span className={order.isPaid ? "text-green-600" : "text-yellow-600"}>
            {order.isPaid ? "Paid" : "Pending"}
          </span>
        </p>
        <p>
          <strong>Delivery:</strong>{" "}
          <span className={order.isDelivered ? "text-green-600" : "text-yellow-600"}>
            {order.isDelivered ? "Delivered" : "Pending"}
          </span>
        </p>
      </div>

      {/* SHIPPING */}
      <div className="border rounded p-4">
        <h2 className="text-xl font-semibold mb-2">Shipping Address</h2>
        <p>{order.shippingAddress.address}</p>
        <p>
          {order.shippingAddress.city},{" "}
          {order.shippingAddress.postalCode}
        </p>
        <p>{order.shippingAddress.country}</p>
      </div>

      {/* ITEMS */}
      <div className="border rounded p-4">
        <h2 className="text-xl font-semibold mb-4">Order Items</h2>

        {order.orderItems.map((item) => (
          <div
            key={item.product}
            className="flex items-center gap-4 border-b py-3"
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-20 h-20 object-cover rounded"
            />

            <div className="flex-1">
              <p className="font-medium">{item.name}</p>
              <p className="text-sm text-gray-600">
                Qty: {item.qty}
              </p>
            </div>

            <div className="font-semibold">
              ₹{item.qty * item.price}
            </div>
          </div>
        ))}
      </div>

      {/* TOTAL */}
      <div className="text-right text-xl font-bold">
        Total: ₹{order.totalPrice}
      </div>
    </div>
  );
};

export default OrderDetails;
