// src/Layout/MainLayout.jsx
import React from "react";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";



const MainLayout = () => {
  return (
    <div className="d-flex">
      <div style={{ width: "250px", height: "100vh", position: "fixed" }}>
        <Sidebar />
      </div>
      <div style={{ marginLeft: "250px", padding: "20px", flex: 1 }}>
        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
