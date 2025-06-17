// src/components/Sidebar.jsx
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "bootstrap/dist/js/bootstrap.bundle.min";

const Sidebar = () => {
  const [openMenu, setOpenMenu] = useState("");

  const toggleMenu = (menuId) => {
    setOpenMenu(openMenu === menuId ? "" : menuId);
  };

  const isOpen = (menuId) => openMenu === menuId;

  return (
    <div
      className="bg-dark text-white p-3 vh-100"
      style={{ width: "250px", position: "fixed", top: 0, left: 0 }}
    >
      <h4 className="text-center mb-4">Auto Quotation Generator</h4>
      <ul className="nav flex-column">

        {/* Dashboard */}
        <li className="nav-item mb-2">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `nav-link d-flex justify-content-between align-items-center ${
                isActive ? "bg-primary text-white rounded px-2 py-1" : "text-white"
              }`
            }
          >
            🏠 Dashboard
          </NavLink>
        </li>

        {/* Invoices */}
        <li className="nav-item mb-2">
          <button
            className="nav-link text-white d-flex justify-content-between w-100 bg-transparent border-0"
            onClick={() => toggleMenu("invoice")}
          >
            <span>📄 Quotations</span>
            <span className="arrow">{isOpen("invoice") ? "▼" : "▸"}</span>
          </button>
          {isOpen("invoice") && (
            <ul className="nav flex-column ms-3">
              <li>
                <NavLink to="/create-invoice" className="nav-link text-white">➕ Create Quotation</NavLink>
              </li>
              <li>
                <NavLink to="/invoices" className="nav-link text-white">🗂️ Manage Quotations</NavLink>
              </li>
            </ul>
          )}
        </li>

        {/* Products */}
        <li className="nav-item mb-2">
          <button
            className="nav-link text-white d-flex justify-content-between w-100 bg-transparent border-0"
            onClick={() => toggleMenu("product")}
          >
            <span>📦 Products</span>
            <span className="arrow">{isOpen("product") ? "▼" : "▸"}</span>
          </button>
          {isOpen("product") && (
            <ul className="nav flex-column ms-3">
              <li>
                <NavLink to="/add-product" className="nav-link text-white">➕ Add Product</NavLink>
              </li>
              <li>
                <NavLink to="/products" className="nav-link text-white">🗂️ Manage Products</NavLink>
              </li>
            </ul>
          )}
        </li>

        {/* Customers */}
        <li className="nav-item mb-2">
          <button
            className="nav-link text-white d-flex justify-content-between w-100 bg-transparent border-0"
            onClick={() => toggleMenu("customer")}
          >
            <span>👥 Customers</span>
            <span className="arrow">{isOpen("customer") ? "▼" : "▸"}</span>
          </button>
          {isOpen("customer") && (
            <ul className="nav flex-column ms-3">
              <li>
                <NavLink to="/add-customer" className="nav-link text-white">➕ Add Customer</NavLink>
              </li>
              <li>
                <NavLink to="/customers" className="nav-link text-white">🗂️ Manage Customers</NavLink>
              </li>
            </ul>
          )}
        </li>

        {/* Users */}
        <li className="nav-item mb-2">
          <button
            className="nav-link text-white d-flex justify-content-between w-100 bg-transparent border-0"
            onClick={() => toggleMenu("user")}
          >
            <span>🧑‍💼 Users</span>
            <span className="arrow">{isOpen("user") ? "▼" : "▸"}</span>
          </button>
          {isOpen("user") && (
            <ul className="nav flex-column ms-3">
              <li>
                <NavLink to="/add-user" className="nav-link text-white">➕ Add User</NavLink>
              </li>
              <li>
                <NavLink to="/users" className="nav-link text-white">🗂️ Manage Users</NavLink>
              </li>
            </ul>
          )}
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
