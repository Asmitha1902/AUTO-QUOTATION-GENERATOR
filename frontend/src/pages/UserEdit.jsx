import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../api/axiosInstance";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UserEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // user ID from route params

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    password: "",
  });

  const [passwordStrength, setPasswordStrength] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch user data to edit
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`/api/users/${id}`);
        if (response.data && response.data.user) {
          setFormData({
            name: response.data.user.name || "",
            username: response.data.user.username || "",
            email: response.data.user.email || "",
            phone: response.data.user.phone || "",
            password: "", // leave password empty for security
          });
        } else {
          toast.error("User data not found.", { autoClose: 3000 });
        }
      } catch (err) {
        toast.error("❌ Failed to fetch user data.", { autoClose: 3000 });
      }
    };
    fetchUserData();
  }, [id]);

  const getPasswordStrength = (password) => {
    if (password.length < 6) return "Weak";
    if (
      password.match(/[A-Z]/) &&
      password.match(/[0-9]/) &&
      password.length >= 8
    ) {
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

    // Prepare payload, exclude password if empty to avoid overwriting
    const payload = { ...formData };
    if (!payload.password) delete payload.password;

    setLoading(true);
    try {
      await axios.put(`/api/users/${id}`, payload);
      toast.success("✅ User updated successfully!", { autoClose: 2000 });
      setTimeout(() => navigate("/users"), 2200);
    } catch (err) {
      toast.error("❌ Failed to update user. Please try again.", { autoClose: 3000 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <ToastContainer />
      <div
        className="card shadow-lg rounded-4 p-5"
        style={{ maxWidth: "800px", margin: "auto" }}
      >
        <h2 className="text-center text-primary mb-4 fw-bold">✏️ Edit User</h2>

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
                />
              </div>
              {formData.password && (
                <div className="mt-2 fw-semibold">
                  {passwordStrength === "Weak" && (
                    <span className="text-danger">🔴 Weak</span>
                  )}
                  {passwordStrength === "Medium" && (
                    <span className="text-warning">🟡 Medium</span>
                  )}
                  {passwordStrength === "Strong" && (
                    <span className="text-success">🟢 Strong</span>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="text-center mt-4">
            <button
              type="submit"
              className="btn btn-primary px-4 py-2 rounded-3 fw-bold w-100"
              disabled={loading}
            >
              🛠️ {loading ? "Updating..." : "Update User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserEdit;
