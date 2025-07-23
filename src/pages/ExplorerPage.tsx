import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ChevronDown, ChevronRight, MapPin, Home, GraduationCap, Users, Coffee, DoorOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface StructureData {
  [category: string]: {
    [location: string]: string;
  }; 
}

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

const ExplorerPage = () => {
  const [structure, setStructure] = useState<StructureData>({});
  const [paths, setPaths] = useState<PathData[]>([]);
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [structureResponse, pathsResponse] = await Promise.all([
          fetch('/structure.json'),
          fetch('/paths.json')
        ]);
        
        const structureData = await structureResponse.json();
        const pathsData = await pathsResponse.json();
        
        setStructure(structureData);
        setPaths(pathsData);
        setLoading(false);
      } catch (error) {
        console.error('Error loading data:', error);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const getCategoryIcon = (category: string) => {
    const iconMap: { [key: string]: React.ReactNode } = {
      'espaces_pedagogiques': <GraduationCap className="w-6 h-6 text-blue-900" />,
      'services_essentiels': <Users className="w-6 h-6 text-green-900" />,
      'espaces_communs': <Coffee className="w-6 h-6 text-orange-900" />,
      'points_acces': <DoorOpen className="w-6 h-6 text-purple-900" />
    };
    return iconMap[category] || <MapPin className="w-6 h-6 text-gray-900" />;
  };

  const getCategoryColor = (category: string) => {
    const colorMap: { [key: string]: string } = {
      'espaces_pedagogiques': 'from-blue-100 to-blue-50',
      'services_essentiels': 'from-green-100 to-green-50',
      'espaces_communs': 'from-orange-100 to-orange-50',
      'points_acces': 'from-purple-100 to-purple-50'
    };
    return colorMap[category] || 'from-gray-100 to-gray-50';
  };

  const getCategoryTitle = (category: string) => {
    const titles: { [key: string]: string } = {
      'espaces_pedagogiques': 'Espaces Pédagogiques',
      'services_essentiels': 'Services Essentiels',
      'espaces_communs': 'Espaces Communs',
      'points_acces': 'Points d\'Accès'
    };
    return titles[category] || category;
  };

  const getNavigationPath = (location: string) => {
    // Find available paths to this destination
    const availablePaths = paths.filter(path => path.to === location);
    
    if (availablePaths.length === 0) {
      return `/destination/${encodeURIComponent(location)}`;
    }
    
    // If there's only one path, use it directly
    if (availablePaths.length === 1) {
      return `/navigate/${availablePaths[0].id}`;
    }
    
    // If multiple paths, go to destination selection page
    return `/destination/${encodeURIComponent(location)}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-900 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-blue-900 font-semibold">Chargement...</p>
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
          <Link to="/">
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
            Explorer l'ENSET
          </h1>
          <p className="text-gray-600 text-lg">
            Choisissez votre destination et naviguez facilement
          </p>
        </motion.div>

        {/* Sections */}
        <div className="max-w-4xl mx-auto space-y-6">
          {Object.entries(structure).map(([category, locations], index) => (
            <motion.div 
              key={category}
              className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <motion.button
                className={`w-full p-6 flex items-center justify-between text-left bg-gradient-to-r ${getCategoryColor(category)} hover:opacity-90 transition-all duration-300`}
                onClick={() => toggleSection(category)}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-md">
                    {getCategoryIcon(category)}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">
                      {getCategoryTitle(category)}
                    </h2>
                    <p className="text-gray-600 text-sm">
                      {Object.keys(locations).length} lieux disponibles
                    </p>
                  </div>
                </div>
                <motion.div
                  animate={{ rotate: expandedSections.includes(category) ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown className="w-6 h-6 text-gray-700" />
                </motion.div>
              </motion.button>

              <AnimatePresence>
                {expandedSections.includes(category) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="bg-white">
                      {Object.entries(locations).map(([location], locationIndex) => (
                        <Link 
                          key={location} 
                          to={getNavigationPath(location)}
                          className="block"
                        >
                          <motion.div 
                            className="p-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 flex items-center justify-between group"
                            whileHover={{ x: 5 }}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: locationIndex * 0.05 }}
                          >
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                                <MapPin className="w-4 h-4 text-gray-600 group-hover:text-blue-600" />
                              </div>
                              <div>
                                <span className="font-semibold text-gray-800 group-hover:text-blue-900 transition-colors">
                                  {location}
                                </span>
                                {/* Show available paths count */}
                                {(() => {
                                  const availablePaths = paths.filter(p => p.to === location);
                                  return availablePaths.length > 0 && (
                                    <p className="text-xs text-gray-500 group-hover:text-blue-600 transition-colors">
                                      {availablePaths.length} itinéraire{availablePaths.length > 1 ? 's' : ''} disponible{availablePaths.length > 1 ? 's' : ''}
                                    </p>
                                  );
                                })()}
                              </div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                          </motion.div>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Quick Stats */}
        <motion.div 
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <div className="bg-white rounded-xl shadow-md p-6 max-w-md mx-auto">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Navigation disponible
            </h3>
            <div className="flex justify-around text-center">
              <div>
                <div className="text-2xl font-bold text-blue-900">
                  {Object.values(structure).reduce((total, locations) => total + Object.keys(locations).length, 0)}
                </div>
                <div className="text-sm text-gray-600">Destinations</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-900">
                  {paths.length}
                </div>
                <div className="text-sm text-gray-600">Itinéraires</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ExplorerPage;
