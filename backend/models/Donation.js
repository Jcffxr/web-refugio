const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
    donorName: { type: String, required: true },
    email: { type: String, required: true, lowercase: true },
    phone: { type: String },
    
    // Tipo de donación
    type: { 
        type: String, 
        enum: ['monetaria', 'especie'], 
        required: true 
    },

    // Si es en especie (comida, ropa, etc.)
    items: [{
        category: { 
            type: String, 
            enum: ['comida', 'ropa', 'muebles', 'limpieza', 'medicina', 'otro'] 
        },
        description: String, // Ej: "Cama para perro mediano"
        quantity: Number
    }],

    // Si es monetaria (Preparado para el futuro)
    amount: { type: Number, default: 0 },
    currency: { type: String, default: 'BOB' },

    status: { 
        type: String, 
        enum: ['pendiente', 'recibido', 'cancelado'], 
        default: 'pendiente' 
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Donation', donationSchema);