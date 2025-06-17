import React from 'react';

export default function StatCard({ label, value }) {
  return (
    <div className="p-3 bg-white rounded shadow text-center w-full">
      <h3 className="text-xs text-gray-500">{label}</h3>
      <p className="text-xl font-semibold text-blue-700">{value}</p>
    </div>
  );
}
