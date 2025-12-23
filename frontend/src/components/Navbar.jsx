import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { UserCircleIcon } from "@heroicons/react/24/solid";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const q = (query || "").trim();
    if (!q) return;
    navigate(`/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <nav className="bg-white/80 backdrop-blur sticky top-0 z-50 border-b">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-indigo-600 to-pink-500 text-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg font-bold">M</div>
            <div>
              <div className="text-lg font-bold text-gray-800">E-COMMERCE</div>
              <div className="text-xs text-gray-500 -mt-1">Quality & Value</div>
            </div>
          </Link>

          <form onSubmit={handleSubmit} className="hidden md:flex items-center bg-gray-100 rounded-full px-3 py-2 shadow-sm">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products, brands and more"
              className="bg-transparent outline-none px-3 text-sm w-64"
            />
            <button type="submit" className="text-sm text-gray-600 font-medium">Search</button>
          </form>
        </div>

        <div className="flex items-center gap-4">
          <Link to="/cart" className="relative text-gray-700 hover:text-gray-900">
            <span className="hidden md:inline font-medium">Cart</span>
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shadow">3</span>
          </Link>

          <div className="relative">
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center gap-2 bg-white border rounded-full px-3 py-1 shadow-sm"
            >
              <UserCircleIcon className="w-8 h-8 text-gray-700" />
              <span className="hidden sm:inline text-sm text-gray-700">Account</span>
            </button>

            {open && (
              <div
                className="absolute right-0 mt-3 bg-white text-gray-800 rounded-lg shadow-lg w-52 py-2 z-50 border"
                onMouseLeave={() => setOpen(false)}
              >
                {user ? (
                  <>
                    <p className="px-4 py-2 text-sm text-gray-500">Hello, {user.name}</p>

                    <Link
                      to="/myorders"
                      className="block px-4 py-2 hover:bg-gray-50 text-sm"
                      onClick={() => setOpen(false)}
                    >
                      My Orders
                    </Link>

                    {user.isAdmin && (
                      <Link
                        to="/admin"
                        className="block px-4 py-2 hover:bg-gray-50 text-sm text-yellow-600"
                        onClick={() => setOpen(false)}
                      >
                        Admin Dashboard
                      </Link>
                    )}

                    <button
                      onClick={() => {
                        logout();
                        setOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm text-red-600"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="block px-4 py-2 hover:bg-gray-50 text-sm"
                      onClick={() => setOpen(false)}
                    >
                      Login
                    </Link>

                    <Link
                      to="/register"
                      className="block px-4 py-2 hover:bg-gray-50 text-sm"
                      onClick={() => setOpen(false)}
                    >
                      Register
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
