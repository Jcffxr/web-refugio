import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import api from '../services/api';
import ThemeToggle from '../components/ThemeToggle'; // IMPORTAMOS EL TOGGLE

const AdminDashboard = () => {
    const { logout, user } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Estados
    const [formData, setFormData] = useState({ name: '', type: 'perro', gender: 'Macho', age: '', description: '' });
    const [health, setHealth] = useState({ sterilized: false, vaccinated: false, dewormed: false, specialNeeds: 'Ninguna' });
    const [compatibility, setCompatibility] = useState({ kids: true, otherPets: true });
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [message, setMessage] = useState({ text: '', type: '' });

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
        setPreview(URL.createObjectURL(file));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ text: 'Subiendo...', type: 'info' });
        const data = new FormData();
        data.append('name', formData.name);
        data.append('type', formData.type);
        data.append('gender', formData.gender);
        data.append('age', formData.age);
        data.append('description', formData.description);
        data.append('health', JSON.stringify(health));
        data.append('compatibility', JSON.stringify(compatibility));
        if (image) data.append('image', image);

        try {
            await api.post('/animals', data, { headers: { 'Content-Type': 'multipart/form-data' } });
            setMessage({ text: '¡Mascota publicada con éxito!', type: 'success' });
            setFormData({ name: '', type: 'perro', gender: 'Macho', age: '', description: '' });
            setImage(null);
            setPreview(null);
            setHealth({ sterilized: false, vaccinated: false, dewormed: false, specialNeeds: 'Ninguna' });
        } catch (error) {
            console.error(error);
            setMessage({ text: 'Error al subir la mascota', type: 'error' });
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-900 pb-10 transition-colors duration-300">
            
            <ThemeToggle />

            {/* Navbar */}
            <nav className="bg-white dark:bg-slate-800 shadow px-6 py-4 flex justify-between items-center mb-8 transition-colors">
                <h1 className="text-xl font-bold text-blue-600 dark:text-blue-400">Panel de Control</h1>
                <div className="flex items-center gap-4">
                    <span className="text-gray-600 dark:text-gray-300 hidden sm:block">Hola, {user?.name}</span>
                    <button 
                        onClick={handleLogout} 
                        className="text-red-500 dark:text-red-400 font-semibold text-sm border border-red-500 dark:border-red-400 px-3 py-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                    >
                        Salir
                    </button>
                </div>
            </nav>

            {/* Formulario */}
            <div className="max-w-4xl mx-auto px-4">
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden transition-colors">
                    <div className="bg-blue-600 dark:bg-blue-700 p-4">
                        <h2 className="text-white text-lg font-bold text-center">Publicar Nueva Mascota</h2>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        {/* Columna Izquierda */}
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Nombre</label>
                                <input type="text" name="name" value={formData.name} onChange={handleChange} required 
                                    className="w-full border dark:border-slate-600 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none bg-white dark:bg-slate-700 dark:text-white" 
                                    placeholder="Ej: Pelusa" 
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Tipo</label>
                                    <select name="type" value={formData.type} onChange={handleChange} 
                                        className="w-full border dark:border-slate-600 p-2 rounded bg-white dark:bg-slate-700 dark:text-white"
                                    >
                                        <option value="perro">Perro</option>
                                        <option value="gato">Gato</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Sexo</label>
                                    <select name="gender" value={formData.gender} onChange={handleChange} 
                                        className="w-full border dark:border-slate-600 p-2 rounded bg-white dark:bg-slate-700 dark:text-white"
                                    >
                                        <option value="Macho">Macho</option>
                                        <option value="Hembra">Hembra</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Edad</label>
                                <input type="text" name="age" value={formData.age} onChange={handleChange} required 
                                    className="w-full border dark:border-slate-600 p-2 rounded bg-white dark:bg-slate-700 dark:text-white" 
                                    placeholder="Ej: 2 años" 
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">Historia / Descripción</label>
                                <textarea name="description" value={formData.description} onChange={handleChange} required rows="4" 
                                    className="w-full border dark:border-slate-600 p-2 rounded bg-white dark:bg-slate-700 dark:text-white" 
                                    placeholder="Cuenta su historia..."
                                ></textarea>
                            </div>
                        </div>

                        {/* Columna Derecha */}
                        <div className="space-y-6">
                            
                            {/* Salud */}
                            <div className="bg-gray-50 dark:bg-slate-700/50 p-4 rounded-lg border border-gray-100 dark:border-slate-600">
                                <h3 className="font-bold text-gray-700 dark:text-gray-200 mb-2">Estado de Salud</h3>
                                <div className="space-y-2 text-gray-600 dark:text-gray-300">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" checked={health.sterilized} onChange={(e) => setHealth({...health, sterilized: e.target.checked})} className="accent-blue-600" /> 
                                        Esterilizado/Castrado
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" checked={health.vaccinated} onChange={(e) => setHealth({...health, vaccinated: e.target.checked})} className="accent-blue-600" /> 
                                        Vacunas al día
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" checked={health.dewormed} onChange={(e) => setHealth({...health, dewormed: e.target.checked})} className="accent-blue-600" /> 
                                        Desparasitado
                                    </label>
                                </div>
                            </div>

                            {/* Foto */}
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Foto Principal</label>
                                <div className="border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-lg p-4 text-center hover:bg-gray-50 dark:hover:bg-slate-700 transition cursor-pointer relative">
                                    <input type="file" onChange={handleImageChange} accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                                    {preview ? (
                                        <img src={preview} alt="Previsualización" className="h-40 mx-auto object-contain" />
                                    ) : (
                                        <div className="text-gray-400 dark:text-gray-500">
                                            <p className="text-2xl">📷</p>
                                            <p>Click para subir foto</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <button type="submit" className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition shadow-lg transform active:scale-95">
                                Publicar Mascota 🐾
                            </button>

                            {message.text && (
                                <div className={`p-3 rounded text-center font-bold ${message.type === 'success' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'}`}>
                                    {message.text}
                                </div>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;