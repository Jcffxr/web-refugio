const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

// --- CORS FLEXIBLE (SOLUCIÓN DEFINITIVA) ---
app.use(cors({
    origin: function (origin, callback) {
        // Permitir solicitudes sin origen (como Postman o Apps móviles)
        if (!origin) return callback(null, true);

        // AQUÍ ESTÁ EL CAMBIO:
        // En lugar de comparar exacto, preguntamos: "¿Contiene la palabra vercel.app?"
        // Así evitamos errores por barras '/' al final.
        if (origin.includes('localhost') || origin.includes('vercel.app')) {
            return callback(null, true);
        }

        // Si no cumple, mostramos quién fue el intruso en los logs
        console.log('🚫 Bloqueado por CORS:', origin);
        return callback(new Error('La política CORS no permite acceso desde este origen.'), false);
    },
    credentials: true
}));
// -------------------------------------------

app.use(express.json()); // Para leer JSON

// Rutas
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/animals', require('./routes/animalRoutes'));

// (Opcional) Carpeta uploads pública
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));