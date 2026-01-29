import React, { useState } from "react";
import { BASE_URL } from "../utils/api";

const AddGuardModal = ({ onClose, refreshGuards }) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    contact: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    const res = await fetch(`${BASE_URL}/auth/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ ...form, role: "guard" })
    });

    const data = await res.json();
    if (!res.ok) return alert(data.message);

    alert("Guard added successfully");
    refreshGuards();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-2">
      <div className="bg-white w-full max-w-md rounded-lg shadow p-5">

        <h3 className="text-lg font-bold mb-4">Add New Guard</h3>

        <form onSubmit={handleSubmit} className="space-y-3">

          <input
            name="name"
            placeholder="Guard Name"
            onChange={handleChange}
            className="border p-2 w-full rounded"
          />

          <input
            name="email"
            placeholder="Email"
            onChange={handleChange}
            className="border p-2 w-full rounded"
          />

          <input
            name="contact"
            placeholder="Contact Number"
            onChange={handleChange}
            className="border p-2 w-full rounded"
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            className="border p-2 w-full rounded"
          />

          <div className="flex flex-col sm:flex-row justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="border px-4 py-2 rounded">
              Cancel
            </button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Add Guard
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AddGuardModal;
