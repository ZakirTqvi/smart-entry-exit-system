// frontend/src/components/UserTable.jsx
import React from "react";
import { BASE_URL } from "../utils/api";

const UserTable = ({ users, setUsers }) => {

  const handleToggleStatus = async (userId, currentStatus) => {
    try {
      const token = localStorage.getItem("token");

      await fetch(`${BASE_URL}/users/${userId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ isActive: !currentStatus })
      });

      setUsers(prev =>
        prev.map(u =>
          u._id === userId ? { ...u, isActive: !currentStatus } : u
        )
      );
    } catch (error) {
      console.error("Failed to update status", error);
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
              <th className="border px-3 py-2">Address</th>
              <th className="border px-3 py-2">Status</th>
              <th className="border px-3 py-2 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {users.map(user => (
              <tr key={user._id} className="hover:bg-gray-50">

                <td className="border px-3 py-2">{user.name}</td>
                <td className="border px-3 py-2 capitalize">{user.role}</td>

                <td className="border px-3 py-2">{user.contact?.email || "-"}</td>
                <td className="border px-3 py-2">{user.contact?.phone || "-"}</td>
                <td className="border px-3 py-2">{user.rollNo || "-"}</td>
                <td className="border px-3 py-2">{user.employeeId || "-"}</td>
                <td className="border px-3 py-2">{user.department || "-"}</td>

                <td className="border px-3 py-2 text-xs">
                  {user.address
                    ? `${user.address.line1 || ""}, ${user.address.city || ""}, ${user.address.state || ""}, ${user.address.pincode || ""}`
                    : "-"}
                </td>

                <td className="border px-3 py-2">
                  <span className={`px-2 py-1 rounded text-xs ${
                    user.isActive
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}>
                    {user.isActive ? "Active" : "Inactive"}
                  </span>
                </td>

                <td className="border px-3 py-2 text-center">
                  <button
                    onClick={() => handleToggleStatus(user._id, user.isActive)}
                    className={`px-3 py-1 rounded text-xs font-medium ${
                      user.isActive
                        ? "bg-red-100 text-red-700 hover:bg-red-200"
                        : "bg-green-100 text-green-700 hover:bg-green-200"
                    }`}
                  >
                    {user.isActive ? "Deactivate" : "Activate"}
                  </button>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= MOBILE CARD VIEW ================= */}
      <div className="md:hidden space-y-3">
        {users.map(user => (
          <div key={user._id} className="bg-white border rounded shadow p-3 text-sm space-y-1">

            <p><b>Name:</b> {user.name}</p>
            <p><b>Role:</b> {user.role}</p>
            <p><b>Email:</b> {user.contact?.email || "-"}</p>
            <p><b>Phone:</b> {user.contact?.phone || "-"}</p>
            <p><b>Roll No:</b> {user.rollNo || "-"}</p>
            <p><b>Employee ID:</b> {user.employeeId || "-"}</p>
            <p><b>Department:</b> {user.department || "-"}</p>

            <p><b>Address:</b> {user.address
              ? `${user.address.line1 || ""}, ${user.address.city || ""}, ${user.address.state || ""}, ${user.address.pincode || ""}`
              : "-"}</p>

            <p>
              <b>Status:</b>{" "}
              <span className={`px-2 py-0.5 rounded text-xs ${
                user.isActive
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}>
                {user.isActive ? "Active" : "Inactive"}
              </span>
            </p>

            <button
              onClick={() => handleToggleStatus(user._id, user.isActive)}
              className={`w-full mt-2 px-3 py-1 rounded text-xs font-medium ${
                user.isActive
                  ? "bg-red-500 text-white"
                  : "bg-green-600 text-white"
              }`}
            >
              {user.isActive ? "Deactivate" : "Activate"}
            </button>

          </div>
        ))}
      </div>

    </div>
  );
};

export default UserTable;
