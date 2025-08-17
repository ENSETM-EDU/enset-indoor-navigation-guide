import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// List of available pages with their routes and display names
const pages = [
  { name: 'Concours Enset', route: '/concours-enset' },
  { name: 'Cérémonie Ensad', route: '/ensad/porte1' },
  { name: 'Cérémonie Enset', route: '/enset/porte2' },
  { name: 'Explorer', route: '/explorer' },
  { name: 'Home', route: '/' },
  { name: 'Inscription Enset', route: '/inscription-enset' },
  { name: 'Mosquee', route: '/mosquee/amphitheatre' },
  { name: 'Navigation', route: '/navigation/porte1ToAmphitheatre' },
  { name: 'Navigation Video', route: '/video-navigate/test' },
  { name: 'Not Found', route: '/not-found' },
  { name: 'Toilettes', route: '/toilettes/amphitheatre' },
];
//
const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-8">

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
          École Normale Supérieure de l'Enseignement Technique
        </motion.p>


        {/* List of all available pages as navigation options */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {pages.map((page) => (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(page.route)}
              className="button-primary text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-lg flex items-center space-x-3 mx-auto font-poppins"
            >
              <GraduationCap className="w-6 h-6" />
              <span>{page.name}</span>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
//
export default HomePage;