import React, { useEffect, useState } from "react";
import api from "../../services/api";
import AdminLayout from "../../components/admin/AdminLayout";

const CATEGORY_OPTIONS = [
  "General",
  "Mobiles",
  "Laptops",
  "Fashion",
  "Appliances",
  "Audio",
  "Wearables",
  "Cameras",
  "Gaming",
  "Furniture",
  "Books",
  "Sports",
  "Groceries",
];

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [category, setCategory] = useState("General");
  const [countInStock, setCountInStock] = useState(5);
  const [editingId, setEditingId] = useState(null);

  // Pagination State
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // FETCH PRODUCTS
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/products?page=${page}`);
        setProducts(data.products || []);
        setTotalPages(data.pages || 1);
      } catch (error) {
        console.error("Error fetching admin products", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [page]);

  // RESET FORM
  const resetForm = () => {
    setName("");
    setPrice("");
    setDescription("");
    setImage(null);
    setCategory("General");
    setCountInStock(5);
    setEditingId(null);
  };

  // ADD or UPDATE PRODUCT
  const saveProduct = async () => {
    if (!name || !description || (!image && !editingId)) {
      alert("Please fill all fields and select an image");
      return;
    }

    if (isNaN(price) || Number(price) <= 0) {
      alert("Please enter a valid price");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("countInStock", countInStock);

    if (image) {
      formData.append("image", image);
    }

    try {
      if (editingId) {
        // UPDATE PRODUCT
        const { data } = await api.put(
          `/products/${editingId}`,
          formData
        );

        setProducts(
          products.map((p) =>
            p._id === editingId ? data : p
          )
        );
      } else {
        // CREATE PRODUCT
        const { data } = await api.post("/products", formData);
        setProducts([...products, data]);
      }

      resetForm();
    } catch (error) {
      console.error(
        "SAVE PRODUCT ERROR:",
        error.response?.data || error.message
      );
      alert(error.response?.data?.message || "Error saving product");
    }
  };

  // DELETE PRODUCT
  const deleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    await api.delete(`/products/${id}`);
    setProducts(products.filter((p) => p._id !== id));
  };

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Products</h1>

      {/* ADD / EDIT FORM */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-indigo-100 p-2 rounded-lg">
            <svg
              className="h-5 w-5 text-indigo-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {editingId ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              )}
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-800">
            {editingId ? "Edit Product" : "Add New Product"}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Product Name
            </label>
            <input
              className="w-full border border-gray-200 p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              placeholder="Enter product name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Price
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              className="w-full border border-gray-200 p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              placeholder="Enter price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Category
            </label>
            <select
              className="w-full border border-gray-200 p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition bg-white"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {CATEGORY_OPTIONS.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Stock Count
            </label>
            <input
              type="number"
              min="0"
              step="1"
              className="w-full border border-gray-200 p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              placeholder="Count in stock"
              value={countInStock}
              onChange={(e) => setCountInStock(e.target.value)}
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Description
          </label>
          <textarea
            className="w-full border border-gray-200 p-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            placeholder="Enter product description"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Product Image
          </label>
          <input
            type="file"
            className="w-full border border-gray-200 p-2.5 rounded-lg text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100 transition"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </div>

        <div className="flex gap-3">
          <button
            className={`${
              editingId
                ? "bg-amber-500 hover:bg-amber-600"
                : "bg-indigo-600 hover:bg-indigo-700"
            } text-white px-6 py-2.5 rounded-lg font-medium transition-colors duration-150`}
            onClick={saveProduct}
          >
            {editingId ? "Update Product" : "Add Product"}
          </button>

          {editingId && (
            <button
              className="bg-gray-100 text-gray-600 hover:bg-gray-200 px-6 py-2.5 rounded-lg font-medium transition-colors duration-150"
              onClick={resetForm}
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <svg
              className="animate-spin h-10 w-10 text-indigo-500 mx-auto mb-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            <p className="text-gray-500 text-lg">Loading products...</p>
          </div>
        </div>
      )}

      {/* PRODUCT LIST */}
      {!loading && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((p) => (
              <div
                key={p._id}
                className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden"
              >
                <img
                  src={p.image}
                  alt={p.name}
                  className="w-full h-48 object-cover"
                />

                <div className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-gray-800 text-lg leading-tight">
                      {p.name}
                    </h4>
                    <span className="text-lg font-bold text-indigo-600 ml-2 whitespace-nowrap">
                      ₹{p.price}
                    </span>
                  </div>

                  {p.category && (
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-600 mb-2">
                      {p.category}
                    </span>
                  )}

                  <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                    {p.description}
                  </p>

                  <div className="flex gap-2">
                    <button
                      className="flex-1 bg-amber-50 text-amber-600 hover:bg-amber-100 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-150"
                      onClick={() => {
                        setName(p.name);
                        setPrice(p.price);
                        setDescription(p.description);
                        setCategory(p.category || "General");
                        setCountInStock(p.countInStock ?? 5);
                        setEditingId(p._id);
                        setImage(null);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                    >
                      Edit
                    </button>

                    <button
                      className="flex-1 bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-150"
                      onClick={() => deleteProduct(p._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center justify-center mt-10 gap-2">
            <button
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-150"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
              <button
                key={num}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors duration-150 ${
                  page === num
                    ? "bg-indigo-600 text-white"
                    : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
                onClick={() => setPage(num)}
              >
                {num}
              </button>
            ))}

            <button
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-150"
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </button>
          </div>
        </>
      )}
    </AdminLayout>
  );
};

export default AdminProducts;
