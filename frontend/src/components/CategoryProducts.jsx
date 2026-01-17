import React from "react";
import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";
import ProductCardSkeleton from "./ProductCardSkeleton";

const CategoryProducts = () => {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(
          `/products?category=${category}`
        );
        // Correctly handling paginated response structure: { products: [...], ... }
        setProducts(data.products || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">{category}</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))
          : products.length > 0 ? products.map((p) => (
            <Link
              key={p._id}
              to={`/product/${p._id}`}
              className="bg-white rounded-2xl p-4 hover:shadow-xl transition transform hover:-translate-y-1 overflow-hidden"
            >
              <div className="relative rounded-lg overflow-hidden">
                <img
                  src={p.image}
                  alt={p.name}
                  className="h-44 w-full object-cover mb-3 rounded-lg"
                />
                {p.countInStock === 0 && (
                  <span className="absolute top-3 left-3 bg-red-600 text-white text-xs px-2 py-1 rounded">Out</span>
                )}
              </div>
              <h3 className="font-semibold truncate">{p.name}</h3>
              <p className="text-gray-600 mt-1">{p.category}</p>
              <p className="font-bold text-lg mt-2">₹{p.price}</p>
            </Link>
          )) : (
            <p className="text-gray-600 col-span-full">No products found.</p>
          )}
      </div>
    </div>
  );
};

export default CategoryProducts;
