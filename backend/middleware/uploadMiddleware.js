const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// 1. Configuramos Cloudinary con las llaves que pusiste en el .env
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// 2. Configuramos dónde se guardará (En la nube)
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'refugio_mascotas', // Nombre de la carpeta en tu Cloudinary
        allowed_formats: ['jpg', 'png', 'jpeg', 'webp', 'avif'], // Formatos permitidos
        transformation: [{ width: 1000, crop: "limit" }] // (Opcional) Redimensiona si la foto es gigante
    },
});

const upload = multer({ storage: storage });

module.exports = upload;