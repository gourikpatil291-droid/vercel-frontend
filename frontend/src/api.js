import axios from 'axios';

const API_BASE_URL = (import.meta.env.VITE_API_URL && import.meta.env.VITE_API_URL !== 'undefined') 
  ? import.meta.env.VITE_API_URL 
  : (window.location.hostname === 'localhost' ? 'http://localhost:5000' : 'https://backend-smoky-zeta-1h0drgr8cx.vercel.app');

export const API_URL = API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL
});

export default api;
