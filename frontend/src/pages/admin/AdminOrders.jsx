import React, { useEffect, useState } from "react";
import api from "../../services/api";
import AdminLayout from "../../components/admin/AdminLayout";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const { data } = await api.get("/orders");
      setOrders(data);
    };
    fetchOrders();
  }, []);

  const markDelivered = async (id) => {
    await api.put(`/orders/${id}/deliver`);
    setOrders(
      orders.map(o =>
        o._id === id ? { ...o, isDelivered: true } : o
      )
    );
  };

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-6">Orders</h1>

      <div className="bg-white rounded shadow overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-4">User</th>
              <th className="p-4">Total</th>
              <th className="p-4">Status</th>
              <th className="p-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order._id} className="border-t">
                <td className="p-4">{order.user?.name}</td>
                <td className="p-4">₹{order.totalPrice}</td>
                <td className="p-4">
                  {order.isDelivered ? (
                    <span className="text-green-600">Delivered</span>
                  ) : (
                    <span className="text-red-500">Pending</span>
                  )}
                </td>
                <td className="p-4">
                  {!order.isDelivered && (
                    <button
                      className="bg-blue-600 text-white px-3 py-1 rounded"
                      onClick={() => markDelivered(order._id)}
                    >
                      Mark Delivered
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default AdminOrders;
