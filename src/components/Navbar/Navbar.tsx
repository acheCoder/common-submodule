import { useState, useEffect } from 'react';
import { NavbarProps } from './Navbar.types';
import './Navbar.scss';

// Iconos SVG simples para evitar dependencias externas por ahora
const MoonIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
  </svg>
);

const SunIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5"></circle>
    <line x1="12" y1="1" x2="12" y2="3"></line>
    <line x1="12" y1="21" x2="12" y2="23"></line>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
    <line x1="1" y1="12" x2="3" y2="12"></line>
    <line x1="21" y1="12" x2="23" y2="12"></line>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
  </svg>
);

const Navbar = ({ links }: NavbarProps) => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Inicializar el tema basado en el atributo data-theme o preferencia del sistema
  useEffect(() => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    if (currentTheme === 'dark') {
      setTheme('dark');
    } else if (!currentTheme && window.matchMedia('(prefers-color-scheme: dark)').matches) {
       // Opcional: leer preferencia del sistema si no hay tema definido
       setTheme('dark');
       document.documentElement.setAttribute('data-theme', 'dark');
    } else {
       // Forzar modo claro inicial para coincidir con tu solicitud
       document.documentElement.setAttribute('data-theme', 'light');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <div className="navbar-container">
      <nav className="navbar-pill">
        <ul className="nav-links">
          {links.map((link, index) => (
            <li key={index}>
              <a href={link.href} className="nav-item">
                {link.label}
              </a>
            </li>
          ))}
        </ul>
        <button 
          onClick={toggleTheme} 
          className="theme-toggle-btn"
          aria-label="Alternar modo claro/oscuro"
        >
          {theme === 'light' ? <MoonIcon /> : <SunIcon />}
        </button>
      </nav>
    </div>
  );
};

export default Navbar;