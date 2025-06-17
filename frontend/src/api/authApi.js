// frontend/src/api/authApi.js
import axios from 'axios';
const API_BASE_URL = 'http://localhost:5000/api/auth';
 // Adjust if different

// LOGIN
export const loginUser = async (username, password) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/login`, {
      username,
      password,
    }, {
      withCredentials: true // allow sending cookies
    });

    return response.data; // { success: true, message: "Login successful" }
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || 'Login failed',
    };
  }
};

// LOGOUT
export const logoutUser = async () => {
  try {
    const response = await axios.post(`${API_BASE_URL}/logout`, {}, {
      withCredentials: true
    });

    return response.data;
  } catch (error) {
    return {
      success: false,
      message: 'Logout failed',
    };
  }
};
