import React from "react";
import CategoryHeader from "./CategoryHeader";
import CrimeCard from "./CrimeCard";

const category = {
  name: "Category Name",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing. Lorem ipsum dolor sit amet, consectetur adipiscing",
  crimes: [
    {
      name: "Theft",
      specifics: ["Petty Theft", "Grand Theft", "Shoplifting"],
    },
    {
      name: "Assault",
      specifics: ["Simple Assault", "Aggravated Assault", "Battery"],
    },
    {
      name: "Fraud",
      specifics: ["Credit Card Fraud", "Identity Theft", "Insurance Fraud"],
    },
  ],
};

const CategoriesPage = () => (
  <div className="p-8 w-full">
    <CategoryHeader name={category.name} description={category.description} />
    <h3 className="text-lg font-semibold mt-8 mb-4">Crimes</h3>
    {<CrimeCard /> && (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {category.crimes.map((crime, index) => (
          <CrimeCard
            key={index}
            name={crime.name}
            specifics={crime.specifics}
          />
        ))}
      </div>
    )}
  </div>
);

export default CategoriesPage;
