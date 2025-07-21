import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home } from 'lucide-react';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const handleHomeClick = () => {
    navigate('/');
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Show header when scrolling up, hide when scrolling down
      setIsVisible(currentScrollY < lastScrollY || currentScrollY < 50);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const headerStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 50,
    background: 'rgba(255, 255, 255, 0.7)',
    backdropFilter: 'blur(10px)',
    borderBottom: '1px solid rgba(229, 231, 235, 0.2)',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)',
    transform: `translateY(${isVisible ? '0' : '-100%'})`,
    opacity: isVisible ? 1 : 0,
    transition: 'transform 0.3s ease, opacity 0.3s ease'
  };

  return (
    <header style={headerStyle}>
      <div className="container mx-auto px-3 sm:px-4 py-2.5 sm:py-3">
        <div className="flex items-center justify-between">
          {/* Logo section - clickable et plus compact */}
          <button 
            onClick={handleHomeClick}
            className="flex items-center space-x-2 sm:space-x-3 hover:opacity-80 transition-all duration-200 group"
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center">
              <img 
                src="/logo512.png" 
                alt="ENSET Mohammedia Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <div className="text-left">
              <h1 className="text-base sm:text-lg font-semibold text-gray-900 leading-tight">
                ENSET
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">
                Guide de navigation
              </p>
            </div>
          </button>

          {/* Home button - style professionnel */}
          <button
            onClick={handleHomeClick}
            className="flex items-center space-x-2 px-4 py-2.5 bg-white/90 hover:bg-white border border-gray-200/60 hover:border-gray-300/60 text-gray-700 hover:text-gray-900 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md backdrop-blur-sm group"
          >
            <Home className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
            <span className="font-medium text-sm hidden sm:inline">
              Accueil
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
