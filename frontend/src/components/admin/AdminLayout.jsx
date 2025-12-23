import React from "react";
import { Link } from "react-router-dom";

const AdminLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white p-6">
        <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>

        <nav className="space-y-4">
          <Link to="/admin" className="block hover:text-yellow-400">
            Dashboard
          </Link>
          <Link to="/admin/orders" className="block hover:text-yellow-400">
            Orders
          </Link>
          <Link to="/admin/products" className="block hover:text-yellow-400">
            Products
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
};

export default AdminLayout;
