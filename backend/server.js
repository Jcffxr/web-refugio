const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json()); // Para leer JSON

// Rutas
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/animals', require('./routes/animalRoutes'));

// HACER PÚBLICA LA CARPETA UPLOADS
// Esto permite que el frontend acceda a http://localhost:4000/uploads/foto.jpg
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));