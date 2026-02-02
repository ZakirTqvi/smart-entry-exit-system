import React, { useEffect, useState } from "react";
import UserTable from "../components/UserTable";
import { BASE_URL } from "../utils/api";
import { toast } from "react-hot-toast";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [role, setRole] = useState("");

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Modal
  const [showModal, setShowModal] = useState(false);

  // Form Data
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    rollNo: "",
    employeeId: "",
    department: "",
    phone: "",
    line1: "",
    city: "",
    state: "",
    pincode: ""
  });

  /* ================= FETCH USERS ================= */
  useEffect(() => {
    fetchUsers();
  }, [role, page]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const params = new URLSearchParams({
        page,
        limit: 5,
        ...(role && { role })
      });

      const res = await fetch(`${BASE_URL}/users?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();

      setUsers(data.users || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setLoading(false);
    }
  };

  /* ================= FORM CHANGE ================= */
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  /* ================= SUBMIT USER ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      name: formData.name,
      role: formData.role,
      department: formData.department,
      rollNo: formData.rollNo,
      employeeId: formData.employeeId,
      contact: {
        email: formData.email,
        phone: formData.phone
      },
      address: {
        line1: formData.line1,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode
      }
    };

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${BASE_URL}/users/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Failed to add user");
        return;
      }

      toast.success("User added successfully ✅");
      setShowModal(false);
      setFormData({
        name: "",
        email: "",
        role: "",
        rollNo: "",
        employeeId: "",
        department: "",
        phone: "",
        line1: "",
        city: "",
        state: "",
        pincode: ""
      });

      fetchUsers();
    } catch (error) {
      console.error("Error creating user", error);
      alert("Server error");
    }
  };

  return (
    <div className="space-y-6">

      {/* ================= HEADER ================= */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">
            Users Management
          </h2>
          <p className="text-sm text-gray-500">
            Manage students, teaching and non-teaching staff
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
        >
          + Add User
        </button>
      </div>

      {/* ================= FILTER ================= */}
      <div className="bg-white p-4 rounded shadow-sm flex flex-wrap gap-4">
        <select
          value={role}
          onChange={(e) => {
            setRole(e.target.value);
            setPage(1);
          }}
          className="border px-3 py-2 rounded text-sm"
        >
          <option value="">All Roles</option>
          <option value="student">Student</option>
          <option value="teaching">Teaching</option>
          <option value="non-teaching">Non-Teaching</option>
        </select>
      </div>

      {/* ================= TABLE ================= */}
      <div className="bg-white rounded shadow p-4">
        {loading ? (
          <p className="text-gray-500 text-sm">Loading users...</p>
        ) : (
          <UserTable users={users} setUsers={setUsers} />
        )}
      </div>

      {/* ================= PAGINATION ================= */}
      <div className="flex justify-end gap-3 items-center mt-4">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Prev
        </button>

        <span className="text-sm">
          Page {page} of {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className="px-3 py-1 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* ================= ADD USER MODAL ================= */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-lg rounded-lg shadow-lg p-6 overflow-y-auto max-h-[90vh]">

            <h3 className="text-lg font-semibold mb-4">Add New User</h3>

            <form onSubmit={handleSubmit} className="space-y-3">

              <input name="name" value={formData.name} onChange={handleChange}
                placeholder="Full Name" className="w-full border p-2 rounded" required />

              <input name="email" value={formData.email} onChange={handleChange}
                placeholder="Email" className="w-full border p-2 rounded" required />

              <input name="phone" value={formData.phone} onChange={handleChange}
                placeholder="Phone" className="w-full border p-2 rounded" />

              <select name="role" value={formData.role} onChange={handleChange}
                className="w-full border p-2 rounded" required>
                <option value="">Select Role</option>
                <option value="student">Student</option>
                <option value="teaching">Teaching</option>
                <option value="non-teaching">Non-Teaching</option>
              </select>

              {/* Student Roll No */}
              {formData.role === "student" && (
                <input name="rollNo" value={formData.rollNo} onChange={handleChange}
                  placeholder="Roll Number" className="w-full border p-2 rounded" />
              )}

              {/* Employee ID */}
              {(formData.role === "teaching" || formData.role === "non-teaching") && (
                <input name="employeeId" value={formData.employeeId} onChange={handleChange}
                  placeholder="Employee ID" className="w-full border p-2 rounded" />
              )}

              <input name="department" value={formData.department} onChange={handleChange}
                placeholder="Department" className="w-full border p-2 rounded" />

              {/* Address */}
              <input name="line1" value={formData.line1} onChange={handleChange}
                placeholder="Address Line 1" className="w-full border p-2 rounded" />

              <input name="city" value={formData.city} onChange={handleChange}
                placeholder="City" className="w-full border p-2 rounded" />

              <input name="state" value={formData.state} onChange={handleChange}
                placeholder="State" className="w-full border p-2 rounded" />

              <input name="pincode" value={formData.pincode} onChange={handleChange}
                placeholder="Pincode" className="w-full border p-2 rounded" />

              {/* Buttons */}
              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  Save User
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default UsersPage;
