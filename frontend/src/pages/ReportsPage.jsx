import React, { useEffect, useState } from "react";
import { BASE_URL } from "../utils/api";
import StatCard from "../components/StatCard";
import { Line, Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Tooltip,
  Legend
);

const ReportsPage = () => {
  /* ================== FILTER STATES ================== */
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("both");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  /* ================== DATA STATES ================== */
  const [summary, setSummary] = useState(null);
  const [dailyEntries, setDailyEntries] = useState([]);
  const [roleStats, setRoleStats] = useState([]);

  const token = localStorage.getItem("token");

  /* ================== FETCH SUMMARY ================== */
  const fetchSummary = async () => {
    try {
      const res = await fetch(`${BASE_URL}/reports/summary`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setSummary(data);
    } catch (err) {
      console.error("Summary error:", err);
    }
  };

  /* ================== FETCH DAILY ENTRIES ================== */
  const fetchDailyEntries = async () => {
    try {
      const res = await fetch(`${BASE_URL}/reports/daily-entries`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setDailyEntries(data);
    } catch (err) {
      console.error("Daily entries error:", err);
    }
  };

  /* ================== FETCH ROLE DISTRIBUTION ================== */
  const fetchRoleDistribution = async () => {
    try {
      const res = await fetch(`${BASE_URL}/reports/role-distribution`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setRoleStats(data);
    } catch (err) {
      console.error("Role stats error:", err);
    }
  };

  /* ================== DOWNLOAD FILE (CSV/PDF) ================== */
  const downloadFile = async (type) => {
    try {
      const params = new URLSearchParams({
        ...(role && { role }),
        ...(status && { status }),
        ...(fromDate && { from: fromDate }),
        ...(toDate && { to: toDate })
      });

      const url = `${BASE_URL}/reports/export/${type}?${params.toString()}`;

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) {
        const err = await res.json();
        return alert(err.message || "Download failed");
      }

      const blob = await res.blob();
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = `entry_logs_${Date.now()}.${type}`;
      link.click();
    } catch (err) {
      console.error("Download error:", err);
      alert("Failed to download file");
    }
  };

  const downloadCSV = () => downloadFile("csv");
  const downloadPDF = () => downloadFile("pdf");

  /* ================== LOAD DATA ON PAGE LOAD ================== */
  useEffect(() => {
    fetchSummary();
    fetchDailyEntries();
    fetchRoleDistribution();
  }, []);

  /* ================== CHART DATA ================== */
  const lineChartData = {
    labels: dailyEntries.map((d) => d.date),
    datasets: [
      {
        label: "Daily Entries",
        data: dailyEntries.map((d) => d.count),
        borderColor: "#2563eb",
        backgroundColor: "rgba(37,99,235,0.1)",
        tension: 0.3
      }
    ]
  };

  const pieChartData = {
    labels: roleStats.map((r) => r.role),
    datasets: [
      {
        data: roleStats.map((r) => r.count),
        backgroundColor: ["#2563eb", "#16a34a", "#dc2626", "#f59e0b"]
      }
    ]
  };

  const barChartData = {
    labels: dailyEntries.map((d) => d.date),
    datasets: [
      {
        label: "Entries",
        data: dailyEntries.map((d) => d.count),
        backgroundColor: "#16a34a"
      }
    ]
  };

  return (
    <div className="space-y-6">
      {/* ================= PAGE TITLE ================= */}
      <h2 className="text-2xl font-semibold text-gray-800">
        Reports & Analytics
      </h2>

      {/* ================= SUMMARY CARDS ================= */}
      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCard title="Total Entries" value={summary.totalEntries} />
          <StatCard title="Total Exits" value={summary.totalExits} />
          <StatCard title="Visitors" value={summary.visitors} />
          <StatCard title="Students" value={summary.students} />
          <StatCard title="Avg Daily Footfall" value={summary.avgDaily} />
        </div>
      )}

      {/* ================= FILTERS ================= */}
      <div className="bg-white shadow p-4 rounded flex flex-wrap gap-3 items-center">
        <select
          onChange={(e) => setRole(e.target.value)}
          className="border p-2 rounded text-sm"
        >
          <option value="">All Roles</option>
          <option value="student">Student</option>
          <option value="teaching">Teaching</option>
          <option value="non-teaching">Non Teaching</option>
          <option value="visitor">Visitor</option>
        </select>

        <select
          onChange={(e) => setStatus(e.target.value)}
          className="border p-2 rounded text-sm"
        >
          <option value="both">Both</option>
          <option value="inside">Inside</option>
          <option value="exited">Exited</option>
        </select>

        <input
          type="date"
          onChange={(e) => setFromDate(e.target.value)}
          className="border p-2 rounded text-sm"
        />

        <input
          type="date"
          onChange={(e) => setToDate(e.target.value)}
          className="border p-2 rounded text-sm"
        />

        <div className="flex gap-2 ml-auto">
          <button
            onClick={downloadCSV}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
          >
            Download CSV
          </button>
          <button
            onClick={downloadPDF}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 text-sm"
          >
            Download PDF
          </button>
        </div>
      </div>

      {/* ================= CHARTS GRID ================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Line Chart */}
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-2">Daily Entry Trend</h3>
          <Line data={lineChartData} />
        </div>

        {/* Pie Chart */}
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-2">Role Distribution</h3>
          <Pie data={pieChartData} />
        </div>

        {/* Bar Chart (full width on large) */}
        <div className="bg-white p-4 rounded shadow lg:col-span-2">
          <h3 className="font-semibold mb-2">Entries Bar Chart</h3>
          <Bar data={barChartData} />
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
