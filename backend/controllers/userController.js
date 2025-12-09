const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });

// Crear usuario (Lo usarás 1 vez para crear tu Admin)
const registerUser = async (req, res) => {
    const { name, email, password, isAdmin } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'Usuario ya existe' });

    const user = await User.create({ name, email, password, isAdmin });
    if (user) res.status(201).json({ _id: user._id, name: user.name, token: generateToken(user._id) });
};

// Login
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user._id)
        });
    } else {
        res.status(401).json({ message: 'Credenciales inválidas' });
    }
};

module.exports = { registerUser, loginUser };