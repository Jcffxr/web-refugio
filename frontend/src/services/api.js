import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:4000/api', // La URL de tu backend
});

// Esto intercepta cada petición y le pega el Token si existe
api.interceptors.request.use((config) => {
    const user = JSON.parse(localStorage.getItem('userInfo'));
    if (user && user.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
});

export default api;