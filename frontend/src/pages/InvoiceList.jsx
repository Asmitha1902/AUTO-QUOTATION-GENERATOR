import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { generatePDF } from "../pages/pdfGenerator";


const InvoiceList = () => {
  const [invoices, setInvoices] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [entries, setEntries] = useState(10);
  const [statusFilter, setStatusFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const location = useLocation();

  const rowsPerPage = parseInt(entries, 10);

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    if (isNaN(date)) return '-';
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const statusMap = {
    All: null,
    paid: 'Paid',
    unpaid: 'Open',
    overdue: 'Overdue',
  };

  useEffect(() => {
    axios.get('http://localhost:5000/api/invoices')
      .then(res => {
        setInvoices(res.data);
        filterData(searchTerm, statusFilter, res.data);
      })
      .catch(() => alert('Failed to fetch quotations'));
  }, [location]);

  useEffect(() => {
    setCurrentPage(1);
  }, [entries]);

  const filterData = (term, status, data = invoices) => {
    const lowerTerm = term.toLowerCase();
    let result = data.filter(inv =>
      (inv.customer?.customer_name || '').toLowerCase().includes(lowerTerm) ||
      (inv.invoice_number || '').toLowerCase().includes(lowerTerm)
    );

    if (status !== 'All' && statusMap[status]) {
      result = result.filter(inv => inv.status === statusMap[status]);
    }

    setFiltered(result);
    setCurrentPage(1);
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    filterData(value, statusFilter);
  };

  const handleStatusFilter = (e) => {
    const value = e.target.value;
    setStatusFilter(value);
    filterData(searchTerm, value);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this quotation?')) {
      axios.delete(`http://localhost:5000/api/invoices/${id}`)
        .then(() => {
          const updatedInvoices = invoices.filter(inv => inv._id !== id);
          setInvoices(updatedInvoices);
          const updatedFiltered = filtered.filter(inv => inv._id !== id);
          setFiltered(updatedFiltered);
        })
        .catch(() => alert('Failed to delete quotation'));
    }
  };

  const indexOfLast = currentPage * rowsPerPage;
  const indexOfFirst = indexOfLast - rowsPerPage;
  const currentInvoices = filtered.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filtered.length / rowsPerPage);

  return (
    <div className="container-fluid mt-3">
      <div className="card shadow border-0">
        <div className="card-header bg-light">
          <h5 className="mb-0">Quotation List</h5>
        </div>
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div className="d-flex align-items-center">
              <label className="me-2">Show</label>
              <select
                className="form-select form-select-sm w-auto"
                value={entries}
                onChange={e => setEntries(e.target.value)}
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
              </select>
              <label className="ms-2">entries</label>
            </div>

            <input
              type="text"
              className="form-control form-control-sm w-25"
              placeholder="Search by quotation or customer"
              value={searchTerm}
              onChange={handleSearch}
            />

            <select
              className="form-select form-select-sm w-auto ms-3"
              value={statusFilter}
              onChange={handleStatusFilter}
            >
              <option value="All">All</option>
              <option value="paid">Paid</option>
              <option value="unpaid">Unpaid</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>

          <div className="table-responsive">
            <table className="table table-bordered table-striped table-hover">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>Quotation</th>
                  <th>Customer</th>
                  <th>Issue Date</th>
                  <th>Due Date</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentInvoices.length > 0 ? (
                  currentInvoices.map((invoice, index) => (
                    <tr key={invoice._id}>
                      <td>{indexOfFirst + index + 1}</td>
                      <td>{invoice.invoice_number}</td>
                      <td>{invoice.customer?.customer_name || 'N/A'}</td>
                      <td>{formatDate(invoice.invoice_date)}</td>
                      <td>{formatDate(invoice.due_date)}</td>
                      <td>{invoice.type}</td>
                      <td>
                        <span className={`badge ${
                          invoice.status === 'Paid'
                            ? 'bg-success'
                            : invoice.status === 'Overdue'
                            ? 'bg-danger'
                            : 'bg-info text-dark'
                        }`}>
                          {invoice.status}
                        </span>
                      </td>
                      <td className="text-center">
                        <div className="btn-group btn-group-sm">
                          
                          <button
                            className="btn btn-warning"
                            onClick={() => navigate(`/invoices/edit/${invoice._id}`)}
                            title="Edit"
                          >
                            <i className="bi bi-pencil-square"></i>
                          </button>
                          <button
                            className="btn btn-danger"
                            onClick={() => handleDelete(invoice._id)}
                            title="Delete"
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                          <button
  className="btn btn-success"
  title="Download PDF"
  onClick={() => generatePDF(invoice)}
>
  <i className="bi bi-file-earmark-pdf"></i>
</button>

  


                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center">No quotation found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="d-flex justify-content-between align-items-center">
            <span>
              Showing {filtered.length === 0 ? 0 : indexOfFirst + 1} to {Math.min(indexOfLast, filtered.length)} of {filtered.length} entries
            </span>
            <div>
              <button
                className="btn btn-outline-secondary btn-sm me-2"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => prev - 1)}
              >
                Previous
              </button>
              <button
                className="btn btn-outline-secondary btn-sm"
                disabled={currentPage === totalPages || totalPages === 0}
                onClick={() => setCurrentPage(prev => prev + 1)}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceList;
