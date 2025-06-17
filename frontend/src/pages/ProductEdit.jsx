import React, { useEffect, useState } from "react";
import axios from "../api/axiosInstance";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";

const ProductEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    product_name: "",
    product_desc: "",
    product_price: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchProduct = async () => {
    try {
      const res = await axios.get(`/api/products/${id}`);

      // Adjust depending on your API response structure
      // e.g. if API returns { success: true, product: {...} }
      const product = res.data.product || res.data;

      setFormData({
        product_name: product.product_name || "",
        product_desc: product.product_desc || "",
        product_price: product.product_price !== undefined ? String(product.product_price) : "",
      });
      setLoading(false);
    } catch (err) {
      console.error("Error fetching product:", err);
      setError("Failed to fetch product details.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const isFormValid = () =>
    formData.product_name.trim() !== "" &&
    formData.product_price !== "" &&
    !isNaN(parseFloat(formData.product_price));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      await axios.put(`/api/products/${id}`, {
        ...formData,
        product_price: parseFloat(formData.product_price), // convert to number before sending
      });
      setMessage("✅ Product updated successfully.");
      setTimeout(() => navigate("/products"), 1000);
    } catch (err) {
      console.error("Error updating product:", err);
      setError("❌ Failed to update product. Please try again.");
    }
  };

  if (loading) return <p>Loading product details...</p>;

  return (
    <motion.div
      className="container mt-5"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="card shadow-lg border-0 rounded-4">
        <div className="card-header bg-warning text-dark rounded-top-4">
          <h4 className="mb-0 fw-bold">✏️ Edit Product</h4>
        </div>
        <div className="card-body">
          {message && (
            <div className="alert alert-success" role="alert">
              {message}
            </div>
          )}
          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-floating mb-4">
              <input
                type="text"
                name="product_name"
                value={formData.product_name}
                onChange={handleChange}
                className="form-control"
                id="product_name"
                placeholder="Product Name"
                required
              />
              <label htmlFor="product_name">Product Name *</label>
            </div>

            <div className="form-floating mb-4">
              <input
                type="text"
                name="product_desc"
                value={formData.product_desc}
                onChange={handleChange}
                className="form-control"
                id="product_desc"
                placeholder="Product Description"
              />
              <label htmlFor="product_desc">Product Description</label>
            </div>

            <div className="form-floating mb-4">
              <input
                type="number"
                name="product_price"
                value={formData.product_price}
                onChange={handleChange}
                className="form-control"
                id="product_price"
                placeholder="Price"
                required
                step="0.01"
                min="0"
              />
              <label htmlFor="product_price">Price (₹) *</label>
            </div>

            <div className="d-flex justify-content-end">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={!isFormValid()}
                className={`btn ${
                  isFormValid() ? "btn-warning" : "btn-secondary disabled"
                } px-4 py-2 rounded-pill fw-semibold`}
              >
                💾 Update Product
              </motion.button>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductEdit;
