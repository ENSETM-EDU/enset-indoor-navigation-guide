import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Clock, Navigation, Home } from 'lucide-react';

interface PathData {
  id: string;
  from: string;
  to: string;
  time: string;
  steps: number;
  path: string;
  title: string;
  description: string;
  floor_level: number;
}

const DestinationPage: React.FC = () => {
  const { destination } = useParams<{ destination: string }>();
  const navigate = useNavigate();
  const [availablePaths, setAvailablePaths] = useState<PathData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPaths = async () => {
      try {
        const response = await fetch('/paths.json');
        const paths: PathData[] = await response.json();
        
        // Find all paths that lead to this destination
        const pathsToDestination = paths.filter(path => 
          path.to.toLowerCase() === destination?.toLowerCase() ||
          path.to.toLowerCase().includes(destination?.toLowerCase() || '')
        );
        
        setAvailablePaths(pathsToDestination);
        setLoading(false);
        
        // If only one path available, redirect directly
        if (pathsToDestination.length === 1) {
          navigate(`/navigate/${pathsToDestination[0].id}`);
        }
        
        // If no paths found, redirect to explorer
        if (pathsToDestination.length === 0) {
          navigate('/explorer');
        }
      } catch (error) {
        console.error('Error loading paths:', error);
        setLoading(false);
      }
    };

    if (destination) {
      loadPaths();
    }
  }, [destination, navigate]);

  const getStartPointIcon = (startPoint: string) => {
    if (startPoint.includes('Porte')) return '🚪';
    if (startPoint.includes('Escalier')) return '🪜';
    if (startPoint.includes('Amphithéâtre')) return '🎭';
    return '📍';
  };

  const getFloorText = (floorLevel: number) => {
    if (floorLevel === 0) return 'Rez-de-chaussée';
    if (floorLevel === 1) return '1er étage';
    if (floorLevel === 2) return '2ème étage';
    return `${floorLevel}ème étage`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-900 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-blue-900 font-semibold">Recherche des itinéraires...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div 
          className="flex items-center justify-between mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Link to="/explorer">
            <motion.button 
              className="flex items-center space-x-2 text-blue-900 hover:text-blue-700 transition-colors"
              whileHover={{ x: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-semibold">Retour</span>
            </motion.button>
          </Link>
          <Link to="/">
            <motion.button 
              className="p-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Home className="w-5 h-5" />
            </motion.button>
          </Link>
        </motion.div>

        {/* Title */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-4">
            Itinéraires vers {destination}
          </h1>
          <p className="text-gray-600 text-lg">
            Choisissez votre point de départ
          </p>
        </motion.div>

        {/* Available Paths */}
        <div className="max-w-4xl mx-auto">
          {availablePaths.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2">
              {availablePaths.map((path, index) => (
                <motion.div
                  key={path.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-2xl">{getStartPointIcon(path.from)}</span>
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-blue-900">
                            Depuis {path.from}
                          </h3>
                          <p className="text-gray-600 text-sm">
                            {getFloorText(path.floor_level)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-1 text-green-600 font-semibold">
                          <Clock className="w-4 h-4" />
                          <span>{path.time}</span>
                        </div>
                        <p className="text-gray-500 text-sm">{path.steps} étapes</p>
                      </div>
                    </div>

                    <p className="text-gray-700 mb-6 leading-relaxed">
                      {path.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">{path.from} → {path.to}</span>
                      </div>
                      
                      <button
                        onClick={() => navigate(`/navigate/${path.id}`)}
                        className="bg-blue-900 text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition-colors duration-200 flex items-center space-x-2 font-semibold"
                      >
                        <Navigation className="w-4 h-4" />
                        <span>Commencer</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              className="text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <MapPin className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Aucun itinéraire trouvé
              </h3>
              <p className="text-gray-600 mb-8">
                Désolé, nous n'avons pas d'itinéraire disponible pour cette destination.
              </p>
              <Link to="/explorer">
                <button className="bg-blue-900 text-white px-6 py-3 rounded-lg hover:bg-blue-800 transition-colors duration-200 font-semibold">
                  Retour à l'explorateur
                </button>
              </Link>
            </motion.div>
          )}
        </div>

        {/* Quick Tip */}
        {availablePaths.length > 1 && (
          <motion.div 
            className="mt-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <div className="bg-blue-50 rounded-xl p-6 max-w-2xl mx-auto border border-blue-100">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                💡 Conseil
              </h3>
              <p className="text-blue-800">
                Choisissez l'itinéraire le plus proche de votre position actuelle pour un trajet optimal.
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default DestinationPage;
