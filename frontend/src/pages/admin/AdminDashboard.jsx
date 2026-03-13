import React from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const cards = [
    {
      title: "Manage Orders",
      description: "View, update, and track all customer orders in one place.",
      icon: "\u{1F4E6}",
      iconBg: "bg-blue-100",
      iconText: "text-blue-600",
      buttonBg: "bg-blue-600 hover:bg-blue-700",
      buttonLabel: "View Orders",
      onClick: () => navigate("/admin/orders"),
    },
    {
      title: "Manage Products",
      description: "Add, edit, or remove products from your store catalog.",
      icon: "\u{1F6CD}\uFE0F",
      iconBg: "bg-green-100",
      iconText: "text-green-600",
      buttonBg: "bg-green-600 hover:bg-green-700",
      buttonLabel: "View Products",
      onClick: () => navigate("/admin/products"),
    },
    {
      title: "Store Front",
      description: "Preview your live store as customers see it.",
      icon: "\u{1F3EA}",
      iconBg: "bg-amber-100",
      iconText: "text-amber-600",
      buttonBg: "bg-amber-600 hover:bg-amber-700",
      buttonLabel: "Visit Store",
      onClick: () => navigate("/"),
    },
  ];

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-500 mt-1">Welcome back, Admin. Here is a quick look at your store.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card) => (
          <div
            key={card.title}
            className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-200 p-6 flex flex-col"
          >
            <div
              className={`w-12 h-12 ${card.iconBg} ${card.iconText} rounded-lg flex items-center justify-center text-2xl mb-4`}
            >
              {card.icon}
            </div>
            <h3 className="text-lg font-semibold text-gray-900">{card.title}</h3>
            <p className="text-sm text-gray-500 mt-1 flex-1">{card.description}</p>
            <button
              className={`mt-5 ${card.buttonBg} text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors duration-150`}
              onClick={card.onClick}
            >
              {card.buttonLabel}
            </button>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
