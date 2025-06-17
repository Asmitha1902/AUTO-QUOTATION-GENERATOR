import React, { useEffect, useState } from "react";
import axios from "../api/axiosInstance";
import { Link } from "react-router-dom";
import "./ProductList.css";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [message, setMessage] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  // Fetch products from backend API
  const fetchProducts = async () => {
    try {
      const res = await axios.get("/api/products");
      if (res.data.success) {
        setProducts(res.data.products);
        setMessage("");
      } else {
        setProducts([]);
        setMessage("❌ Failed to load products");
      }
    } catch (error) {
      console.error(error);
      setMessage("❌ Error fetching products");
      setProducts([]);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Delete product handler
  const handleDelete = async () => {
    if (!deleteId) return;
    setLoading(true);
    try {
      const res = await axios.delete(`/api/products/${deleteId}`);
      if (res.status === 200) {
        setMessage("✅ Product deleted successfully");
        await fetchProducts();
      } else {
        setMessage("❌ Failed to delete product");
      }
    } catch (error) {
      console.error(error);
      setMessage("❌ Error deleting product");
    } finally {
      setDeleteId(null);
      setLoading(false);
    }
  };

  // Filter products by name or description (case-insensitive)
  const filteredProducts = products.filter(
    (prod) =>
      prod.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prod.product_desc.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Toggle dark mode state
  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  return (
    <div className={`prodlist-container ${darkMode ? "prodlist-dark" : ""}`}>
      <div className="prodlist-header-actions">
        <h2 className="prodlist-title">Product List</h2>
        <button className="prodlist-toggle-darkmode-btn" onClick={toggleDarkMode}>
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>
      </div>

      {message && (
        <p
          className={`prodlist-message ${
            message.includes("❌") ? "prodlist-error" : "prodlist-success"
          }`}
        >
          {message}
        </p>
      )}

      <div className="prodlist-search-wrapper">
        <input
          type="text"
          placeholder="Search products by name or description..."
          className="prodlist-search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          disabled={loading}
        />
      </div>

      <div className="prodlist-table-wrapper-scroll">
        <table className="prodlist-table" border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Price (₹)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((prod) => (
                <tr key={prod._id}>
                  <td>{prod.product_name}</td>
                  <td>{prod.product_desc}</td>
                  <td>{prod.product_price}</td>
                  <td className="prodlist-actions-cell">
                    <Link
                      to={`/products/edit/${prod._id}`}
                      className="prodlist-btn prodlist-edit-btn"
                    >
                      Edit
                    </Link>
                    <button
                      className="prodlist-btn prodlist-delete-btn"
                      onClick={() => setDeleteId(prod._id)}
                      disabled={loading}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="prodlist-no-data">
                  No products found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Confirmation Modal */}
      {deleteId && (
        <div className="prodlist-modal-overlay">
          <div className="prodlist-modal">
            <p>Are you sure you want to delete this product?</p>
            <div className="prodlist-modal-buttons">
              <button
                className="prodlist-btn prodlist-confirm-btn"
                onClick={handleDelete}
                disabled={loading}
              >
                {loading ? "Deleting..." : "Yes, Delete"}
              </button>
              <button
                className="prodlist-btn prodlist-cancel-btn"
                onClick={() => setDeleteId(null)}
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;
