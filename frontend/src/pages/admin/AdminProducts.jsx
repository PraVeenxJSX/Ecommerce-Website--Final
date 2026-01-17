import React, { useEffect, useState } from "react";
import api from "../../services/api";
import AdminLayout from "../../components/admin/AdminLayout";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [editingId, setEditingId] = useState(null);

  // Pagination State
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // FETCH PRODUCTS
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await api.get(`/products?page=${page}`);
        setProducts(data.products || []);
        setTotalPages(data.pages || 1);
      } catch (error) {
        console.error("Error fetching admin products", error);
      }
    };
    fetchProducts();
  }, [page]);

  // ADD or UPDATE PRODUCT
  const saveProduct = async () => {
    if (!name || !description || (!image && !editingId)) {
      alert("Please fill all fields and select an image");
      return;
    }

    // ✅ PRICE VALIDATION (CRITICAL FIX)
    if (isNaN(price) || Number(price) <= 0) {
      alert("Please enter a valid price");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("price", price);
    formData.append("description", description);
    formData.append("category", "General");
    formData.append("countInStock", 5);

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
        setEditingId(null);
      } else {
        // CREATE PRODUCT
        const { data } = await api.post("/products", formData);
        setProducts([...products, data]);
      }

      // RESET FORM
      setName("");
      setPrice("");
      setDescription("");
      setImage(null);
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
      <h1 className="text-3xl font-bold mb-6">Products</h1>

      {/* ADD / EDIT FORM */}
      <div className="bg-white p-6 rounded shadow mb-6">
        <h3 className="font-semibold mb-4">
          {editingId ? "Edit Product" : "Add Product"}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <input
            className="border p-2 rounded"
            placeholder="Product Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          {/* ✅ FIXED PRICE INPUT */}
          <input
            type="number"
            min="0"
            step="0.01"
            className="border p-2 rounded"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>

        <textarea
          className="border p-2 rounded w-full mb-4"
          placeholder="Product Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <input
          type="file"
          className="border p-2 rounded w-full mb-4"
          onChange={(e) => setImage(e.target.files[0])}
        />

        <button
          className={`${editingId ? "bg-yellow-500" : "bg-green-600"
            } text-white px-6 py-2 rounded`}
          onClick={saveProduct}
        >
          {editingId ? "Update Product" : "Add Product"}
        </button>
      </div>

      {/* PRODUCT LIST */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((p) => (
          <div key={p._id} className="bg-white p-4 rounded shadow">
            <img
              src={p.image}
              alt={p.name}
              className="w-full h-40 object-cover rounded mb-3"
            />

            <h4 className="font-semibold">{p.name}</h4>
            <p className="text-gray-600 mb-1">₹{p.price}</p>
            <p className="text-sm text-gray-500 mb-3">
              {p.description}
            </p>

            <div className="flex gap-3">
              <button
                className="bg-yellow-500 text-white px-3 py-1 rounded"
                onClick={() => {
                  setName(p.name);
                  setPrice(p.price);
                  setDescription(p.description);
                  setEditingId(p._id);
                  setImage(null);
                }}
              >
                Edit
              </button>

              <button
                className="bg-red-600 text-white px-3 py-1 rounded"
                onClick={() => deleteProduct(p._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Basic Pagination Controls */}
      <div className="flex justify-center mt-8 gap-4">
        <button
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          disabled={page === 1}
          onClick={() => setPage(p => p - 1)}
        >
          Previous
        </button>
        <span className="py-2">Page {page} of {totalPages}</span>
        <button
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
          disabled={page === totalPages}
          onClick={() => setPage(p => p + 1)}
        >
          Next
        </button>
      </div>
    </AdminLayout>
  );
};

export default AdminProducts;
