import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import type { NavbarProps } from './Navbar.types';
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

const GlobeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <path d="M2 12h20"></path>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
  </svg>
);

const getInitialTheme = (): 'light' | 'dark' => {
  const stored = document.documentElement.getAttribute('data-theme');
  if (stored === 'dark') return 'dark';
  return 'light';
};

const LANG_OPTIONS = [
  { value: 'es', label: 'ES', name: 'Español' },
  { value: 'en', label: 'EN', name: 'English' },
  { value: 'pl', label: 'PL', name: 'Polski' },
];

const Navbar = ({ links, lang = 'es' }: NavbarProps) => {
  const [theme, setTheme] = useState<'light' | 'dark'>(getInitialTheme);
  const [langOpen, setLangOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  // Sincronizar el atributo data-theme del DOM cuando cambie el estado
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Bloquear scroll del body cuando el menú está abierto
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const handleLangChange = (newLang: string) => {
    window.dispatchEvent(new CustomEvent('change-language', { detail: newLang }));
    setLangOpen(false);
  };

  return (
    <div className="navbar-container">
      <nav className={`navbar-pill${menuOpen ? ' navbar-pill--open' : ''}`}>
        <button
          className={`burger-btn${menuOpen ? ' burger-btn--open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menú"
          type="button"
        >
          <span />
          <span />
          <span />
        </button>

        <ul className={`nav-links${menuOpen ? ' nav-links--open' : ''}`}>
          {links.map((link, index) => (
            <li key={index}>
              {link.href.startsWith('/') ? (
                <Link to={link.href} className="nav-item" onClick={() => setMenuOpen(false)}>
                  {link.label}
                </Link>
              ) : (
                <a href={link.href} className="nav-item" onClick={() => setMenuOpen(false)}>
                  {link.label}
                </a>
              )}
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

        <div className="lang-dropdown" ref={langRef}>
          <button
            className="lang-dropdown__trigger"
            onClick={() => setLangOpen(!langOpen)}
            aria-label="Cambiar idioma"
            type="button"
          >
            <GlobeIcon />
            <span className="lang-dropdown__current">{lang.toUpperCase()}</span>
          </button>

          {langOpen && (
            <ul className="lang-dropdown__menu">
              {LANG_OPTIONS.map((opt) => (
                <li key={opt.value}>
                  <button
                    className={`lang-dropdown__item${lang === opt.value ? ' lang-dropdown__item--active' : ''}`}
                    onClick={() => handleLangChange(opt.value)}
                    type="button"
                  >
                    <span className="lang-dropdown__label">{opt.label}</span>
                    <span className="lang-dropdown__name">{opt.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;