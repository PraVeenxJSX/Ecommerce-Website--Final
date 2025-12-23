import React from "react";
import { Link } from "react-router-dom";
import { CATEGORIES } from "../constants/categories";


const Categories = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6">
      {CATEGORIES.map((cat) => (
        <Link
          key={cat}
          to={`/category/${cat}`}
          className="bg-white shadow rounded p-6 text-center font-semibold hover:bg-blue-50"
        >
          {cat}
        </Link>
      ))}
    </div>
  );
};

export default Categories;
