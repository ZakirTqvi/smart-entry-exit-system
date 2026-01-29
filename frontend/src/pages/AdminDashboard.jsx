import React, { useEffect, useState } from "react";
import StatCard from "../components/StatCard";
import LogsTable from "../components/LogsTable";
import { BASE_URL } from "../utils/api";

const AdminDashboard = () => {
  /* ================= STATES ================= */
  const [stats, setStats] = useState(null);

  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  /* ================= EFFECT ================= */
  useEffect(() => {
    fetchStats();
    fetchRecentLogs();
  }, [page]);

  /* ================= FETCH DASHBOARD STATS ================= */
  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${BASE_URL}/occupancy/people`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();

      const counts = {
        student: 0,
        teaching: 0,
        "non-teaching": 0,
        visitor: 0
      };

      data.people.forEach((p) => {
        if (counts[p.role] !== undefined) {
          counts[p.role]++;
        }
      });

      setStats({
        total: data.totalInside,
        student: counts.student,
        teaching: counts.teaching,
        nonTeaching: counts["non-teaching"],
        visitor: counts.visitor
      });
    } catch (error) {
      console.error("Failed to fetch dashboard stats", error);
    }
  };

  /* ================= FETCH RECENT LOGS ================= */
  const fetchRecentLogs = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${BASE_URL}/entry/logs?page=${page}&limit=5`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await res.json();
      
      setLogs(data.report || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error("Failed to fetch recent logs", error);
    } finally {
      setLoading(false);
    }
  };

  if (!stats) {
    return (
      <p className="text-gray-500">
        Loading dashboard...
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {/* PAGE TITLE */}
      <h2 className="text-2xl font-semibold">
        Dashboard Overview
      </h2>

      {/* ================= STAT CARDS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard title="Total Inside" value={stats.total} />
        <StatCard title="Students" value={stats.student} />
        <StatCard title="Teaching Staff" value={stats.teaching} />
        <StatCard title="Non-Teaching Staff" value={stats.nonTeaching} />
        <StatCard title="Visitors" value={stats.visitor} />
      </div>

      {/* ================= RECENT ENTRY LOGS ================= */}
      <div className="bg-white shadow rounded p-4">
        <h3 className="text-lg font-semibold mb-4">
          Recent Entry Logs
        </h3>

        {loading ? (
          <p className="text-gray-500 text-sm">
            Loading logs...
          </p>
        ) : logs.length === 0 ? (
          <p className="text-gray-500 text-sm">
            No entry logs found
          </p>
        ) : (
          <LogsTable logs={logs} />
        )}

        {/* PAGINATION (SAME AS LogsPage) */}
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
      </div>
    </div>
  );
};

export default AdminDashboard;
