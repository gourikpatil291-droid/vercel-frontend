import axios from 'axios';

const API_BASE_URL = (import.meta.env.VITE_API_URL && import.meta.env.VITE_API_URL !== 'undefined') 
  ? import.meta.env.VITE_API_URL 
  : (window.location.hostname === 'localhost' ? 'http://localhost:5000' : 'https://backend-gourikpatil291-5117s-projects.vercel.app');

export const API_URL = API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL
});

export default api;
