import React, { useState } from "react";
import { BASE_URL } from "../utils/api";
import ResetPasswordModal from "./ResetPasswordModal";
import toast from "react-hot-toast";

const GuardTable = ({ guards, setGuards }) => {
  const token = localStorage.getItem("token");
  const [selectedGuard, setSelectedGuard] = useState(null);

  const toggleStatus = async (guard) => {
  const url = guard.isActive
    ? `${BASE_URL}/auth/deactivate/${guard._id}`
    : `${BASE_URL}/auth/activate/${guard._id}`;

  try {
    await fetch(url, {
      method: guard.isActive ? "DELETE" : "PUT",
      headers: { Authorization: `Bearer ${token}` }
    });

    setGuards(prev =>
      prev.map(g =>
        g._id === guard._id ? { ...g, isActive: !guard.isActive } : g
      )
    );

    toast.success(
      guard.isActive ? "Guard deactivated" : "Guard activated"
    );
  } catch {
    toast.error("Action failed");
  }
};


  const openResetModal = (guard) => {
    setSelectedGuard(guard);
  };

  if (!guards.length) {
    return <p className="text-gray-500">No guards found.</p>;
  }

  return (
    <div className="w-full">

      {/* ================= DESKTOP TABLE ================= */}
      <div className="hidden md:block bg-white shadow rounded overflow-x-auto">
        <table className="min-w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2">Name</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Contact</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>

          <tbody>
            {guards.map(g => (
              <tr key={g._id} className="hover:bg-gray-50">
                <td className="border p-2">{g.name}</td>
                <td className="border p-2">{g.email}</td>
                <td className="border p-2">{g.contact || "-"}</td>

                <td className="border p-2">
                  <span className={`px-2 py-1 rounded text-xs ${
                    g.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                  }`}>
                    {g.isActive ? "Active" : "Inactive"}
                  </span>
                </td>

                <td className="border p-2 flex gap-2">
                  <button
                    onClick={() => toggleStatus(g)}
                    className="px-2 py-1 border rounded"
                  >
                    {g.isActive ? "Deactivate" : "Activate"}
                  </button>

                  <button
                    onClick={() => openResetModal(g)}
                    className="px-2 py-1 bg-yellow-500 text-white rounded"
                  >
                    Reset Password
                  </button>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>

      {/* ================= MOBILE CARD VIEW ================= */}
      <div className="md:hidden space-y-3">
        {guards.map(g => (
          <div key={g._id} className="bg-white border rounded shadow p-3 text-sm space-y-1">

            <p><b>Name:</b> {g.name}</p>
            <p><b>Email:</b> {g.email}</p>
            <p><b>Contact:</b> {g.contact || "-"}</p>

            <p>
              <b>Status:</b>{" "}
              <span className={`px-2 py-0.5 rounded text-xs ${
                g.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
              }`}>
                {g.isActive ? "Active" : "Inactive"}
              </span>
            </p>

            <div className="flex flex-col gap-2 pt-2">
              <button
                onClick={() => toggleStatus(g)}
                className={`px-3 py-1 rounded text-white ${
                  g.isActive ? "bg-red-600" : "bg-green-600"
                }`}
              >
                {g.isActive ? "Deactivate" : "Activate"}
              </button>

              <button
                onClick={() => openResetModal(g)}
                className="px-3 py-1 bg-yellow-500 text-white rounded"
              >
                Reset Password
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* RESET PASSWORD MODAL */}
      {selectedGuard && (
        <ResetPasswordModal
          guard={selectedGuard}
          onClose={() => setSelectedGuard(null)}
        />
      )}

    </div>
  );
};

export default GuardTable;
