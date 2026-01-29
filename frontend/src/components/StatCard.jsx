// frontend/src/components/StatCard.jsx
import React from "react";

const StatCard = ({ title, value }) => {
  return (
    <div className="bg-white shadow rounded p-4">
      <p className="text-gray-500 text-sm">{title}</p>
      <h2 className="text-2xl font-bold text-blue-600">
        {value}
      </h2>
    </div>
  );
};

export default StatCard;
