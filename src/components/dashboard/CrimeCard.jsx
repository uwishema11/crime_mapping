import React from "react";

const CrimeCard = ({ name, specifics }) => (
  <div className="bg-gray-200 rounded-lg p-6 shadow hover:shadow-lg transition">
    <h4 className="font-semibold text-lg mb-4">{name}</h4>
    <ul className="space-y-2">
      {specifics.map((item, idx) => (
        <li key={idx} className="flex items-center">
          <span className="w-2 h-2 bg-gray-700 rounded-full mr-3"></span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  </div>
);

export default CrimeCard;