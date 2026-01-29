// frontend/src/components/LogsTable.jsx
import React from "react";

const LogsTable = ({ logs = [] }) => {
  if (logs.length === 0) {
    return (
      <p className="text-gray-500 text-sm">
        No entry logs found
      </p>
    );
  }

  return (
    <div className="w-full">

      {/* ================= DESKTOP TABLE ================= */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-3 py-2">Name</th>
              <th className="border px-3 py-2">Department</th>
              <th className="border px-3 py-2">Role</th>
              <th className="border px-3 py-2">Entry Time</th>
              <th className="border px-3 py-2">Exit Time</th>
              <th className="border px-3 py-2">Status</th>
            </tr>
          </thead>

          <tbody>
            {logs.map((log, index) => (
              <tr key={log._id || index} className="hover:bg-gray-50">
                <td className="border px-3 py-2">{log.name}</td>
                <td className="border px-3 py-2">{log.department || "N/A"}</td>
                <td className="border px-3 py-2 capitalize">{log.personType}</td>
                <td className="border px-3 py-2">{log.entryTime}</td>
                <td className="border px-3 py-2">{log.exitTime || "-"}</td>
                <td className="border px-3 py-2">
                  <span className="px-2 py-1 bg-gray-200 rounded text-xs">
                    {log.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ================= MOBILE CARD VIEW ================= */}
      <div className="md:hidden space-y-3">
        {logs.map((log, index) => (
          <div
            key={log._id || index}
            className="border rounded p-3 shadow-sm bg-white text-sm"
          >
            <p><span className="font-semibold">Name:</span> {log.name}</p>
            <p><span className="font-semibold">Department:</span> {log.department || "N/A"}</p>
            <p><span className="font-semibold">Role:</span> {log.personType}</p>
            <p><span className="font-semibold">Entry:</span> {log.entryTime}</p>
            <p><span className="font-semibold">Exit:</span> {log.exitTime || "-"}</p>
            <p>
              <span className="font-semibold">Status:</span>{" "}
              <span className="px-2 py-0.5 bg-gray-200 rounded text-xs">
                {log.status}
              </span>
            </p>
          </div>
        ))}
      </div>

    </div>
  );
};

export default LogsTable;
