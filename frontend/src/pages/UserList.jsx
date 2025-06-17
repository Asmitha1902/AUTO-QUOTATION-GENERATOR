import React, { useEffect, useState } from "react";
import axios from "../api/axiosInstance";
import { Link } from "react-router-dom";
import "./UserList.css";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  // Fetch users
  const fetchUsers = async () => {
    try {
      const res = await axios.get("/api/users");
      if (res.data.success) {
        setUsers(res.data.users);
        setMessage("");
      } else {
        setUsers([]);
        setMessage("❌ Failed to load users");
      }
    } catch (error) {
      console.error(error);
      setMessage("❌ Error fetching users");
      setUsers([]);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Delete user handler
  const handleDelete = async () => {
    if (!deleteId) return;
    setLoading(true);
    try {
      const res = await axios.delete(`/api/users/${deleteId}`);
      if (res.status === 200) {
        setMessage("✅ User deleted successfully");
        await fetchUsers();
      } else {
        setMessage("❌ Failed to delete user");
      }
    } catch (error) {
      console.error(error);
      setMessage("❌ Error deleting user");
    } finally {
      setDeleteId(null);
      setLoading(false);
    }
  };

  // Filter users by name, username, or email (case-insensitive)
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Dark mode toggle (optional)
  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  return (
    <div className={`userlist-container ${darkMode ? "userlist-dark" : ""}`}>
      <div className="userlist-header-actions">
        <h2 className="userlist-title">User List</h2>
        <button className="userlist-toggle-darkmode-btn" onClick={toggleDarkMode}>
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>
      </div>

      {message && (
        <p className={`userlist-message ${message.includes("❌") ? "userlist-error" : "userlist-success"}`}>
          {message}
        </p>
      )}

      <div className="userlist-search-wrapper">
        <input
          type="text"
          placeholder="Search users by name, username, or email..."
          className="userlist-search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          disabled={loading}
        />
      </div>

      <div className="userlist-table-wrapper-scroll">
        <table className="userlist-table" border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Name</th>
              <th>Username</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                  <td className="userlist-actions-cell">
                    <Link
                      to={`/users/edit/${user._id}`}
                      className="userlist-btn userlist-edit-btn"
                    >
                      Edit
                    </Link>
                    <button
                      className="userlist-btn userlist-delete-btn"
                      onClick={() => setDeleteId(user._id)}
                      disabled={loading}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="userlist-no-data">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Confirmation Modal */}
      {deleteId && (
        <div className="userlist-modal-overlay">
          <div className="userlist-modal">
            <p>Are you sure you want to delete this user?</p>
            <div className="userlist-modal-buttons">
              <button
                className="userlist-btn userlist-confirm-btn"
                onClick={handleDelete}
                disabled={loading}
              >
                {loading ? "Deleting..." : "Yes, Delete"}
              </button>
              <button
                className="userlist-btn userlist-cancel-btn"
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

export default UserList;
