import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { FaArrowLeft, FaDog, FaCat, FaCheckCircle, FaChild, FaPaw, FaWhatsapp } from 'react-icons/fa';
import ThemeToggle from '../components/ThemeToggle';

const AnimalDetailsPage = () => {
  const { id } = useParams();
  const [animal, setAnimal] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnimal = async () => {
      try {
        const { data } = await api.get(`/animals/${id}`);
        setAnimal(data);
      } catch (error) {
        console.error("Error al cargar mascota:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnimal();
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-slate-900 font-bold text-blue-600 dark:text-blue-400 transition-colors">Cargando... 🐾</div>;
  
  if (!animal) return <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-slate-900 text-red-500 transition-colors">Mascota no encontrada.</div>;

  const TypeIcon = animal.type === 'perro' ? FaDog : FaCat;
  const buttonColor = animal.type === 'perro' ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-pink-600 hover:bg-pink-700';

  // === AQUÍ ESTABA EL ERROR: AGREGAMOS EL LIMPIADOR ===
  // Si la imagen existe y empieza con "/", le quitamos el primer caracter.
  // Si no, usamos la imagen tal cual.
  const imageUrl = animal.image && animal.image.startsWith('/') 
      ? animal.image.slice(1) 
      : animal.image;

  const handleAdoptClick = () => {
    const phoneNumber = "59175629286"; 
    const message = `Hola Refugio Katze, estoy interesado en adoptar a ${animal.name} (${animal.type}). ¿Podrían darme más información?`;
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const InfoItem = ({ icon: Icon, label, value, isCheck }) => (
    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-slate-700/50 rounded-lg border border-gray-100 dark:border-slate-600 transition-colors">
        <Icon className={`text-xl ${isCheck ? (value ? 'text-green-500 dark:text-green-400' : 'text-gray-300 dark:text-slate-500') : 'text-blue-500 dark:text-blue-400'}`} />
        <div>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wide">{label}</p>
            {isCheck ? (
                <p className={`font-bold ${value ? 'text-green-700 dark:text-green-300' : 'text-gray-400 dark:text-slate-500'}`}>{value ? 'Sí' : 'No'}</p>
            ) : (
                <p className="font-bold text-gray-700 dark:text-gray-200">{value}</p>
            )}
        </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-slate-900 py-10 px-4 transition-colors duration-300">
      <ThemeToggle />

      <div className="max-w-5xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-300 font-bold hover:text-blue-600 dark:hover:text-blue-400 mb-6 transition">
            <FaArrowLeft /> Volver a la galería
        </Link>
        
        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl overflow-hidden lg:flex transition-colors duration-300">
          
          {/* Foto Gigante */}
          <div className="lg:w-1/2 relative bg-gray-200 dark:bg-slate-700 min-h-[400px]">
            <img 
              src={imageUrl}   // <--- AHORA SÍ FUNCIONARÁ PORQUE 'imageUrl' YA EXISTE
              alt={animal.name} 
              className="w-full h-full object-cover"
            />
            <div className={`absolute top-6 left-6 ${buttonColor} text-white px-5 py-2 rounded-full font-bold flex items-center gap-2 shadow-lg`}>
                <TypeIcon /> {animal.type}
            </div>
          </div>

          {/* Información */}
          <div className="lg:w-1/2 p-8 lg:p-12 flex flex-col">
            <div className="mb-6">
                <h1 className="text-5xl font-extrabold text-gray-800 dark:text-white mb-3">{animal.name}</h1>
                <div className="flex gap-2">
                    <span className="bg-gray-100 dark:bg-slate-700 text-gray-800 dark:text-gray-200 px-4 py-1.5 rounded-full text-sm font-bold border border-gray-200 dark:border-slate-600 transition-colors">
                        {animal.age}
                    </span>
                    <span className="bg-gray-100 dark:bg-slate-700 text-gray-800 dark:text-gray-200 px-4 py-1.5 rounded-full text-sm font-bold border border-gray-200 dark:border-slate-600 transition-colors">
                        {animal.gender}
                    </span>
                </div>
            </div>

            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-3">Su Historia</h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-8 whitespace-pre-line text-lg">
                {animal.description}
            </p>

            <div className="grid grid-cols-2 gap-4 mb-10">
                <InfoItem icon={FaCheckCircle} label="Vacunado" value={animal.health.vaccinated} isCheck={true} />
                <InfoItem icon={FaCheckCircle} label="Desparasitado" value={animal.health.dewormed} isCheck={true} />
                <InfoItem icon={FaCheckCircle} label="Esterilizado" value={animal.health.sterilized} isCheck={true} />
                <InfoItem icon={FaChild} label="Con Niños" value={animal.compatibility.kids} isCheck={true} />
                <InfoItem icon={FaPaw} label="Con Mascotas" value={animal.compatibility.otherPets} isCheck={true} />
            </div>

            <button 
                onClick={handleAdoptClick}
                className={`mt-auto w-full ${buttonColor} text-white text-xl font-bold py-4 rounded-xl shadow-lg transition transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-3`}
            >
                <FaWhatsapp className="text-2xl" /> ¡Quiero Adoptar a {animal.name}! ❤️
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnimalDetailsPage;