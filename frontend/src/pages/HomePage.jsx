import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { FaPaw, FaHeart, FaUserShield, FaSearch, FaWhatsapp, FaHome, FaInstagram, FaDog, FaCat, FaFacebook, FaArrowUp } from 'react-icons/fa';
import { SiCanva } from 'react-icons/si';
import ThemeToggle from '../components/ThemeToggle';

import logoImg from '../assets/logo.jpg'; 

const HomePage = () => {
    const [animals, setAnimals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showScrollTop, setShowScrollTop] = useState(false);

    useEffect(() => {
        const fetchAnimals = async () => {
            try {
                const { data } = await api.get('/animals');
                setAnimals(data);
            } catch (error) {
                console.error("Error al cargar mascotas:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchAnimals();

        const handleScroll = () => {
            if (window.scrollY > 300) {
                setShowScrollTop(true);
            } else {
                setShowScrollTop(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // === LÓGICA DE SEPARACIÓN ===
    // Filtramos la lista completa en dos grupos
    const dogs = animals.filter(animal => animal.type === 'perro');
    const cats = animals.filter(animal => animal.type === 'gato');

    // Componente interno para renderizar tarjetas (para no repetir código)
    const AnimalCard = ({ animal }) => {
        const isMale = animal.gender === 'Macho';
        const badgeColor = isMale ? "bg-sky-400" : "bg-pink-400"; 
        const tagColor = isMale 
            ? "bg-sky-50 text-sky-600 border-sky-100 dark:bg-sky-900/20 dark:text-sky-300 dark:border-sky-800" 
            : "bg-pink-50 text-pink-600 border-pink-100 dark:bg-pink-900/20 dark:text-pink-300 dark:border-pink-800";
        const buttonGradient = isMale 
            ? "from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600"
            : "from-pink-400 to-rose-500 hover:from-pink-500 hover:to-rose-600";
        const TypeIcon = animal.type === 'perro' ? FaDog : FaCat;
        const imageUrl = animal.image.startsWith('/') ? animal.image.slice(1) : animal.image;

        return (
            
            
            <div className="group bg-white dark:bg-slate-800 rounded-3xl shadow-lg hover:shadow-2xl transition duration-500 overflow-hidden border border-gray-100 dark:border-slate-700 flex flex-col h-full relative transform hover:-translate-y-2">
                <div className="h-80 overflow-hidden relative">
                    {/* CORREGIDO: URL DIRECTA DE CLOUDINARY */}
                    <img 
                        src={imageUrl} 
                        alt={animal.name} 
                        className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition"></div>
                    <div className="absolute bottom-5 left-5 text-white">
                        <h3 className="text-3xl font-bold tracking-tight drop-shadow-md">{animal.name}</h3>
                        <p className="opacity-95 text-sm font-bold bg-white/20 backdrop-blur-md inline-block px-3 py-1 rounded-full mt-2 border border-white/30">
                            {animal.age}
                        </p>
                    </div>
                    <span className={`absolute top-4 right-4 text-xs font-bold px-3 py-1.5 rounded-full text-white uppercase tracking-wider shadow-md flex items-center gap-1 ${badgeColor}`}>
                        <TypeIcon className="text-sm" /> {animal.type}
                    </span>
                </div>

                <div className="p-6 flex flex-col flex-grow">
                    <div className="flex flex-wrap gap-2 mb-4">
                        <span className={`text-xs font-bold px-3 py-1 rounded-lg border ${tagColor}`}>
                            {isMale ? '♂ Macho' : '♀ Hembra'}
                        </span>
                        {animal.health?.vaccinated && (
                            <span className="text-xs font-bold px-3 py-1 rounded-lg bg-teal-50 text-teal-600 border border-teal-100 dark:bg-teal-900/20 dark:text-teal-300 dark:border-teal-800">
                                💉 Vacunado
                            </span>
                        )}
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-3 mb-6 flex-grow leading-relaxed">
                        {animal.description}
                    </p>
                    <Link 
                        to={`/animal/${animal._id}`}
                        className={`w-full py-3.5 rounded-xl text-white font-bold text-center shadow-md transition transform active:scale-95 flex items-center justify-center gap-2 bg-gradient-to-r ${buttonGradient}`}
                    >
                        Conocer Historia <FaHeart className="text-sm" />
                    </Link>
                </div>
            </div>
        );
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-900"><div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-blue-500"></div></div>;

    return (
        <div className="min-h-screen bg-white dark:bg-slate-900 font-sans transition-colors duration-300 relative">
            
            {/* Botón Volver Arriba */}
            <button
                onClick={scrollToTop}
                className={`fixed bottom-8 right-8 z-50 p-4 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg transition-all duration-300 transform hover:scale-110 ${
                    showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
                }`}
                aria-label="Volver arriba"
            >
                <FaArrowUp className="text-xl" />
            </button>

            {/* Navbar */}
            <header className="absolute top-0 left-0 w-full z-50 px-6 py-4 flex justify-between items-center">
                <div className="flex items-center">
                    <img 
                        src={logoImg} 
                        alt="Katze Logo" 
                        className="h-12 md:h-14 w-auto object-contain rounded-full shadow-md hover:scale-105 transition duration-300" 
                    />
                </div>
                <div className="flex items-center gap-3 sm:gap-4">
                    <ThemeToggle />
                    <Link to="/login" className="px-4 py-2.5 bg-white/10 border border-white/20 text-white text-sm font-bold rounded-full hover:bg-white/20 transition backdrop-blur-sm flex items-center gap-2 shadow-sm">
                        <FaUserShield className="text-lg" /> 
                        <span className="hidden sm:inline">Soy Admin</span>
                    </Link>
                </div>
            </header>

            {/* 1. Hero Section */}
            <div className="relative bg-[#0f172a] overflow-hidden min-h-[85vh] flex items-center pt-20">
                <div className="absolute inset-0 bg-[conic-gradient(at_top_right,_var(--tw-gradient-stops))] from-blue-700 via-blue-900 to-[#0f172a] opacity-90"></div>
                <div className="absolute top-20 right-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
                <div className="absolute bottom-20 left-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-2000"></div>
                
                <div className="relative max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
                    <div className="text-center lg:text-left">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-900/50 border border-blue-500/30 text-blue-300 text-sm font-bold mb-6">
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                            </span>
                            Refugio Activo en Bolivia
                        </div>
                        <h1 className="text-5xl lg:text-7xl font-extrabold text-white tracking-tight leading-tight mb-6">
                            Salva una vida, <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">gana un amigo.</span>
                        </h1>
                        <p className="text-xl text-blue-100 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed opacity-90">
                            En Katze, cada adopción es una historia de amor. Miles de colitas están esperando a alguien como tú para moverlas de felicidad.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <a href="#perros" className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-full shadow-lg shadow-blue-600/30 transition transform hover:-translate-y-1 flex items-center justify-center gap-2">
                                <FaDog /> Ver Perros
                            </a>
                            <a href="#gatos" className="px-8 py-4 bg-pink-600 hover:bg-pink-500 text-white font-bold rounded-full shadow-lg shadow-pink-600/30 transition transform hover:-translate-y-1 flex items-center justify-center gap-2">
                                <FaCat /> Ver Gatos
                            </a>
                        </div>
                    </div>
                    <div className="hidden lg:block relative z-10">
                        <img 
                            src="https://images.unsplash.com/photo-1450778869180-41d0601e046e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                            alt="Perro Feliz" 
                            className="rounded-3xl shadow-2xl border-8 border-white/10 rotate-2 hover:rotate-0 transition duration-500"
                        />
                    </div>
                </div>
            </div>

            {/* 2. Proceso de Adopción */}
            <div className="py-20 bg-blue-50 dark:bg-slate-800 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 dark:text-white mb-12">¿Cómo funciona la adopción?</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-white dark:bg-slate-700 p-8 rounded-2xl shadow-sm hover:shadow-md transition duration-300">
                            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 rounded-full flex items-center justify-center text-2xl mx-auto mb-6"><FaSearch /></div>
                            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">1. Elige a tu compañero</h3>
                            <p className="text-gray-600 dark:text-gray-300">Explora nuestras secciones de perros y gatos.</p>
                        </div>
                        <div className="bg-white dark:bg-slate-700 p-8 rounded-2xl shadow-sm hover:shadow-md transition duration-300">
                            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-300 rounded-full flex items-center justify-center text-2xl mx-auto mb-6"><FaWhatsapp /></div>
                            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">2. Contáctanos</h3>
                            <p className="text-gray-600 dark:text-gray-300">Dale click al botón de adoptar para coordinar por WhatsApp.</p>
                        </div>
                        <div className="bg-white dark:bg-slate-700 p-8 rounded-2xl shadow-sm hover:shadow-md transition duration-300">
                            <div className="w-16 h-16 bg-pink-100 dark:bg-pink-900/50 text-pink-600 dark:text-pink-300 rounded-full flex items-center justify-center text-2xl mx-auto mb-6"><FaHome /></div>
                            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">3. Llévalo a casa</h3>
                            <p className="text-gray-600 dark:text-gray-300">Tras una entrevista, podrás llevarlo a su nuevo hogar.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* === SECCIÓN 3: PERROS === */}
            <div id="perros" className="max-w-7xl mx-auto px-6 pt-24 pb-12">
                <div className="flex items-center gap-4 mb-12">
                    <div className="bg-indigo-600 p-3 rounded-full text-white text-2xl shadow-lg shadow-indigo-500/30">
                        <FaDog />
                    </div>
                    <div>
                        <h2 className="text-4xl font-extrabold text-gray-800 dark:text-white">Amigos Caninos</h2>
                        <p className="text-gray-500 dark:text-gray-400">Leales, divertidos y listos para pasear.</p>
                    </div>
                </div>

                {dogs.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 dark:bg-slate-800/50 rounded-3xl border-2 border-dashed border-gray-200 dark:border-slate-700">
                        <p className="text-gray-500 dark:text-gray-400">No hay perritos disponibles por el momento.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {dogs.map((dog) => (
                            <AnimalCard key={dog._id} animal={dog} />
                        ))}
                    </div>
                )}
            </div>

            {/* === SECCIÓN 4: GATOS === */}
            <div id="gatos" className="max-w-7xl mx-auto px-6 pt-12 pb-24">
                <div className="flex items-center gap-4 mb-12">
                    <div className="bg-pink-600 p-3 rounded-full text-white text-2xl shadow-lg shadow-pink-500/30">
                        <FaCat />
                    </div>
                    <div>
                        <h2 className="text-4xl font-extrabold text-gray-800 dark:text-white">Amigos Felinos</h2>
                        <p className="text-gray-500 dark:text-gray-400">Independientes, cariñosos y elegantes.</p>
                    </div>
                </div>

                {cats.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 dark:bg-slate-800/50 rounded-3xl border-2 border-dashed border-gray-200 dark:border-slate-700">
                        <p className="text-gray-500 dark:text-gray-400">No hay gatitos disponibles por el momento.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {cats.map((cat) => (
                            <AnimalCard key={cat._id} animal={cat} />
                        ))}
                    </div>
                )}
            </div>

            {/* 4. Footer */}
            <footer className="bg-gray-900 dark:bg-black text-white py-12 border-t border-gray-800">
                <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-8 text-center md:text-left">
                    <div>
                        <h3 className="text-2xl font-bold mb-4 flex items-center justify-center md:justify-start gap-2">
                            <FaPaw className="text-blue-500" /> Refugio Katze
                        </h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Dedicados a rescatar, rehabilitar y encontrar hogares amorosos para animales en situación de calle en Bolivia.
                        </p>
                    </div>
                    <div>
                        <h4 className="text-lg font-bold mb-4 text-gray-200">Contacto</h4>
                        <p className="text-gray-400 text-sm mb-2">Santa Cruz, Bolivia</p>
                        <p className="text-gray-400 text-sm">info@refugiokatze.com</p>
                    </div>
                    <div>
                        <h4 className="text-lg font-bold mb-4 text-gray-200">Síguenos</h4>
                        <div className="flex justify-center md:justify-start gap-4">
                            <a 
                                href="https://www.facebook.com/Katzecomunidadfelina" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-600 hover:text-white transition duration-300"
                                title="Síguenos en Facebook"
                            >
                                <FaFacebook className="text-xl" />
                            </a>
                            <a 
                                href="https://www.instagram.com/katzecomunidadfelina/" 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-pink-600 hover:text-white transition duration-300"
                                title="Síguenos en Instagram"
                            >
                                <FaInstagram className="text-xl" />
                            </a>
                        </div>
                    </div>
                </div>
                <div className="text-center mt-12 pt-8 border-t border-gray-800 text-gray-600 text-xs">
                    © 2025 Refugio Katze. Todos los derechos reservados.
                </div>
            </footer>
        </div>
    );
};

export default HomePage;