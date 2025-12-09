const mongoose = require('mongoose');

const animalSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, required: true }, // perro, gato
    gender: { type: String, required: true }, // Macho, Hembra
    age: { type: String, required: true }, // Ej: "2 años"
    
    description: { type: String, required: true }, // Historia completa
    
    // Información médica
    health: {
        sterilized: { type: Boolean, default: false },
        vaccinated: { type: Boolean, default: false },
        dewormed: { type: Boolean, default: false },
        specialNeeds: { type: String, default: "Ninguna" }
    },
    
    // Compatibilidad
    compatibility: {
        kids: { type: Boolean, default: true },
        otherPets: { type: Boolean, default: true }
    },

    // Imagen (Ruta local)
    image: { type: String, required: true }, 

    adoptionStatus: { 
        type: String, 
        enum: ['disponible', 'adoptado', 'en proceso'], 
        default: 'disponible' 
    }
}, { timestamps: true });

module.exports = mongoose.model('Animal', animalSchema);