import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axiosInstance";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UserAdd = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    password: "",
  });

  const [passwordStrength, setPasswordStrength] = useState("");

  const getPasswordStrength = (password) => {
    if (password.length < 6) return "Weak";
    if (/[A-Z]/.test(password) && /[0-9]/.test(password) && password.length >= 8) {
      return "Strong";
    }
    return "Medium";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "password") {
      setPasswordStrength(getPasswordStrength(value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, username, email, password } = formData;
    if (!name || !username || !email || !password) {
      toast.warning("⚠️ Please fill out all required fields.");
      return;
    }

    try {
      const response = await axios.post("/api/users", formData);

      toast.success("✅ User added successfully!", { autoClose: 2000 });
      setTimeout(() => navigate("/users"), 2200);
    } catch (err) {
      const message = err.response?.data?.message || "Failed to add user.";
      toast.error(`❌ ${message}`, { autoClose: 3000 });
    }
  };

  return (
    <div className="container py-5">
      <ToastContainer />
      <div className="card shadow-lg rounded-4 p-5" style={{ maxWidth: "800px", margin: "auto" }}>
        <h2 className="text-center text-primary mb-4 fw-bold">➕ Add New User</h2>
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Full Name</label>
              <div className="input-group">
                <span className="input-group-text bg-light">
                  <i className="bi bi-person-fill"></i>
                </span>
                <input
                  type="text"
                  name="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  className="form-control shadow-sm rounded-3"
                  required
                />
              </div>
            </div>

            <div className="col-md-6">
              <label className="form-label">Username</label>
              <div className="input-group">
                <span className="input-group-text bg-light">
                  <i className="bi bi-person-circle"></i>
                </span>
                <input
                  type="text"
                  name="username"
                  placeholder="johndoe123"
                  value={formData.username}
                  onChange={handleChange}
                  className="form-control shadow-sm rounded-3"
                  required
                />
              </div>
            </div>

            <div className="col-md-6">
              <label className="form-label">Email</label>
              <div className="input-group">
                <span className="input-group-text bg-light">
                  <i className="bi bi-envelope-fill"></i>
                </span>
                <input
                  type="email"
                  name="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="form-control shadow-sm rounded-3"
                  required
                />
              </div>
            </div>

            <div className="col-md-6">
              <label className="form-label">Phone</label>
              <div className="input-group">
                <span className="input-group-text bg-light">
                  <i className="bi bi-telephone-fill"></i>
                </span>
                <input
                  type="text"
                  name="phone"
                  placeholder="9876543210"
                  value={formData.phone}
                  onChange={handleChange}
                  className="form-control shadow-sm rounded-3"
                />
              </div>
            </div>

            <div className="col-md-12">
              <label className="form-label">Password</label>
              <div className="input-group">
                <span className="input-group-text bg-light">
                  <i className="bi bi-lock-fill"></i>
                </span>
                <input
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="form-control shadow-sm rounded-3"
                  required
                />
              </div>
              {formData.password && (
                <div className="mt-2 fw-semibold">
                  {passwordStrength === "Weak" && <span className="text-danger">🔴 Weak</span>}
                  {passwordStrength === "Medium" && <span className="text-warning">🟡 Medium</span>}
                  {passwordStrength === "Strong" && <span className="text-success">🟢 Strong</span>}
                </div>
              )}
            </div>
          </div>

          <div className="text-center mt-4">
            <button type="submit" className="btn btn-primary px-4 py-2 rounded-3 fw-bold w-100">
              🚀 Add User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserAdd;
