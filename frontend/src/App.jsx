import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import AdminLayout from "./layouts/AdminLayout";
import AdminDashboard from "./pages/AdminDashboard";
import UsersPage from "./pages/UsersPage";
import GuardsPage from "./pages/GuardsPage";
import LogsPage from "./pages/LogsPage";
import ReportsPage from "./pages/ReportsPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      {/* 🔥 TOAST NOTIFICATION SYSTEM */}
      <Toaster position="top-right" reverseOrder={false} />

      <Routes>
        {/* Home route */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="guards" element={<GuardsPage />} />
          <Route path="logs" element={<LogsPage />} />
          <Route path="reports" element={<ReportsPage />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
