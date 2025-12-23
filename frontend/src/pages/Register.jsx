import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await api.post("/auth/register", form);
      alert("OTP sent to your email");
      navigate("/verify-otp", { state: { email: form.email } });
    } catch (error) {
      alert(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-white to-gray-50">
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold mb-2">Create an account</h2>
          <p className="text-sm text-gray-500 mb-6">Join MERN-Shop for exclusive deals</p>

          <form onSubmit={submitHandler} className="space-y-4">
            <div>
              <label className="text-sm text-gray-600">Name</label>
              <input
                placeholder="Your name"
                className="w-full mt-1 px-4 py-2 rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-indigo-200 outline-none"
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Email</label>
              <input
                placeholder="you@example.com"
                className="w-full mt-1 px-4 py-2 rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-indigo-200 outline-none"
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Password</label>
              <input
                type="password"
                placeholder="Create a password"
                className="w-full mt-1 px-4 py-2 rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-indigo-200 outline-none"
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
              />
            </div>

            <button className="w-full py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-pink-500 text-white font-semibold">Register</button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">Already have an account? <a href="/login" className="text-indigo-600 hover:underline">Login</a></p>
        </div>
      </div>
    </div>
  );
};

export default Register;
