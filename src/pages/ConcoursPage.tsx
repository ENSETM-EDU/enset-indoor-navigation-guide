import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const ConcoursPage: React.FC = () => {
  const navigate = useNavigate();

  const concoursOptions = [
    { name: 'Concours ENSET', route: '/concours-enset', description: 'Accéder au concours ENSET' },
    { name: 'Inscription ENSET 1er année', route: '/inscription-enset', description: 'Accéder à l\'inscription ENSET 1er année' },
  ];

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-12 max-w-4xl mx-auto"
      >
        {/* Back button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          onClick={() => navigate('/')}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors duration-200"
        >
          <ArrowLeft size={20} />
          <span className="font-poppins">Retour à l'accueil</span>
        </motion.button>

        <motion.h1
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-3xl md:text-5xl font-bold text-gray-900 mb-8 leading-tight font-poppins"
        >
          <span className="gradient-bg bg-clip-text text-transparent">Concours</span>
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed font-poppins"
        >
          Choisissez le concours auquel vous souhaitez accéder
        </motion.p>

        {/* Concours options */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {concoursOptions.map((option, index) => (
            <motion.div
              key={option.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(option.route)}
              className="button-primary text-white p-6 rounded-2xl cursor-pointer shadow-lg font-poppins"
            >
              <h3 className="text-xl font-semibold mb-2">{option.name}</h3>
              <p className="text-sm opacity-90">{option.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default ConcoursPage;
