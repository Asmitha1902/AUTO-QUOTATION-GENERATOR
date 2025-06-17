import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Layout
import MainLayout from "./Layout/MainLayout";

// Pages
import Dashboard from "./pages/Dashboard";
import ProductList from "./pages/ProductList";
import ProductAdd from "./pages/ProductAdd";
import ProductEdit from "./pages/ProductEdit";
import CustomerList from "./pages/CustomerList";
import CustomerAdd from "./pages/CustomerAdd";
import CustomerEdit from "./pages/CustomerEdit";
import InvoiceCreate from "./pages/InvoiceCreate";
import InvoiceEdit from "./pages/InvoiceEdit";
import InvoiceList from "./pages/InvoiceList";
import UserList from "./pages/UserList";
import UserAdd from "./pages/UserAdd";
import UserEdit from "./pages/UserEdit";

function App() {
  return (
    <Router>
      <Routes>
        {/* Wrap all routes inside MainLayout */}
        <Route path="/" element={<MainLayout />}>
          {/* Index route for '/' to render Dashboard */}
          <Route index element={<Dashboard />} />

          <Route path="dashboard" element={<Dashboard />} />
          <Route path="products" element={<ProductList />} />
          <Route path="add-product" element={<ProductAdd />} />
          <Route path="products/edit/:id" element={<ProductEdit />} />
          <Route path="customers" element={<CustomerList />} />
          <Route path="add-customer" element={<CustomerAdd />} />
          <Route path="customers/edit/:id" element={<CustomerEdit />} />
          <Route path="users" element={<UserList />} />
          <Route path="add-user" element={<UserAdd />} />
          <Route path="users/edit/:id" element={<UserEdit />} />
          <Route path="invoices" element={<InvoiceList />} />
          <Route path="create-invoice" element={<InvoiceCreate />} />
          <Route path="invoices/edit/:id" element={<InvoiceEdit />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
