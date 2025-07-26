import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QrCode, ChevronDown, Menu, X, Calendar, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import QRScanner from '../components/QRScanner';

const HomePage: React.FC = () => {
  const [showScanner, setShowScanner] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-8">
      {/* Desktop Navigation Tabs */}
      <div className="hidden md:flex justify-center mb-8 w-full max-w-4xl">
        <div className="flex space-x-1 bg-white/20 backdrop-blur-sm rounded-xl p-2 shadow-lg">
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center space-x-2 px-6 py-3 rounded-lg text-gray-700 hover:bg-white/50 transition-all duration-200 font-medium"
            >
              <Calendar className="w-5 h-5" />
              <span>Événement</span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} />
            </button>
            
            <AnimatePresence>
              {showDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full mt-2 left-0 w-64 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50"
                >
                  <button
                    onClick={() => {
                      navigate('/concours-enset');
                      setShowDropdown(false);
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors duration-200 text-gray-700 font-medium"
                  >
                    Concours ENSET 2025
                  </button>
                  <button
                    onClick={() => {
                      navigate('/inscription-enset');
                      setShowDropdown(false);
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors duration-200 text-gray-700 font-medium"
                  >
                    Inscription ENSET 2025
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden fixed top-4 right-4 z-50">
        <button
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          className="p-3 bg-white/20 backdrop-blur-sm rounded-full shadow-lg text-gray-700 hover:bg-white/30 transition-all duration-200"
        >
          {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Side Menu */}
      <AnimatePresence>
        {showMobileMenu && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
              onClick={() => setShowMobileMenu(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="md:hidden fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-bold text-gray-800">Menu</h2>
                  <button
                    onClick={() => setShowMobileMenu(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                  >
                    <X className="w-6 h-6 text-gray-600" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <button
                      onClick={() => {
                        navigate('/explorer');
                        setShowMobileMenu(false);
                      }}
                      className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-blue-50 rounded-lg transition-colors duration-200 w-full text-left font-semibold"
                    >
                      <MapPin className="w-5 h-5" />
                      <span>Explorer l'ENSET</span>
                    </button>
                  </div>
                  
                  <div>
                    <div className="flex items-center space-x-3 px-4 py-3 text-gray-600 font-semibold">
                      <Calendar className="w-5 h-5" />
                      <span>Événement</span>
                    </div>
                    <div className="ml-8 space-y-2">
                      <button
                        onClick={() => {
                          navigate('/concours-enset');
                          setShowMobileMenu(false);
                        }}
                        className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                      >
                        Concours ENSET 2025
                      </button>
                      <button
                        onClick={() => {
                          navigate('/inscription-enset');
                          setShowMobileMenu(false);
                        }}
                        className="block w-full text-left px-4 py-3 text-gray-700 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                      >
                        Inscription ENSET 2025
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-12 max-w-4xl mx-auto"
      >
        <motion.h1
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-3xl md:text-5xl font-bold text-gray-900 mb-8 leading-tight font-poppins"
        >
          Bienvenue à l'
          <span className="gradient-bg bg-clip-text text-transparent mt-2">ENSET</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed font-poppins"
        >
          Scannez un QR Code pour commencer votre parcours guidé.
        </motion.p>
        
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowScanner(!showScanner)}
          className="button-primary text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-lg flex items-center space-x-3 mx-auto font-poppins mb-6"
        >
          <QrCode className="w-6 h-6" />
          <span>{showScanner ? 'Fermer le Scanner' : 'Scanner QR Code'}</span>
        </motion.button>
        
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/explorer')}
          className="bg-white text-blue-900 px-8 py-4 rounded-2xl font-semibold text-lg shadow-lg flex items-center space-x-3 mx-auto font-poppins border-2 border-blue-200 hover:border-blue-300 transition-all duration-300"
        >
          <MapPin className="w-6 h-6" />
          <span>Explorer l'ENSET</span>
        </motion.button>
      </motion.div>

      {showScanner && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="mb-12"
        >
          <QRScanner onScanSuccess={() => setShowScanner(false)} />
        </motion.div>
      )}
    </div>
  );
};

export default HomePage;