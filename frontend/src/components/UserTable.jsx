// frontend/src/components/UserTable.jsx
import React, { useState } from "react";
import { BASE_URL } from "../utils/api";
import { toast } from "react-hot-toast";
import ConfirmFaceModal from "./ConfirmFaceModel";

const UserTable = ({ users, setUsers }) => {
  const [loadingUserId, setLoadingUserId] = useState(null);
  const [confirmUser, setConfirmUser] = useState(null);

  /* ================= ACTIVATE / DEACTIVATE ================= */
  const handleToggleStatus = async (userId, currentStatus) => {
    try {
      const token = localStorage.getItem("token");

      await fetch(`${BASE_URL}/users/${userId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      setUsers((prev) =>
        prev.map((u) =>
          u._id === userId ? { ...u, isActive: !currentStatus } : u,
        ),
      );
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

/* ================= FACE REGISTRATION ================= */
const handleRegisterFace = async () => {
  try {
    if (!confirmUser) return;

    const user = confirmUser;

    // ✅ close modal immediately
    setConfirmUser(null);

    setLoadingUserId(user._id);
    const token = localStorage.getItem("token");

    const res = await fetch(`${BASE_URL}/face/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        userId: user._id,   // ✅ NOW DEFINED
        role: user.role,    // ✅ NOW DEFINED
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      toast.error(data.message || "Face registration failed");
      return;
    }

    toast.success("✅ Face registered successfully");

    // update UI
    setUsers(prev =>
      prev.map(u =>
        u._id === user._id
          ? { ...u, hasFaceRegistered: true }
          : u
      )
    );

  } catch (error) {
    console.error("Face registration error", error);
    toast.error("❌ Face registration failed");
  } finally {
    setLoadingUserId(null);
  }
};


  if (!users.length) {
    return <p className="text-gray-500">No users found.</p>;
  }

  return (
    <div className="w-full">
      {/* ================= DESKTOP TABLE ================= */}
      <div className="hidden md:block overflow-x-auto bg-white shadow rounded p-2">
        <table className="min-w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-3 py-2">Name</th>
              <th className="border px-3 py-2">Role</th>
              <th className="border px-3 py-2">Email</th>
              <th className="border px-3 py-2">Phone</th>
              <th className="border px-3 py-2">Roll No</th>
              <th className="border px-3 py-2">Employee ID</th>
              <th className="border px-3 py-2">Department</th>
              <th className="border px-3 py-2">Status</th>
              <th className="border px-3 py-2">Face Registered</th>
              <th className="border px-3 py-2 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="hover:bg-gray-50">
                <td className="border px-3 py-2">{user.name}</td>
                <td className="border px-3 py-2 capitalize">{user.role}</td>
                <td className="border px-3 py-2">
                  {user.contact?.email || "-"}
                </td>
                <td className="border px-3 py-2">
                  {user.contact?.phone || "-"}
                </td>
                <td className="border px-3 py-2">{user.rollNo || "-"}</td>
                <td className="border px-3 py-2">{user.employeeId || "-"}</td>
                <td className="border px-3 py-2">{user.department || "-"}</td>

                <td className="border px-3 py-2">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      user.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {user.isActive ? "Active" : "Inactive"}
                  </span>
                </td>

                <td className="border px-3 py-2 text-center">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      user.faceRegistered
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {user.hasFaceRegistered ? "Yes" : "Not Yet"}
                  </span>
                </td>

                <td className="border px-3 py-2 text-center space-y-1">
                  <button
                    onClick={() => handleToggleStatus(user._id, user.isActive)}
                    className={`px-3 py-1 rounded text-xs font-medium w-full ${
                      user.isActive
                        ? "bg-red-100 text-red-700 hover:bg-red-200"
                        : "bg-green-100 text-green-700 hover:bg-green-200"
                    }`}
                  >
                    {user.isActive ? "Deactivate" : "Activate"}
                  </button>

                  <button
                    onClick={() => setConfirmUser(user)}
                    disabled={loadingUserId === user._id}
                    className="px-3 py-1 rounded text-xs font-medium w-full bg-blue-100 text-blue-700 hover:bg-blue-200 disabled:opacity-50"
                  >
                    {loadingUserId === user._id
                      ? "Registering..."
                      : "Register Face"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= MOBILE CARD VIEW ================= */}
      <div className="md:hidden space-y-3">
        {users.map((user) => (
          <div
            key={user._id}
            className="bg-white border rounded-lg shadow-sm p-4 text-sm space-y-2"
          >
            <p>
              <b>Name:</b> {user.name}
            </p>

            <p>
              <b>Role:</b> <span className="capitalize">{user.role}</span>
            </p>

            <p>
              <b>Email:</b> {user.contact?.email || "-"}
            </p>

            {/* FACE STATUS */}
            <p>
              <b>Face:</b>{" "}
              <span
                className={`px-2 py-0.5 rounded text-xs font-medium ${
                  user.hasFaceRegistered
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {user.hasFaceRegistered ? "Registered" : "Not Registered"}
              </span>
            </p>

            {/* STATUS + ACTIONS ROW */}
            <div className="flex items-center justify-between pt-2">
              {/* STATUS */}
              <div>
                <b>Status:</b>{" "}
                <span
                  className={`px-2 py-0.5 rounded text-xs font-medium ${
                    user.isActive
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {user.isActive ? "Active" : "Inactive"}
                </span>
              </div>

              {/* ACTIVATE / DEACTIVATE BUTTON */}
              <button
                onClick={() => handleToggleStatus(user._id, user.isActive)}
                className={`px-3 py-1 rounded text-xs font-medium transition ${
                  user.isActive
                    ? "bg-red-100 text-red-700 hover:bg-red-200"
                    : "bg-green-100 text-green-700 hover:bg-green-200"
                }`}
              >
                {user.isActive ? "Deactivate" : "Activate"}
              </button>
            </div>

            {/* REGISTER FACE BUTTON */}
            <button
              onClick={() => setConfirmUser(user)}
              disabled={user.hasFaceRegistered || loadingUserId === user._id}
              className="w-full mt-3 px-3 py-2 rounded text-xs font-medium transition bg-blue-600 text-white hover:bg-blue-700"
            >
              Register Face
            </button>
          </div>
        ))}
      </div>

      {/* ================= CONFIRM FACE MODAL ================= */}
      <ConfirmFaceModal
        user={confirmUser}
        onClose={() => setConfirmUser(null)}
        onConfirm={handleRegisterFace}
      />
    </div>
  );
};

export default UserTable;
