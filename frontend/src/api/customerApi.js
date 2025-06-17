import axios from 'axios';

// Update this if your backend runs on a different host or port
const API_BASE_URL = 'http://localhost:5000/api/customers';

// ✅ Create a new customer
export const createCustomer = async (customerData) => {
  try {
    const response = await axios.post(API_BASE_URL, customerData);
    return {
      success: true,
      data: response.data,
      message: 'Customer created successfully',
    };
  } catch (error) {
    console.error('Error creating customer:', error);
    return {
      success: false,
      message: error.response?.data?.message || 'Failed to create customer',
    };
  }
};

// ✅ Get all customers
export const getAllCustomers = async () => {
  try {
    const response = await axios.get(API_BASE_URL);
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Error fetching customers:', error);
    return {
      success: false,
      message: 'Failed to fetch customers'
    };
  }
};

// ✅ Get a customer by ID
export const getCustomerById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${id}`);
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    console.error('Error fetching customer:', error);
    return {
      success: false,
      message: 'Failed to fetch customer'
    };
  }
};

// ✅ Update an existing customer
export const updateCustomer = async (id, customerData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/${id}`, customerData);
    return {
      success: true,
      data: response.data,
      message: 'Customer updated successfully'
    };
  } catch (error) {
    console.error('Error updating customer:', error);
    return {
      success: false,
      message: 'Failed to update customer'
    };
  }
};

// ✅ Delete a customer
export const deleteCustomer = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/${id}`);
    return {
      success: true,
      data: response.data,
      message: 'Customer deleted successfully'
    };
  } catch (error) {
    console.error('Error deleting customer:', error);
    return {
      success: false,
      message: 'Failed to delete customer'
    };
  }
};
