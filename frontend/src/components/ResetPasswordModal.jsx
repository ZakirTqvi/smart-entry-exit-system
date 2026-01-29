import React, { useState } from "react";
import { BASE_URL } from "../utils/api";
import toast from "react-hot-toast";

const ResetPasswordModal = ({ guard, onClose }) => {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      setLoading(true);

      const res = await fetch(`${BASE_URL}/auth/reset-password/${guard._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ newPassword: password })
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to reset password");
        return;
      }

      toast.success("Password reset successfully!");
      onClose();
    } catch (err) {
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-2">
      <div className="bg-white w-full max-w-sm rounded-lg shadow p-6">

        <h3 className="text-lg font-semibold mb-3">
          Reset Password for {guard.name}
        </h3>

        <form onSubmit={handleReset} className="space-y-3">

          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 w-full rounded"
            required
          />

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="border px-4 py-2 rounded"
            >
              Cancel
            </button>

            <button
              disabled={loading}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Resetting..." : "Reset"}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

export default ResetPasswordModal;
