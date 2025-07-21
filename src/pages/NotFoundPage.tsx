import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, MapPin } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-8 bg-gradient-to-br from-white via-blue-50 to-blue-100 fixed inset-0 z-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-12 max-w-4xl mx-auto relative z-10"
      >
        {/* Logo section at the top */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex items-center justify-center space-x-3 mb-8"
        >
          <div className="w-12 h-12 flex items-center justify-center">
            <img 
              src="/logo512.png" 
              alt="ENSET Mohammedia Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <div className="text-left">
            <h1 className="text-xl font-semibold text-gray-900 leading-tight">
              ENSET Mohammedia
            </h1>
            <p className="text-sm text-gray-500">
              Navigation Guide
            </p>
          </div>
        </motion.div>
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <MapPin className="w-24 h-24 text-gray-400 mx-auto mb-6" />
          <h1 className="text-6xl md:text-8xl font-bold text-gray-300 mb-4 font-poppins">
            404
          </h1>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-2xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight font-poppins"
        >
          Oups ! Vous semblez être
          <span className="gradient-bg bg-clip-text text-transparent block mt-2">
            perdus dans l'ENSET
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-12 leading-relaxed font-poppins"
        >
          La page que vous recherchez n'existe pas ou a été déplacée. 
          Utilisez la navigation pour retourner à l'accueil ou scannez un QR Code pour commencer votre parcours.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/')}
            className="button-primary text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-lg flex items-center space-x-3 font-poppins"
          >
            <Home className="w-6 h-6" />
            <span>Retour à l'Accueil</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-1)}
            className="button-secondary text-gray-700 px-8 py-4 rounded-2xl font-semibold text-lg shadow-lg flex items-center space-x-3 font-poppins"
          >
            <ArrowLeft className="w-6 h-6" />
            <span>Page Précédente</span>
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Decorative background elements */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute inset-0 overflow-hidden pointer-events-none"
      >
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-200 rounded-full opacity-20 blur-xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-blue-300 rounded-full opacity-15 blur-xl"></div>
        <div className="absolute top-1/2 right-1/3 w-24 h-24 bg-blue-100 rounded-full opacity-25 blur-xl"></div>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;
