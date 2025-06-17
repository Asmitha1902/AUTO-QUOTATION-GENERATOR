import React, { useState } from 'react';

const CustomerAdd = () => {
  const initialFormData = {
    customer_name: '',
    customer_email: '',
    customer_address_1: '',
    customer_address_2: '',
    customer_town: '',
    customer_county: '',
    customer_pincode: '',
    customer_phone: '',
    customer_name_ship: '',
    customer_address_1_ship: '',
    customer_address_2_ship: '',
    customer_town_ship: '',
    customer_county_ship: '',
    customer_pincode_ship: ''
  };

  const [formData, setFormData] = useState(initialFormData);
  const [message, setMessage] = useState(null);
  const [isError, setIsError] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validateForm = () => {
    const requiredFields = [
      'customer_name', 'customer_email', 'customer_address_1',
      'customer_town', 'customer_county', 'customer_pincode', 'customer_phone'
    ];

    // Check for missing fields
    for (const field of requiredFields) {
      if (!formData[field]) {
        setMessage('❌ Please fill all required fields.');
        setIsError(true);
        return false;
      }
    }

    // Email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.customer_email)) {
      setMessage('❌ Please enter a valid email address.');
      setIsError(true);
      return false;
    }

    // Phone number format check
    const phoneRegex = /^\d{7,15}$/;
    if (!phoneRegex.test(formData.customer_phone)) {
      setMessage('❌ Please enter a valid phone number (digits only).');
      setIsError(true);
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (!validateForm()) return;

    try {
      const response = await fetch('http://localhost:5000/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('✅ Customer added successfully!');
        setIsError(false);
        setFormData(initialFormData);
      } else {
        setMessage(`❌ Failed to add customer: ${data.message || 'Unknown error'}`);
        setIsError(true);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setMessage('❌ An error occurred while adding the customer.');
      setIsError(true);
    }
  };

  const renderInput = (name, label, type = 'text') => (
    <div className="form-floating mb-3" key={name}>
      <input
        type={type}
        className="form-control"
        id={name}
        name={name}
        value={formData[name]}
        onChange={handleChange}
        placeholder={label}
        required
      />
      <label htmlFor={name}>{label}</label>
    </div>
  );

  return (
    <div className="container mt-5">
      <h2 className="mb-4 text-center">Add New Customer</h2>

      {message && (
        <div className={`alert ${isError ? 'alert-danger' : 'alert-success'}`} role="alert">
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
                {renderInput('customer_name', 'Full Name')}
                {renderInput('customer_email', 'Email', 'email')}
                {renderInput('customer_address_1', 'Address Line 1')}
                {renderInput('customer_address_2', 'Address Line 2')}
                {renderInput('customer_town', 'Town/City')}
                {renderInput('customer_county', 'Country')}
                {renderInput('customer_pincode', 'Pincode')}
                {renderInput('customer_phone', 'Phone Number')}
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
                {renderInput('customer_name_ship', 'Full Name')}
                {renderInput('customer_address_1_ship', 'Address Line 1')}
                {renderInput('customer_address_2_ship', 'Address Line 2')}
                {renderInput('customer_town_ship', 'Town/City')}
                {renderInput('customer_county_ship', 'Country')}
                {renderInput('customer_pincode_ship', 'Pincode')}
              </div>
            </div>
          </div>
        </div>

        <div className="text-end">
          <button type="submit" className="btn btn-success px-4 py-2">
            <i className="bi bi-person-plus-fill me-2"></i>Add Customer
          </button>
        </div>
      </form>
    </div>
  );
};

export default CustomerAdd;
