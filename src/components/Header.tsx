import React, { useState, useEffect } from 'react';
import { Home } from 'lucide-react';

const Header: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const handleHomeClick = () => {
    // Remplacez par votre navigation
    console.log('Navigation vers Home');
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
    background: 'rgba(255, 255, 255, 0.90)',
    backdropFilter: 'blur(12px)',
    borderBottom: '1px solid rgba(229, 231, 235, 0.3)',
    boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
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
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center shadow-md overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100 group-hover:shadow-lg transition-shadow">
              <img 
                src="/logo512.png" 
                alt="ENSET Mohammedia Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            <div className="text-left">
              <h1 className="text-base sm:text-lg font-semibold text-gray-900 leading-tight">
                ENSET Mohammedia
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">
                Navigation Guide
              </p>
            </div>
          </button>

          {/* Home button - adaptatif mobile */}
          <button
            onClick={handleHomeClick}
            className="flex items-center space-x-1.5 sm:space-x-2 px-2.5 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg transition-all duration-200 shadow-md hover:shadow-lg active:scale-95"
          >
            <Home className="w-4 h-4" />
            <span className="font-medium text-sm sm:text-base">
              Home
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;