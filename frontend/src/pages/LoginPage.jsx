import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { FaArrowLeft, FaLock } from 'react-icons/fa';
// IMPORTAMOS EL TOGGLE
import ThemeToggle from '../components/ThemeToggle';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        const result = await login(email, password);
        if (result.success) {
            navigate('/admin');
        } else {
            setError(result.message);
        }
    };

    return (
        // FONDO ADAPTABLE
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900 px-4 relative transition-colors duration-300">
            
            {/* BOTÓN DE TEMA */}
            <ThemeToggle />

            {/* Link Volver */}
            <Link to="/" className="absolute top-6 left-6 flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 font-bold transition">
                <FaArrowLeft /> Volver al Inicio
            </Link>

            {/* TARJETA DE LOGIN */}
            <div className="bg-white dark:bg-slate-800 p-10 rounded-2xl shadow-xl w-full max-w-md border border-gray-100 dark:border-slate-700 transition-colors duration-300">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-extrabold text-gray-800 dark:text-white flex items-center justify-center gap-3">
                        Acceso Admin <FaLock className="text-blue-500 text-2xl" />
                    </h2>
                    <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">Solo personal autorizado del refugio</p>
                </div>
                
                {error && (
                    <div className="bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 text-red-700 dark:text-red-400 p-4 mb-6 rounded text-sm font-medium">
                        {error}
                    </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Email</label>
                        <input 
                            type="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900 focus:border-blue-500 bg-white dark:bg-slate-700 dark:text-white transition"
                            placeholder="admin@refugio.com"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Contraseña</label>
                        <input 
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900 focus:border-blue-500 bg-white dark:bg-slate-700 dark:text-white transition"
                            placeholder="••••••••"
                        />
                    </div>
                    <button 
                        type="submit" 
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition duration-300 shadow-lg shadow-blue-500/30 transform active:scale-95"
                    >
                        Ingresar al Sistema
                    </button>
                </form>

                <div className="mt-6 text-center border-t border-gray-200 dark:border-slate-700 pt-6">
                    <Link to="/" className="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 font-semibold transition">
                        ¿No eres administrador? Regresa aquí
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;