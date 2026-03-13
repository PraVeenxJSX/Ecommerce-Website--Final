import React from "react";
import { NavLink, Link } from "react-router-dom";

const navItems = [
  { to: "/admin", label: "Dashboard", icon: "\u{1F4CA}", end: true },
  { to: "/admin/orders", label: "Orders", icon: "\u{1F4E6}", end: false },
  { to: "/admin/products", label: "Products", icon: "\u{1F6CD}\uFE0F", end: false },
];

const AdminLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 bg-gray-900 text-white border-r border-gray-700 flex flex-col">
        <div className="p-6 pb-4">
          <h2 className="text-2xl font-bold tracking-tight">Admin Panel</h2>
          <p className="text-xs text-gray-400 mt-1">Management Console</p>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-150 ${
                  isActive
                    ? "bg-amber-500 text-white shadow-md"
                    : "text-gray-400 hover:bg-gray-800 hover:text-gray-200"
                }`
              }
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="px-4 pb-6 mt-auto">
          <div className="border-t border-gray-700 pt-4">
            <Link
              to="/"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-gray-200 transition-colors duration-150"
            >
              <span className="text-lg">{"\u2190"}</span>
              Back to Store
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">{children}</main>
    </div>
  );
};

export default AdminLayout;
