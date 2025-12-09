const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

// --- INICIO DEL CAMBIO DE SEGURIDAD (CORS) ---
const allowedOrigins = [
    'http://localhost:5173',                  // Para cuando trabajas en tu PC
    'https://web-refugio.vercel.app'          // TU VERCEL (Sin la barra / al final)
];

app.use(cors({
    origin: function (origin, callback) {
        // Permitir solicitudes sin origen (como Postman o Mobile Apps)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'La política CORS no permite acceso desde este origen.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true // Permitir cookies o headers especiales si se necesitan
}));
// --- FIN DEL CAMBIO ---

app.use(express.json()); // Para leer JSON

// Rutas
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/animals', require('./routes/animalRoutes'));

// (Opcional) Esta línea ya no es necesaria con Cloudinary, pero no hace daño dejarla
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));