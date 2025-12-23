import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import api, { searchProducts } from "../services/api";

const SearchResults = () => {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const q = params.get("q") || "";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const { data } = await searchProducts(q);
        setProducts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (q && q.trim() !== "") fetch();
    else {
      setProducts([]);
      setLoading(false);
    }
  }, [q]);

  if (loading) return <div className="p-6">Searching...</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Search results for "{q}"</h1>

      {products.length === 0 ? (
        <p className="text-gray-600">No products found.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((p) => (
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
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;
