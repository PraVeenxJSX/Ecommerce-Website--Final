import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../services/api";

const VerifyOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const [otp, setOtp] = useState("");

  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="p-6 bg-white rounded shadow">Email missing</p>
      </div>
    );
  }

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await api.post("/auth/verify-otp", { email, otp });
      alert("Email verified successfully");
      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.message || "OTP verification failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
      <form
        onSubmit={submitHandler}
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm"
      >
        <h2 className="text-2xl font-bold mb-2 text-gray-800">Verify OTP</h2>

        <p className="text-sm text-gray-500 mb-4">OTP sent to <b className="text-gray-800">{email}</b></p>

        <input
          placeholder="Enter OTP"
          className="w-full px-4 py-3 rounded-lg border border-gray-200 mb-4 focus:ring-2 focus:ring-green-200 outline-none"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />

        <button className="bg-green-600 text-white w-full py-3 rounded-lg font-medium hover:opacity-95 transition">Verify</button>
      </form>
    </div>
  );
};

export default VerifyOtp;
