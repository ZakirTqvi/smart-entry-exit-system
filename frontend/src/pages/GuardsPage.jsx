import React, { useEffect, useState } from "react";
import { BASE_URL } from "../utils/api";
import GuardTable from "../components/GuardTable";
import AddGuardModal from "../components/AddGuardModal";

const GuardsPage = () => {
  const [guards, setGuards] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchGuards();
  }, [page]);

  const fetchGuards = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch(
      `${BASE_URL}/auth/guards?page=${page}&limit=5`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    const data = await res.json();
    setGuards(data.guards || []);
    setTotalPages(data.totalPages || 1);
  };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <h2 className="text-2xl font-semibold">Guards Management</h2>

        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Add Guard
        </button>
      </div>

      {/* Table */}
      <GuardTable guards={guards} setGuards={setGuards} />

      {/* Pagination UI (Same as Users & Logs) */}
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

      {/* Add Guard Modal */}
      {showModal && (
        <AddGuardModal
          onClose={() => setShowModal(false)}
          refreshGuards={fetchGuards}
        />
      )}
    </div>
  );
};

export default GuardsPage;
