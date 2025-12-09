import axios from 'axios';

// Detecta si estamos en producción (Vercel) o en local
const API_URL = import.meta.env.MODE === 'production' 
    ? 'https://backend-refugio.onrender.com/api'  // <--- TU LINK DE RENDER AQUÍ
    : 'http://localhost:4000/api';

const api = axios.create({
    baseURL: API_URL,
});

export default api;