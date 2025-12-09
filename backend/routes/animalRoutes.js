const express = require('express');
const router = express.Router();
const Animal = require('../models/Animal');
const { protect, admin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// OBTENER TODOS (Público)
router.get('/', async (req, res) => {
    const animals = await Animal.find({ adoptionStatus: 'disponible' });
    res.json(animals);
});

// OBTENER UNO (Público - Detalle)
router.get('/:id', async (req, res) => {
    const animal = await Animal.findById(req.params.id);
    if (animal) res.json(animal);
    else res.status(404).json({ message: 'No encontrado' });
});

// CREAR NUEVO (Privado - Solo Admin + Foto)
router.post('/', protect, admin, upload.single('image'), async (req, res) => {
    try {
        const { name, type, gender, age, description, health, compatibility } = req.body;
        
        // Convertimos los strings JSON que vienen del form a Objetos si es necesario
        // Ojo: Si mandas health.sterilized desde Postman, hay que parsearlo
        
        const animal = new Animal({
            name, type, gender, age, description,
            health: JSON.parse(health), // Asumiendo que envías un objeto JSON string
            compatibility: JSON.parse(compatibility),
            image: `/${req.file.path}` // Guardamos la ruta relativa: /uploads/foto.jpg
        });

        const createdAnimal = await animal.save();
        res.status(201).json(createdAnimal);
    } catch (error) {
        res.status(400).json({ message: 'Error al crear', error: error.message });
    }
});

module.exports = router;