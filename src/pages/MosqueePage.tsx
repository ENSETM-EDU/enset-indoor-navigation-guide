import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, ArrowRight } from 'lucide-react';

const MosqueePage: React.FC = () => {
  const { pointDepart } = useParams<{ pointDepart: string }>();
  const navigate = useNavigate();

  // Fonction pour convertir une chaîne en PascalCase
  const toPascalCase = (str: string): string => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const handleGenderSelection = (gender: 'homme' | 'femme') => {
    // S'assurer que le point de départ est en PascalCase
    const pointDepartPascalCase = toPascalCase(pointDepart || 'Porte1');
    const genderSuffix = gender === 'homme' ? 'Homme' : 'Femme';
    const navigationId = `${pointDepartPascalCase}ToMosquee${genderSuffix}`;
    navigate(`/navigate/${navigationId}`);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-green-50 to-green-100 flex flex-col">
      {/* Header */}
      <div className="px-4 py-6">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          onClick={handleGoBack}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="font-medium">Retour</span>
        </motion.button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-md w-full"
        >
          {/* Icon and Title */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full shadow-lg mb-6"
            >
              <span className="text-white text-2xl">🕌</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-3xl font-bold text-gray-900 mb-4"
            >
              Mosquée
            </motion.h1>
          </div>

          {/* Gender Selection Buttons */}
          <div className="space-y-4">
            <motion.button
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleGenderSelection('homme')}
              className="w-full bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold text-lg">♂</span>
                  </div>
                  <div className="text-left">
                    <h3 className="text-xl font-bold text-gray-900">Mosquée Hommes</h3>
                  </div>
                </div>
                <ArrowRight className="w-6 h-6 text-gray-400 group-hover:text-green-600 transition-colors" />
              </div>
            </motion.button>

            <motion.button
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 1.2 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleGenderSelection('femme')}
              className="w-full bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center">
                    <span className="text-white font-bold text-lg">♀</span>
                  </div>
                  <div className="text-left">
                    <h3 className="text-xl font-bold text-gray-900">Mosquée Femmes</h3>
                  </div>
                </div>
                <ArrowRight className="w-6 h-6 text-gray-400 group-hover:text-pink-600 transition-colors" />
              </div>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MosqueePage;
