import React from "react";

const CategoryHeader = ({ name, description }) => (
  <div className="mb-6">
    <h2 className="text-2xl font-bold">{name}</h2>
    <h4 className="text-md font-semibold mt-2">Description</h4>
    <p className="text-gray-600">{description}</p>
  </div>
);

export default CategoryHeader;