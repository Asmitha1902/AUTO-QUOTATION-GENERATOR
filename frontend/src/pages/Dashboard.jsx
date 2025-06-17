import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";

const Dashboard = () => {
  const [stats, setStats] = useState({
    salesTotal: 0,
    invoiceCount: 0,
    pendingBills: 0,
    dueAmount: 0,
    productCount: 0,
    customerCount: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [
          salesRes,
          invoiceRes,
          pendingRes,
          dueRes,
          productRes,
          customerRes,
        ] = await Promise.all([
          axiosInstance.get("/api/dashboard/sales-amount"),
          axiosInstance.get("/api/dashboard/invoice-count"),
          axiosInstance.get("/api/dashboard/pending-count"),
          axiosInstance.get("/api/dashboard/total-due"),
          axiosInstance.get("/api/dashboard/product-count"),
          axiosInstance.get("/api/dashboard/customer-count"),
        ]);

        setStats({
          salesTotal: salesRes.data.totalSales,

          invoiceCount: invoiceRes.data.total,
          pendingBills: pendingRes.data.total,
          dueAmount: dueRes.data.total,
          productCount: productRes.data.total,
          customerCount: customerRes.data.total,
        });
      } catch (err) {
        console.error("Error loading dashboard stats:", err);
      }
    };

    fetchStats();
  }, []);

  const cardData = [
    {
      title: "Sales Amount",
      value: stats.salesTotal,
      icon: "bi-currency-rupee",
      color: "bg-success text-white",
    },
    {
      title: "Total Quotations",
      value: stats.invoiceCount,
      icon: "bi-printer",
      color: "bg-primary text-white",
    },
    {
      title: "Pending Bills",
      value: stats.pendingBills,
      icon: "bi-hourglass-split",
      color: "bg-warning text-dark",
    },
    {
      title: "Due Amount",
      value: stats.dueAmount,
      icon: "bi-exclamation-triangle-fill",
      color: "bg-danger text-white",
    },
    {
      title: "Total Products",
      value: stats.productCount,
      icon: "bi-box",
      color: "bg-info text-white",
    },
    {
      title: "Total Customers",
      value: stats.customerCount,
      icon: "bi-people-fill",
      color: "bg-pink text-success"

    },
  ];

  return (
    <div className="container-fluid mt-4">
      <h3 className="mb-4 fw-bold text-success">Auto Quotation Generator</h3>
      <div className="row g-4">
        {cardData.map((card, idx) => (
          <div className="col-md-6 col-lg-3" key={idx}>
            <div className={`card ${card.color} shadow h-100`}>
              <div className="card-body d-flex align-items-center justify-content-between">
                <div>
                  <h2 className="fw-bold">{card.value}</h2>
                  <p className="mb-0">{card.title}</p>
                </div>
                <i className={`bi ${card.icon} fs-1`}></i>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;