import React from "react";
import { useNavigate } from "react-router-dom";

const Navbar = ({ title }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // 🔐 clear auth data
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    // 🚪 redirect to login
    navigate("/", { replace: true });
  };

  return (
    <div className="w-full h-14 bg-blue-600 text-white flex items-center justify-between px-6">
      {/* Left side: Title */}
      <h1 className="text-lg font-semibold">
        {title || "Smart Entry Exit System"}
      </h1>

      {/* Right side: Logout */}
      <button
        onClick={handleLogout}
        className="bg-white text-blue-600 px-4 py-1 rounded hover:bg-gray-100"
      >
        Logout
      </button>
    </div>
  );
};

export default Navbar;
