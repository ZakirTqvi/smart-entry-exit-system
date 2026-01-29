// frontend/src/pages/LogsPage.jsx
import React, { useEffect, useState } from "react";
import { BASE_URL } from "../utils/api";
import LogsTable from "../components/LogsTable";

const LogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [type, setType] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchLogs();
  }, [type, fromDate, toDate, page]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const params = new URLSearchParams({
        page,
        limit: 10,
        ...(type && { type }),
        ...(fromDate && { from: fromDate }),
        ...(toDate && { to: toDate })
      });

      const res = await fetch(
        `${BASE_URL}/entry/logs?${params.toString()}`,
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
      console.error("Failed to fetch entry logs", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">

      {/* PAGE TITLE */}
      <h1 className="text-xl md:text-2xl font-semibold">
        Entry Logs
      </h1>

      {/* ================= FILTERS (RESPONSIVE) ================= */}
      <div className="bg-white p-4 rounded shadow flex flex-col md:flex-row md:items-center gap-3">

        {/* Role Filter */}
        <select
          value={type}
          onChange={(e) => {
            setPage(1);
            setType(e.target.value);
          }}
          className="border p-2 rounded w-full md:w-48"
        >
          <option value="">All Roles</option>
          <option value="student">Student</option>
          <option value="teaching">Teaching</option>
          <option value="non-teaching">Non-Teaching</option>
          <option value="visitor">Visitor</option>
        </select>

        {/* From Date */}
        <input
          type="date"
          value={fromDate}
          onChange={(e) => {
            setPage(1);
            setFromDate(e.target.value);
          }}
          className="border p-2 rounded w-full md:w-auto"
        />

        {/* To Date */}
        <input
          type="date"
          value={toDate}
          onChange={(e) => {
            setPage(1);
            setToDate(e.target.value);
          }}
          className="border p-2 rounded w-full md:w-auto"
        />

      </div>

      {/* ================= TABLE ================= */}
      <div className="bg-white shadow rounded p-4 overflow-hidden">
        {loading ? (
          <p className="text-gray-500 text-sm">Loading logs...</p>
        ) : logs.length === 0 ? (
          <p className="text-gray-500 text-sm">No entry logs found</p>
        ) : (
          <LogsTable logs={logs} />
        )}
      </div>

      {/* ================= PAGINATION (RESPONSIVE) ================= */}
      <div className="flex flex-col sm:flex-row justify-between sm:justify-end gap-3 items-center">

        <span className="text-sm text-gray-600 sm:hidden">
          Page {page} of {totalPages}
        </span>

        <div className="flex gap-3 w-full sm:w-auto">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="px-3 py-2 border rounded w-full sm:w-auto disabled:opacity-50"
          >
            Prev
          </button>

          <span className="text-sm hidden sm:block">
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className="px-3 py-2 border rounded w-full sm:w-auto disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

    </div>
  );
};

export default LogsPage;
