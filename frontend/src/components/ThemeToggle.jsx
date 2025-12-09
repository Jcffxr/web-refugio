import { useEffect, useState } from 'react';
import { FaSun, FaMoon } from 'react-icons/fa';

const ThemeToggle = () => {
  // Leemos la preferencia guardada o usamos 'light' por defecto
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    // Guardamos en memoria local
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <button
      onClick={toggleTheme}
      // HEMOS QUITADO "fixed bottom-6 right-6 z-50" Y PUESTO CLASES MÁS SIMPLES
      className="p-2.5 rounded-full shadow-sm transition-all duration-300 hover:scale-105 focus:outline-none
      bg-white/10 text-yellow-300 hover:bg-white/20 dark:bg-slate-800 dark:text-blue-400 border border-white/20 dark:border-slate-700 backdrop-blur-sm"
      title={theme === 'dark' ? "Cambiar a Modo Claro" : "Cambiar a Modo Oscuro"}
    >
      {theme === 'dark' ? <FaMoon className="text-lg" /> : <FaSun className="text-lg" />}
    </button>
  );
};

export default ThemeToggle;