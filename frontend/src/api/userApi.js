import axios from 'axios';

const API_BASE_URL = '/api/users';


const UserApi = {
  // Add a new user (POST /api/users)
  addUser: async (userData) => {
    try {
      const response = await axios.post(API_BASE_URL, userData);
      return response.data; // { success, message, user }
    } catch (error) {
      // Return backend error message or default error
      throw error.response?.data || { error: 'Failed to add user' };
    }
  },

  // Get all users (GET /api/users)
  getAllUsers: async () => {
    try {
      const response = await axios.get(API_BASE_URL);
      return response.data.users; // returns array of users
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch users' };
    }
  },

  // Get user by ID (GET /api/users/:id)
  getUserById: async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${id}`);
      return response.data.user; // single user object
    } catch (error) {
      throw error.response?.data || { error: 'Failed to fetch user' };
    }
  },

  // Update user (PUT /api/users/:id)
  updateUser: async (id, updatedUser) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/${id}`, updatedUser);
      return response.data; // { success, message, user }
    } catch (error) {
      throw error.response?.data || { error: 'Failed to update user' };
    }
  },

  // Delete user (DELETE /api/users/:id)
  deleteUser: async (id) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/${id}`);
      return response.data; // { success, message }
    } catch (error) {
      throw error.response?.data || { error: 'Failed to delete user' };
    }
  }
};

export default UserApi;
