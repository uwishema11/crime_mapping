import React from "react";
import TableComponent from "./Table";
import CategoryHeader from "./CategoryHeader";
import CrimeCard from "./CrimeCard";
import {
  Shield,
  AlertTriangle,
  Briefcase,
  Home,
  Pill,
  Laptop,
  Skull,
} from "lucide-react";
import { Gavel, Trash2, Pencil } from "lucide-react";

const crimeAgainstMen = {
  crimes: [
    {
      id: 1,
      name: "Physical Assault",
      status: "Active",
      description:
        "Involves the use of physical force against men, often resulting in bodily harm. ",
      specifics: ["Street Violence", "Domestic Assault", "Workplace Assault"],
      icon: <AlertTriangle className="w-6 h-6" />,
      color: "bg-red-100 text-red-700",
    },
    {
      id: 2,
      name: "Workplace Harassment",
      status: "Active",
      description:
        "Includes bullying, intimidation, or verbal abuse targeted at men in professional environments.",
      specifics: ["Verbal Abuse", "Discrimination", "Intimidation"],
      icon: <Briefcase className="w-6 h-6" />,
      color: "bg-blue-100 text-blue-700",
    },
    {
      id: 3,
      name: "Cyberbullying & Blackmail",
      status: "Active",
      description:
        "Online harassment involving threats, blackmail, or shaming targeted at men through digital platforms.",
      icon: <Laptop className="w-6 h-6" />,
      color: "bg-indigo-100 text-indigo-700",
    },
    {
      id: 4,
      status: "Active",
      name: "False Accusations",
      description: "Crimes involving the false reporting of misconduct.",
      specifics: [
        "False Sexual Assault Claims",
        "False Domestic Abuse Accusations",
      ],
      icon: <Shield className="w-6 h-6" />,
      color: "bg-yellow-100 text-yellow-700",
    },
    {
      id: 5,
      name: "Sexual Violence",
      status: "Active",
      description: "Sexual abuse or assault directed at men.",

      icon: <Skull className="w-6 h-6" />,
      color: "bg-gray-100 text-gray-700",
    },
    {
      id: 6,
      name: "Emotional & Financial Abuse",
      status: "Active",
      description: "Involves manipulation, control, or financial exploitation.",
      specifics: ["Control Over Finances", "Emotional Blackmail"],
      icon: <Home className="w-6 h-6" />,
      color: "bg-green-100 text-green-700",
    },
    {
      id: 7,
      name: "Discriminatory Legal Actions",
      description: "Biased treatment in family law and custody cases.",
      status: "Active",
      specifics: ["Unfair Custody Loss", "Biased Sentencing"],
      icon: <Gavel className="w-6 h-6" />,
      color: "bg-purple-100 text-purple-700",
    },
  ],
};

const CrimeCategories = () => {
  const columns = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => <div className="font-medium">{row.original.id}</div>,
    },

    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <div className={`p-2 rounded-full ${row.original.color}`}>
            {row.original.icon}
          </div>
          <span className="font-semibold">{row.original.name}</span>
        </div>
      ),
    },
    {
      accessorKey: "description",
      header: "Description",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <div
          className={`px-2 py-1 rounded-full text-xs font-semibold ${
            row.original.status === "Active" ? "text-green-700" : "text-red-700"
          }`}
        >
          {row.original.status}
        </div>
      ),
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <button
            onClick={() => console.log("Edit", row.original.id)}
            className="text-blue-600 hover:text-blue-800"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => console.log("Delete", row.original.id)}
            className="text-red-600 hover:text-red-800"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold mb-4">Detailed Crime Categories</h3>
        <TableComponent data={crimeAgainstMen.crimes} columns={columns} />
      </div>
    </div>
  );
};

export default CrimeCategories;
