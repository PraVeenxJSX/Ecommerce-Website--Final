import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";
import { useCart } from "../context/CartContext";
import Skeleton from "../components/Skeleton";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [related, setRelated] = useState([]);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      const { data } = await api.get(`/products/${id}`);
      setProduct(data);

      const relatedRes = await api.get(
        `/products?category=${data.category}`
      );

      setRelated(
        relatedRes.data.filter((p) => p._id !== data._id).slice(0, 4)
      );
    };

    fetchProduct();
  }, [id]);



  // ... existing code ...

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
          {/* Image Skeleton */}
          <Skeleton className="w-full h-[460px] rounded-2xl" />

          {/* Details Skeleton */}
          <div className="space-y-6">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-8 w-1/4" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
            <Skeleton className="h-14 w-40 rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* MAIN SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
        {/* IMAGE */}
        <div className="overflow-hidden rounded-2xl shadow-lg bg-white">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-[460px] object-cover hover:scale-105 transition duration-500"
          />
        </div>

        {/* DETAILS */}
        <div>
          <p className="text-sm uppercase tracking-wide text-gray-400 mb-2">
            {product.category}
          </p>

          <h1 className="text-4xl font-bold mb-4 leading-tight">
            {product.name}
          </h1>

          <p className="text-3xl font-semibold text-green-600 mb-6">
            ₹{product.price}
          </p>

          <p className="text-gray-700 leading-relaxed mb-6">
            {product.description}
          </p>

          {/* STOCK STATUS */}
          <div className="mb-6">
            <span className="font-medium">Availability:</span>{" "}
            <span
              className={`ml-2 font-semibold ${product.countInStock > 0
                ? "text-green-600"
                : "text-red-600"
                }`}
            >
              {product.countInStock > 0 ? "In Stock" : "Out of Stock"}
            </span>
          </div>

          {/* QUANTITY */}
          {product.countInStock > 0 && (
            <div className="mb-8 flex items-center gap-4">
              <span className="font-medium">Quantity</span>
              <select
                value={qty}
                onChange={(e) => setQty(Number(e.target.value))}
                className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-black outline-none"
              >
                {[...Array(product.countInStock).keys()].map((x) => (
                  <option key={x + 1} value={x + 1}>
                    {x + 1}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* ADD TO CART */}
          <button
            onClick={() => addToCart({ ...product, qty })}
            disabled={product.countInStock === 0}
            className={`w-full md:w-auto px-10 py-4 rounded-full text-white text-lg font-medium transition transform ${product.countInStock === 0
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-black hover:scale-105 hover:bg-gray-900"
              }`}
          >
            Add to Cart
          </button>
        </div>
      </div>

      {/* RELATED PRODUCTS */}
      {related.length > 0 && (
        <div className="mt-24">
          <h2 className="text-3xl font-bold mb-10">
            You may also like
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {related.map((p) => (
              <Link
                key={p._id}
                to={`/product/${p._id}`}
                className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition overflow-hidden"
              >
                <img
                  src={p.image}
                  alt={p.name}
                  className="h-48 w-full object-cover group-hover:scale-105 transition duration-500"
                />

                <div className="p-4">
                  <h3 className="text-sm font-semibold truncate mb-1">
                    {p.name}
                  </h3>
                  <p className="text-sm text-gray-500 mb-2">
                    {p.category}
                  </p>
                  <p className="font-bold text-lg">
                    ₹{p.price}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
