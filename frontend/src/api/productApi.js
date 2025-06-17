// src/api/productApi.js

import axios from "./axiosInstance";

const API_BASE_URL = "/api/products";

// Fetch all products
export const fetchProducts = async () => {
  try {
    const response = await axios.get(API_BASE_URL);
    return response.data.products || response.data;
  } catch (error) {
    console.error("❌ Failed to fetch products:", error);
    throw error.response?.data || { error: "Failed to fetch products" };
  }
};

// Fetch product by ID
export const getProductById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${id}`);
    return response.data.product || response.data;
  } catch (error) {
    console.error(`❌ Failed to fetch product ID ${id}:`, error);
    throw error.response?.data || { error: "Product not found" };
  }
};

// Add new product
export const addProduct = async (productData) => {
  try {
    const response = await axios.post(API_BASE_URL, productData);
    return response.data;
  } catch (error) {
    console.error("❌ Failed to add product:", error);
    throw error.response?.data || { error: "Failed to add product" };
  }
};

// Update existing product
export const updateProduct = async (id, productData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/${id}`, productData);
    return response.data;
  } catch (error) {
    console.error(`❌ Failed to update product ID ${id}:`, error);
    throw error.response?.data || { error: "Failed to update product" };
  }
};

// Delete product
export const deleteProduct = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`❌ Failed to delete product ID ${id}:`, error);
    throw error.response?.data || { error: "Failed to delete product" };
  }
};
