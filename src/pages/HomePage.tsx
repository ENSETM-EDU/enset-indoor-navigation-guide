import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Calendar, GraduationCap, Building2 } from 'lucide-react';

// Main categories for organized navigation
const categories = [
  { 
    name: 'Événements', 
    route: '/evenements', 
    description: 'Découvrir tous les événements organisés à l\'ENSET',
    icon: Calendar
  },
  { 
    name: 'Concours', 
    route: '/concours', 
    description: 'Accéder aux différents concours disponibles',
    icon: GraduationCap
  },
  { 
    name: 'Services', 
    route: '/services', 
    description: 'Découvrir tous les services de l\'ENSET',
    icon: Building2
  },
];

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


        {/* Main categories navigation */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {categories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 + index * 0.2 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(category.route)}
              className="button-primary text-white p-8 rounded-2xl cursor-pointer shadow-lg font-poppins group"
            >
              <div className="flex justify-center mb-4">
                <category.icon size={48} className="text-white" />
              </div>
              <h3 className="text-2xl font-semibold mb-3">{category.name}</h3>
              <p className="text-sm opacity-90 leading-relaxed">{category.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default HomePage;