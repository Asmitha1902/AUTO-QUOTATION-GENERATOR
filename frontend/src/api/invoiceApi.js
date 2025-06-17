import axios from 'axios';

const API_BASE = '/api/invoices';       // Invoice API base URL
const API_PRODUCTS = '/api/products';   // Products API base URL
const API_CUSTOMERS = '/api/customers'; // Customers API base URL

const InvoiceApi = {
  // Get all invoices
  getAllInvoices: async () => {
    try {
      const res = await axios.get(API_BASE);
      return res.data || [];
    } catch (error) {
      console.error('Error fetching invoices:', error?.response?.data || error.message);
      throw error;
    }
  },

  // Get single invoice by ID
  getInvoiceById: async (id) => {
    if (!id) throw new Error('Invoice ID is required');
    try {
      const res = await axios.get(`${API_BASE}/${id}`);
      return res.data;
    } catch (error) {
      console.error(`Error fetching invoice with ID ${id}:`, error?.response?.data || error.message);
      throw error;
    }
  },

  // Create new invoice
  createInvoice: async (invoiceData) => {
    if (!invoiceData || !Array.isArray(invoiceData.items) || invoiceData.items.length === 0) {
      throw new Error('Invoice must include at least one item');
    }
    try {
      const res = await axios.post(API_BASE, invoiceData);
      return res.data;
    } catch (error) {
      console.error('Error creating invoice:', error?.response?.data || error.message);
      throw error;
    }
  },

  // Update invoice by ID
  updateInvoice: async (id, updatedData) => {
    if (!id) throw new Error('Invoice ID is required');
    if (!updatedData) throw new Error('Updated data is required');
    try {
      const res = await axios.put(`${API_BASE}/${id}`, updatedData);
      return res.data;
    } catch (error) {
      console.error(`Error updating invoice with ID ${id}:`, error?.response?.data || error.message);
      throw error;
    }
  },

  // Delete invoice by ID
  deleteInvoice: async (id) => {
    if (!id) throw new Error('Invoice ID is required');
    try {
      const res = await axios.delete(`${API_BASE}/${id}`);
      return res.data;
    } catch (error) {
      console.error(`Error deleting invoice with ID ${id}:`, error?.response?.data || error.message);
      throw error;
    }
  },

  // Fetch next invoice ID (optional, if backend supports)
  fetchInvoiceId: async () => {
    try {
      const res = await axios.get(`${API_BASE}/id`);
      return res.data.invoice_id;
    } catch (error) {
      console.error('Error fetching next invoice ID:', error?.response?.data || error.message);
      throw error;
    }
  },

  // Fetch all products
  fetchProducts: async () => {
    try {
      const res = await axios.get(API_PRODUCTS);
      return Array.isArray(res.data.products) ? res.data.products : res.data || [];
    } catch (error) {
      console.error('Error fetching products:', error?.response?.data || error.message);
      throw error;
    }
  },

  // Fetch all customers
  fetchCustomers: async () => {
    try {
      const res = await axios.get(API_CUSTOMERS);
      return Array.isArray(res.data.customers) ? res.data.customers : res.data || [];
    } catch (error) {
      console.error('Error fetching customers:', error?.response?.data || error.message);
      throw error;
    }
  }
};

export default InvoiceApi;
