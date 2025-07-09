import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, ArrowLeft } from 'lucide-react';

const GenderSelectionPage: React.FC = () => {
  const { type } = useParams<{ type: string }>();
  const navigate = useNavigate();

  const handleGenderSelection = (gender: 'homme' | 'femme') => {
    const routeMap = {
      toilettes: {
        homme: 'AmphitheatreToToilettesHomme',
        femme: 'AmphitheatreToToilettesFemme'
      },
      mosquee: {
        homme: 'AmphitheatreToMosqueeHomme',
        femme: 'AmphitheatreToMosqueeFemme'
      }
    };

    const route = routeMap[type as keyof typeof routeMap]?.[gender];
    if (route) {
      navigate(`/navigate/${route}`);
    }
  };

  const getTitle = () => {
    switch (type) {
      case 'toilettes':
        return 'Sélection des Toilettes';
      case 'mosquee':
        return 'Sélection de la Mosquée';
      default:
        return 'Sélection';
    }
  };

  const getDescription = () => {
    switch (type) {
      case 'toilettes':
        return 'Choisissez la direction vers les toilettes appropriées';
      case 'mosquee':
        return 'Choisissez la direction vers la mosquée appropriée';
      default:
        return 'Faites votre choix';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md mx-auto"
      >
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-gray-200/50 shadow-xl">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-900 to-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {getTitle()}
            </h2>
            <p className="text-gray-600">
              {getDescription()}
            </p>
          </div>

          <div className="space-y-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleGenderSelection('homme')}
              className="w-full button-primary text-white px-6 py-4 rounded-2xl font-medium text-lg"
            >
              Homme
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleGenderSelection('femme')}
              className="w-full button-primary text-white px-6 py-4 rounded-2xl font-medium text-lg"
            >
              Femme
            </motion.button>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/')}
              className="button-secondary text-gray-700 px-6 py-3 rounded-2xl font-medium flex items-center space-x-2 mx-auto"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Retour à l'accueil</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default GenderSelectionPage;