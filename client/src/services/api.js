import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api'; 

const api = {
  // Expense CRUD
  getExpenses: (filters) => axios.get(`${BASE_URL}/expenses`, { params: filters }),
  addExpense: (expense) => axios.post(`${BASE_URL}/expenses`, expense),
  updateExpense: (id, expense) => axios.put(`${BASE_URL}/expenses/${id}`, expense),
  deleteExpense: (id) => axios.delete(`${BASE_URL}/expenses/${id}`),

  
  getUsers: () => axios.get(`${BASE_URL}/users`),
  getCategories: () => axios.get(`${BASE_URL}/categories`),

  // Statistics
  getUserTopDays: (userId) => axios.get(`${BASE_URL}/statistics/top-days/${userId}`),
  getMonthlyChangePercentage: (userId) => axios.get(`${BASE_URL}/statistics/monthly-change/${userId}`),
  predictNextMonth: (userId) => axios.get(`${BASE_URL}/statistics/predict-next-month/${userId}`),
};

export default api;
