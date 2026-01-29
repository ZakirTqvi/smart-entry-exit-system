import React from "react";
import { NavLink } from "react-router-dom";

const AdminSidebar = ({ isOpen, onClose }) => {
  return (
    <>
      {/* Overlay for Mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-screen w-64 bg-white shadow-lg z-50
        transform transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0`}
      >
        {/* Logo / Title */}
        <div className="px-6 py-4 border-b">
          <h2 className="text-sm font-semibold text-gray-500">
            Smart Entry Exit System
          </h2>
        </div>

        {/* Navigation */}
        <nav className="mt-4 space-y-1">
          <NavItem to="/admin" label="Dashboard" end onClick={onClose} />
          <NavItem to="/admin/users" label="Users" onClick={onClose} />
          <NavItem to="/admin/guards" label="Guards" onClick={onClose} />
          <NavItem to="/admin/logs" label="Entry Logs" onClick={onClose} />
          <NavItem to="/admin/reports" label="Reports" onClick={onClose} />
        </nav>
      </div>
    </>
  );
};

const NavItem = ({ to, label, end = false, onClick }) => (
  <NavLink
    to={to}
    end={end}
    onClick={onClick}
    className={({ isActive }) =>
      `flex items-center px-6 py-2.5 text-sm rounded-lg mx-2 transition ${
        isActive
          ? "bg-blue-100 text-blue-600 font-medium"
          : "text-gray-600 hover:bg-gray-100"
      }`
    }
  >
    {label}
  </NavLink>
);

export default AdminSidebar;
