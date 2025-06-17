
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import axios from "../api/axiosInstance";
import {
  Card,
  Table,
  Button,
  Input,
  Spinner,
  Row,
  Col,
} from "reactstrap";
import "./CustomerList.css";

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
  const [deleteId, setDeleteId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const fromInvoiceCreate = location.state?.fromInvoiceCreate || false;

  // Fetch customers from API
  const fetchCustomers = async () => {
    try {
      const response = await axios.get("/api/customers");
      setCustomers(response.data);
      setMessage({ text: "", type: "" });
    } catch (error) {
      console.error("Error fetching customers", error);
      setMessage({ text: "❌ Failed to fetch customers", type: "error" });
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // Handle deletion
  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      setLoading(true);
      const res = await axios.delete(`/api/customers/${deleteId}`);
      if (res.status === 200) {
        setMessage({ text: "✅ Customer deleted", type: "success" });
        await fetchCustomers();
      } else {
        setMessage({ text: "❌ Failed to delete", type: "error" });
      }
    } catch (err) {
      console.error(err);
      setMessage({ text: "❌ Error deleting customer", type: "error" });
    } finally {
      setDeleteId(null);
      setLoading(false);
    }
  };

  // UPDATED: Handle select customer (from InvoiceCreate)
  const handleSelectCustomer = (customer) => {
    if (fromInvoiceCreate) {
      // Navigate back to InvoiceCreate page with selected customer in state
      navigate("/create-invoice", {
        state: { selectedCustomer: customer },
      });
    }
  };

  // Filter customers by search term
  const filteredCustomers = customers.filter((cust) =>
    (cust.customer_name || cust.name || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase()) ||
    (cust.customer_email || cust.email || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase()) ||
    (cust.customer_phone || cust.phone || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const colsCount = fromInvoiceCreate ? 4 : 5;

  return (
    <div className={`custlst-container ${darkMode ? "custlst-dark" : ""}`}>
      <Card body className="shadow-sm mb-4">
        <Row className="align-items-center">
          <Col md="6">
            <h4 className="custlst-title mb-0">Customer List</h4>
          </Col>
          <Col md="6" className="text-md-end mt-2 mt-md-0">
            <Button
              color="secondary"
              onClick={() => setDarkMode((prev) => !prev)}
              aria-pressed={darkMode}
              aria-label="Toggle dark mode"
            >
              {darkMode ? "Light Mode" : "Dark Mode"}
            </Button>
          </Col>
        </Row>
      </Card>

      {message.text && (
        <p
          className={`custlst-message ${
            message.type === "success" ? "custlst-success" : "custlst-error"
          }`}
          role="alert"
        >
          {message.text}
        </p>
      )}

      <Card body className="shadow-sm">
        <Row className="mb-3">
          <Col md="6">
            <Input
              type="text"
              placeholder="Search customers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              disabled={loading}
              aria-label="Search customers"
              autoComplete="off"
            />
          </Col>
        </Row>

        <div className="custlst-table-wrapper-scroll">
          <Table responsive hover>
            <thead className="table-dark">
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>{fromInvoiceCreate ? "Select" : "Actions"}</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((cust) => (
                  <tr key={cust._id}>
                    <td>{cust.customer_name || cust.name}</td>
                    <td>{cust.customer_email || cust.email}</td>
                    <td>{cust.customer_phone || cust.phone}</td>
                    <td>
                      {fromInvoiceCreate ? (
                        <Button
                          color="primary"
                          size="sm"
                          onClick={() => handleSelectCustomer(cust)}
                          aria-label={`Select customer ${cust.customer_name || cust.name}`}
                        >
                          Select
                        </Button>
                      ) : (
                        <>
                          <Link
                            to={`/customers/edit/${cust._id}`}
                            className="custlst-btn custlst-edit-btn btn btn-sm btn-primary me-2"
                            aria-label={`Edit customer ${cust.customer_name || cust.name}`}
                          >
                            Edit
                          </Link>
                          <Button
                            color="danger"
                            size="sm"
                            onClick={() => setDeleteId(cust._id)}
                            disabled={loading}
                            aria-label={`Delete customer ${cust.customer_name || cust.name}`}
                          >
                            Delete
                          </Button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={colsCount} className="text-center">
                    No customers found
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      </Card>

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div
          className="custlst-modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modalTitle"
          tabIndex={-1}
        >
          <div className="custlst-modal">
            <p id="modalTitle">Are you sure you want to delete this customer?</p>
            <div className="custlst-modal-buttons">
              <Button
                color="danger"
                onClick={handleDelete}
                disabled={loading}
                aria-label="Confirm delete"
              >
                {loading ? <Spinner size="sm" /> : "Yes, Delete"}
              </Button>
              <Button
                color="secondary"
                onClick={() => setDeleteId(null)}
                disabled={loading}
                aria-label="Cancel delete"
                className="ms-2"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerList;
