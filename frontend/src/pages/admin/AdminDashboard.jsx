import React from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-lg font-semibold">Manage Orders</h3>
          <button
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
            onClick={() => navigate("/admin/orders")}
          >
            View Orders
          </button>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-lg font-semibold">Manage Products</h3>
          <button
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
            onClick={() => navigate("/admin/products")}
          >
            View Products
          </button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
