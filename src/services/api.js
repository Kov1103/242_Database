import axios from 'axios';

// Cấu hình URL cơ bản cho các API
const API_URL = import.meta.env.VITE_API_URL;

// Hàm gọi API GET
export const getData = async (endpoint, params = {}) => {
  try {
    const response = await axios.get(`${API_URL}${endpoint}`, { params });
    return response.data;
  } catch (error) {
    console.error(`❌ Lỗi khi gọi GET API tại ${endpoint}:`, error.message);
    throw error;
  }
};

// Hàm gọi API POST
export const postData = async (endpoint, data) => {
  try {
    const response = await axios.post(`${API_URL}${endpoint}`, data);
    return response.data;
  } catch (error) {
    console.error(`❌ Lỗi khi gọi POST API tại ${endpoint}:`, error.message);
    throw error;
  }
};

// Hàm gọi API PUT
export const putData = async (endpoint, data) => {
  try {
    const response = await axios.put(`${API_URL}${endpoint}`, data);
    return response.data;
  } catch (error) {
    console.error(`❌ Lỗi khi gọi PUT API tại ${endpoint}:`, error.message);
    throw error;
  }
};

// Hàm gọi API PATCH
export const patchData = async (endpoint, data) => {
  try {
    const response = await axios.patch(`${API_URL}${endpoint}`, data);
    return response.data;
  } catch (error) {
    console.error(`❌ Lỗi khi gọi PATCH API tại ${endpoint}:`, error.message);
    throw error;
  }
};

// Hàm gọi API DELETE
export const deleteData = async (endpoint) => {
  try {
    const response = await axios.delete(`${API_URL}${endpoint}`);
    return response.data;
  } catch (error) {
    console.error(`❌ Lỗi khi gọi DELETE API tại ${endpoint}:`, error.message);
    throw error;
  }
};
