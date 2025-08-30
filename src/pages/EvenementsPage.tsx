import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, GraduationCap, Building2, Wrench } from 'lucide-react';

const EvenementsPage: React.FC = () => {
  const navigate = useNavigate();

  const eventTypes = [
    { 
      name: 'Cérémonies', 
      route: '/ceremonie', 
      description: 'Cérémonies de remise des diplômes et événements officiels',
      icon: GraduationCap
    },
    { 
      name: 'Congrès', 
      route: '/ceremonie', 
      description: 'Congrès académiques et scientifiques',
      icon: Building2
    },
    { 
      name: 'Workshops', 
      route: '/ceremonie', 
      description: 'Ateliers de formation et sessions pratiques',
      icon: Wrench
    },
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
          <span className="gradient-bg bg-clip-text text-transparent">Événements ENSET</span>
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed font-poppins"
        >
          Découvrez tous les types d'événements organisés à l'ENSET
        </motion.p>

        {/* Event types */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {eventTypes.map((eventType, index) => (
            <motion.div
              key={eventType.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 + index * 0.2 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(eventType.route)}
              className="button-primary text-white p-8 rounded-2xl cursor-pointer shadow-lg font-poppins group"
            >
              <div className="flex justify-center mb-4">
                <eventType.icon size={48} className="text-white" />
              </div>
              <h3 className="text-2xl font-semibold mb-3">{eventType.name}</h3>
              <p className="text-sm opacity-90 leading-relaxed">{eventType.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default EvenementsPage;
