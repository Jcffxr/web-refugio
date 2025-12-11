const Animal = require('../models/Animal');
const axios = require('axios');

// @desc    Obtener todos los animales
// @route   GET /api/animals
const getAnimals = async (req, res) => {
    try {
        const animals = await Animal.find();
        res.json(animals);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener mascotas', error });
    }
};

// @desc    Obtener un animal por ID
// @route   GET /api/animals/:id
const getAnimalById = async (req, res) => {
    try {
        const animal = await Animal.findById(req.params.id);
        if (animal) {
            res.json(animal);
        } else {
            res.status(404).json({ message: 'Mascota no encontrada' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error del servidor', error });
    }
};

// @desc    Crear nuevo animal (Subida a Cloudinary + Make)
// @route   POST /api/animals
const createAnimal = async (req, res) => {
    try {
        let animalData = req.body;

        // 1. GESTIÓN DE LA IMAGEN (CLOUD)
        if (req.file) {
            // ¡MAGIA! Cloudinary ya nos da la URL completa de internet aquí:
            // Ejemplo: https://res.cloudinary.com/tu-nube/image/upload/v123/perrito.jpg
            animalData.image = req.file.path; 
        }

        // 2. PARSEAR JSON (Datos técnicos del formulario)
        if (typeof animalData.health === 'string') {
            animalData.health = JSON.parse(animalData.health);
        }
        if (typeof animalData.compatibility === 'string') {
            animalData.compatibility = JSON.parse(animalData.compatibility);
        }

        // 3. GUARDAR EN MONGODB (ATLAS)
        const newAnimal = new Animal(animalData);
        const savedAnimal = await newAnimal.save();

        // 4. ENVIAR A MAKE (AUTOMATIZACIÓN INSTAGRAM)
        // Ya no necesitamos Ngrok porque 'savedAnimal.image' es un link real
        if (savedAnimal.image) {
            // TU URL DE MAKE (Asegúrate que sea la correcta que te dio Make)
            const MAKE_WEBHOOK_URL = 'https://hook.us2.make.com/y1qoc7uytydvtihmuiicrfymd2j3grtu'; 

            const payload = {
                nombre: savedAnimal.name,
                edad: savedAnimal.age,
                tipo: savedAnimal.type,
                descripcion: savedAnimal.description,
                foto: savedAnimal.image // Link directo de Cloudinary
            };

            // Enviamos a Make en segundo plano
            axios.post(MAKE_WEBHOOK_URL, payload)
                .then(() => console.log('✅ Enviado a Make/Instagram con éxito'))
                .catch(err => console.error('❌ Error enviando a Make:', err.message));
        }

        res.status(201).json(savedAnimal);
    } catch (error) {
        console.error("Error en createAnimal:", error);
        res.status(400).json({ message: 'Error al crear mascota', error: error.message });
    }
};

module.exports = { getAnimals, getAnimalById, createAnimal };