const Animal = require('../models/Animal');
const cloudinary = require('../config/cloudinary');
const axios = require('axios'); // <--- IMPORTANTE: Asegúrate de que esto esté aquí

const createAnimal = async (req, res) => {
    try {
        const { nombre, edad, tipo, descripcion, sexo, estadoSalud } = req.body;
        
        // 1. Subir imagen a Cloudinary (si existe)
        let imageUrl = '';
        let imagePublicId = '';

        if (req.file) {
            const result = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    { folder: 'refugio_animales' },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                );
                uploadStream.end(req.file.buffer);
            });
            imageUrl = result.secure_url;
            imagePublicId = result.public_id;
        }

        // 2. Crear mascota en Base de Datos
        const newAnimal = new Animal({
            nombre,
            edad,
            tipo,
            descripcion,
            sexo,
            estadoSalud: estadoSalud ? JSON.parse(estadoSalud) : {},
            image: imageUrl,
            imagePublicId,
            user: req.user._id,
        });

        const savedAnimal = await newAnimal.save();

        // ---------------------------------------------------------
        // 3. ENVIAR A MAKE (AUTOMATIZACIÓN) - BLOQUE DE DEBUG
        // ---------------------------------------------------------
        if (savedAnimal.image) {
            console.log('📢 INTENTANDO ENVIAR A MAKE...'); 
            
            // TU URL EXACTA DE MAKE (Verificada de tu foto)
            const MAKE_WEBHOOK_URL = 'https://hook.us2.make.com/y1qoc7uytydvtihmuiicrfymd2j3grtu';

            const payload = {
                nombre: savedAnimal.nombre,
                edad: savedAnimal.edad,
                tipo: savedAnimal.tipo,
                descripcion: savedAnimal.descripcion,
                foto: savedAnimal.image
            };

            try {
                // Enviamos los datos y esperamos respuesta
                await axios.post(MAKE_WEBHOOK_URL, payload);
                console.log('✅ ¡ENVIADO A MAKE CON ÉXITO! 🚀');
            } catch (makeError) {
                console.error('❌ ERROR AL ENVIAR A MAKE:', makeError.message);
                // No detenemos el proceso, solo avisamos del error
            }
        } else {
            console.log('⚠️ No se envió a Make porque no hay foto.');
        }
        // ---------------------------------------------------------

        res.status(201).json(savedAnimal);

    } catch (error) {
        console.error('Error en createAnimal:', error);
        res.status(500).json({ message: 'Error al crear la mascota' });
    }
};

const getAnimals = async (req, res) => {
    const animals = await Animal.find();
    res.json(animals);
};

module.exports = { createAnimal, getAnimals };