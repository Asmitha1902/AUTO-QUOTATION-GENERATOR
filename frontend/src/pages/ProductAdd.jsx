import React, { useState } from "react";
import axios from "../api/axiosInstance"; // baseURL should be http://localhost:5000
import { useNavigate } from "react-router-dom";
import "./ProductAdd.css";

const ProductAdd = () => {
  const [formData, setFormData] = useState({
    product_name: "",
    product_desc: "",
    product_price: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const isFormValid = () =>
    formData.product_name.trim() !== "" &&
    formData.product_price !== "" &&
    !isNaN(parseFloat(formData.product_price));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!isFormValid()) {
      setError("Product name and a valid price are required.");
      return;
    }

    try {
      const response = await axios.post("/api/products", {
        product_name: formData.product_name.trim(),
        product_desc: formData.product_desc.trim(),
        product_price: parseFloat(formData.product_price),
      });

      if (response.status === 201) {
        setSuccess(true);
        setFormData({
          product_name: "",
          product_desc: "",
          product_price: "",
        });
        
      } else {
        throw new Error("Unexpected response status");
      }
    } catch (err) {
      console.error("❌ Product creation failed:", err);
      setError(
        err.response?.data?.message ||
          "Failed to add product. Please check backend connection or console."
      );
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-6 col-md-8">
          <div className="card border-0 shadow rounded-4 animate__animated animate__fadeIn">
            <div className="card-header bg-dark text-white text-center rounded-top-4">
              <h4 className="mb-0">
                <i className="bi bi-box-seam me-2"></i>Add New Product
              </h4>
            </div>
            <div className="card-body p-4">
              {error && (
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                  <i className="bi bi-exclamation-circle me-2"></i>{error}
                  <button type="button" className="btn-close" onClick={() => setError("")}></button>
                </div>
              )}

              {success && (
                <div className="alert alert-success animate__animated animate__fadeInDown" role="alert">
                  <i className="bi bi-check-circle-fill me-2"></i>Product added successfully!
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="form-floating mb-3">
                  <input
                    type="text"
                    className="form-control"
                    id="product_name"
                    name="product_name"
                    placeholder="Product Name"
                    value={formData.product_name}
                    onChange={handleChange}
                    required
                  />
                  <label htmlFor="product_name">Product Name *</label>
                </div>

                <div className="form-floating mb-3">
                  <input
                    type="text"
                    className="form-control"
                    id="product_desc"
                    name="product_desc"
                    placeholder="Description"
                    value={formData.product_desc}
                    onChange={handleChange}
                  />
                  <label htmlFor="product_desc">Product Description</label>
                </div>

                <div className="form-floating mb-4">
                  <input
                    type="number"
                    className="form-control"
                    id="product_price"
                    name="product_price"
                    placeholder="Price"
                    value={formData.product_price}
                    onChange={handleChange}
                    required
                  />
                  <label htmlFor="product_price">Price (₹) *</label>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100 py-2"
                  disabled={!isFormValid()}
                >
                  <i className="bi bi-save me-2"></i>Save Product
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductAdd;
