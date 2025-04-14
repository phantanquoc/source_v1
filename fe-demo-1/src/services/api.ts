import axios from 'axios';

// Cấu hình API
const API_URL = 'http://localhost:5000/api';

// Tạo instance axios
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Thêm interceptor để xử lý token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// API User
export const userAPI = {
  register: (userData: any) => api.post('/register', userData),
  login: (email: string, password: string) => api.post('/login', { email, password }),
  getAllUsers: () => api.get('/users'),
  getUserByEmail: (email: string) => api.get(`/users/${email}`),
  updateUser: (id: string, userData: any) => api.put(`/users/${id}`, userData),
  deleteUser: (id: string) => api.delete(`/users/${id}`),
};

// API Mục tiêu
export const goalAPI = {
  getAllGoals: () => api.get('/goals'),
  createGoal: (goalData: any) => api.post('/goals', goalData),
  updateGoal: (id: string, goalData: any) => api.put(`/goals/${id}`, goalData),
  deleteGoal: (id: string) => api.delete(`/goals/${id}`),
};

// API Đơn hàng
export const donHangAPI = {
  getAllDonHang: () => api.get('/donhang'),
  getAllKhachHang: () => api.get('/khachhang'),
  getAllSanPham: () => api.get('/sanpham'),
};

// API Quy trình
export const quyTrinhAPI = {
  getAllQuyTrinh: () => api.get('/quytrinh'),
  getQuyTrinhById: (id: string) => api.get(`/quytrinh/${id}`),
  createQuyTrinh: (quyTrinhData: any) => api.post('/quytrinh', quyTrinhData),
  updateQuyTrinh: (id: string, quyTrinhData: any) => api.put(`/quytrinh/${id}`, quyTrinhData),
  deleteQuyTrinh: (id: string) => api.delete(`/quytrinh/${id}`),
  approveQuyTrinh: (id: string, nguoiduyet: string) => api.put(`/quytrinh/${id}/approve`, { nguoiduyet }),
  getQuyTrinhHistory: (id: string) => api.get(`/quytrinh/${id}/history`),
};

export default api;
