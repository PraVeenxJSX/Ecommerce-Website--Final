import React, { useEffect, useState } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";
import CategoryBar from "../components/CategoryBar";
import { CATEGORIES } from "../constants/categories";
import HomeBanner from "../components/HomeBanner";
import Deals from "../components/Deals";
import Hero from "../components/Hero";


const Home = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Fetch top 6 products for each category in parallel
        const promises = CATEGORIES.map((category) =>
          api.get(`/products?category=${encodeURIComponent(category)}&limit=6`)
        );

        const responses = await Promise.all(promises);

        // Combine all fetched products into a single array for display logic
        // Note: Each response.data is now { products: [...], page, total }
        const allProducts = responses.flatMap(res => res.data.products);

        setProducts(allProducts);
      } catch (error) {
        console.error("Error fetching homepage products:", error);
      }
    };
    fetchProducts();
  }, []);

  return (
    <>
      <CategoryBar />
      <HomeBanner />
      <Deals />

      <div className="p-6 space-y-12">
        {CATEGORIES.map((category) => {
          const categoryProducts = products
            .filter((p) => p.category === category)
            .slice(0, 6);

          if (categoryProducts.length === 0) return null;

          return (
            <div key={category}>
              {/* Category Header */}
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">{category}</h2>
                <Link
                  to={`/category/${category}`}
                  className="text-blue-600 hover:underline"
                >
                  View All
                </Link>
              </div>
              {/* Products */}
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                {categoryProducts.map((p) => (
                  <Link
                    key={p._id}
                    to={`/product/${p._id}`}
                    className="bg-white rounded-2xl p-3 hover:shadow-xl transition transform hover:-translate-y-1 overflow-hidden"
                  >
                    <div className="relative rounded-lg overflow-hidden">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="h-36 w-full object-cover mb-2 rounded-lg"
                      />
                      {p.countInStock === 0 && (
                        <span className="absolute top-3 left-3 bg-red-600 text-white text-xs px-2 py-1 rounded">Out of stock</span>
                      )}
                    </div>

                    <h3 className="text-sm font-semibold truncate">{p.name}</h3>
                    <p className="mt-2 font-bold text-lg text-gradient-to-r text-green-600">₹{p.price}</p>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Home;
