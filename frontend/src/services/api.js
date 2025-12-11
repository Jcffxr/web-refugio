import axios from 'axios';

// Detecta si estamos en producción (Vercel) o en local
const API_URL = import.meta.env.MODE === 'production' 
    ? 'https://backend-refugio.onrender.com/api'
    : 'http://localhost:4000/api';

const api = axios.create({
    baseURL: API_URL,
});

// --- EL ARREGLO MÁGICO (INTERCEPTOR) ---
// Antes de enviar cualquier solicitud, inyectamos el Token
api.interceptors.request.use(
    (config) => {
        // Buscamos los datos del usuario en el navegador
        const userInfo = localStorage.getItem('userInfo');
        
        if (userInfo) {
            const { token } = JSON.parse(userInfo);
            // Si hay token, lo pegamos en la cabecera como 'Bearer ...'
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
// ----------------------------------------

export default api;