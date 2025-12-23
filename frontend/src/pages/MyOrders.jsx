import React, { useEffect, useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const { data } = await api.get("/orders/myorders");
      setOrders(data);
    };
    fetchOrders();
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">My Orders</h1>

      {orders.length === 0 ? (
        <p className="text-gray-600">No orders found</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Link
              key={order._id}
              to={`/order/${order._id}`}
              className="block"
            >
              <div className="border rounded-lg p-4 shadow-sm hover:shadow-md transition cursor-pointer bg-white">
                <div className="flex justify-between mb-2">
                  <span className="font-semibold">
                    Order ID: {order._id}
                  </span>
                  <span className="text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <p className="mb-1">
                  <strong>Total:</strong> ₹{order.totalPrice}
                </p>

                <p className="mb-1">
                  <strong>Payment:</strong>{" "}
                  <span
                    className={
                      order.isPaid
                        ? "text-green-600"
                        : "text-yellow-600"
                    }
                  >
                    {order.isPaid ? "Paid" : "Pending"}
                  </span>
                </p>

                <p>
                  <strong>Delivery:</strong>{" "}
                  <span
                    className={
                      order.isDelivered
                        ? "text-green-600"
                        : "text-yellow-600"
                    }
                  >
                    {order.isDelivered ? "Delivered" : "Pending"}
                  </span>
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
