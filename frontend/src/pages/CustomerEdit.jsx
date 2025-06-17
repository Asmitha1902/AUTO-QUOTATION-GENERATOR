import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const CustomerEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [message, setMessage] = useState(null);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:5000/api/customers/${id}`)
      .then((res) => res.json())
      .then((data) => setCustomer(data))
      .catch((err) => {
        console.error("Error fetching customer:", err);
        setMessage("❌ Failed to load customer data.");
        setIsError(true);
      });
  }, [id]);

  const handleChange = (e) => {
    setCustomer({ ...customer, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage(null);

    fetch(`http://localhost:5000/api/customers/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(customer),
    })
      .then((res) => res.json())
      .then(() => {
        setMessage("✅ Customer updated successfully!");
        setIsError(false);
        setTimeout(() => navigate("/customers"), 1000);
      })
      .catch((err) => {
        console.error("Error updating customer:", err);
        setMessage("❌ Failed to update customer.");
        setIsError(true);
      });
  };

  const renderInput = (name, label, type = "text") => (
    <div className="form-floating mb-3" key={name}>
      <input
        type={type}
        className="form-control"
        id={name}
        name={name}
        value={customer[name] || ""}
        onChange={handleChange}
        placeholder={label}
        required
      />
      <label htmlFor={name}>{label}</label>
    </div>
  );

  if (!customer)
    return <div className="text-center mt-5">Loading customer data...</div>;

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">Edit Customer</h2>

      {message && (
        <div
          className={`alert ${isError ? "alert-danger" : "alert-success"}`}
          role="alert"
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div className="row">
          {/* Customer Info */}
          <div className="col-md-6 mb-4">
            <div className="card shadow-sm rounded">
              <div className="card-header bg-primary text-white">
                Customer Information
              </div>
              <div className="card-body">
                {renderInput("customer_name", "Full Name")}
                {renderInput("customer_email", "Email", "email")}
                {renderInput("customer_phone", "Phone Number")}
                {renderInput("customer_address_1", "Address Line 1")}
                {renderInput("customer_address_2", "Address Line 2")}
                {renderInput("customer_town", "Town/City")}
                {renderInput("customer_county", "County")}
                {renderInput("customer_pincode", "Pincode")}
              </div>
            </div>
          </div>

          {/* Shipping Info */}
          <div className="col-md-6 mb-4">
            <div className="card shadow-sm rounded">
              <div className="card-header bg-secondary text-white">
                Shipping Information
              </div>
              <div className="card-body">
                {renderInput("customer_name_ship", "Full Name")}
                {renderInput("customer_address_1_ship", "Address Line 1")}
                {renderInput("customer_address_2_ship", "Address Line 2")}
                {renderInput("customer_town_ship", "Town/City")}
                {renderInput("customer_county_ship", "County")}
                {renderInput("customer_pincode_ship", "Pincode")}
              </div>
            </div>
          </div>
        </div>

        <div className="text-end">
          <button type="submit" className="btn btn-success px-4 py-2 me-2">
            Update Customer
          </button>
          <button
            type="button"
            className="btn btn-secondary px-4 py-2"
            onClick={() => navigate("/customers")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CustomerEdit;
