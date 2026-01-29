import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminTopbar = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <header className="fixed top-0 left-0 w-full h-14 md:h-16 bg-white shadow z-50 flex items-center justify-between px-3 sm:px-6">

      {/* LEFT: Hamburger */}
      <button
        onClick={onMenuClick}
        className="md:hidden text-2xl text-gray-700"
      >
        ☰
      </button>

      {/* CENTER: Title */}
      <h1 className="text-sm sm:text-base font-semibold text-gray-700">
        Admin Panel
      </h1>

      {/* RIGHT: Profile */}
      <div className="relative">
        {/* Avatar */}
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm hover:bg-blue-700 transition"
        >
          A
        </button>

        {/* Dropdown */}
        {showMenu && (
          <div className="absolute right-0 mt-2 bg-white shadow-lg border rounded w-32 text-sm">
            <button
              onClick={handleLogout}
              className="block w-full text-left px-3 py-2 hover:bg-gray-100 text-red-600"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default AdminTopbar;
