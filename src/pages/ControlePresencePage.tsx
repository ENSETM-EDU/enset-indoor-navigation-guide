import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Users, CheckCircle, Clock, FileText, Star, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface VersionCard {
  id: string;
  version: string;
  title: string;
  description: string;
  features: string[];
  status: 'active' | 'coming-soon' | 'beta';
  route: string;
  releaseDate?: string;
}

const ControlePresencePage: React.FC = () => {
  const navigate = useNavigate();

  const versions: VersionCard[] = [
    {
      id: 'v1',
      version: 'Version 1.0',
      title: 'Contrôle de Présence Standard',
      description: 'Système complet de contrôle de présence avec validation dual et génération de rapports PDF.',
      features: [
        'Recherche par numéro d\'examen',
        'Validation dual (surveillant + étudiant)',
        'Gestion des sessions par département',
        'Génération de rapports PDF',
        'Statistiques en temps réel',
        'Sauvegarde automatique des données'
      ],
      status: 'active',
      route: '/controle-presence-v1',
      releaseDate: 'Août 2025'
    },
    {
      id: 'v2',
      version: 'Version 2.0',
      title: 'Contrôle de Présence Avancé',
      description: 'Version améliorée avec reconnaissance faciale et fonctionnalités avancées.',
      features: [
        'Reconnaissance faciale automatique',
        'Interface tactile optimisée',
        'Intégration base de données',
        'Notifications en temps réel',
        'Dashboard administrateur',
        'Export multi-formats'
      ],
      status: 'coming-soon',
      route: '/controle-presence-v2',
      releaseDate: 'Septembre 2025'
    },
    {
      id: 'v3',
      version: 'Version 3.0',
      title: 'Contrôle de Présence IA',
      description: 'Version futuriste avec intelligence artificielle et analyse prédictive.',
      features: [
        'IA de détection de présence',
        'Analyse comportementale',
        'Prédiction d\'absence',
        'Interface vocale',
        'Intégration IoT',
        'Analytics avancés'
      ],
      status: 'coming-soon',
      route: '/controle-presence-v3',
      releaseDate: 'Décembre 2025'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            <CheckCircle size={16} className="mr-1" />
            Disponible
          </span>
        );
      case 'beta':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            <Star size={16} className="mr-1" />
            Bêta
          </span>
        );
      case 'coming-soon':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
            <Clock size={16} className="mr-1" />
            Bientôt disponible
          </span>
        );
      default:
        return null;
    }
  };

  const handleVersionSelect = (version: VersionCard) => {
    if (version.status === 'active') {
      navigate(version.route);
    } else {
      alert(`${version.version} sera disponible ${version.releaseDate}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100 px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header avec bouton retour */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          onClick={() => navigate('/concours')}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors duration-200"
        >
          <ArrowLeft size={20} />
          <span className="font-poppins">Retour aux concours</span>
        </motion.button>

        {/* Titre principal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 font-poppins">
            <span className="gradient-bg bg-clip-text text-transparent">Contrôle de Présence</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto font-poppins">
            Choisissez la version du système de contrôle de présence qui correspond à vos besoins
          </p>
        </motion.div>

        {/* Grille des versions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {versions.map((version, index) => (
            <motion.div
              key={version.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className={`bg-white rounded-2xl shadow-lg overflow-hidden transform transition-all duration-300 hover:shadow-xl ${
                version.status === 'active' 
                  ? 'hover:scale-105 cursor-pointer border-2 border-transparent hover:border-blue-200' 
                  : 'opacity-75'
              }`}
              onClick={() => handleVersionSelect(version)}
            >
              {/* En-tête de la carte */}
              <div className="p-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-bold font-poppins">{version.version}</h3>
                  {getStatusBadge(version.status)}
                </div>
                <h4 className="text-lg font-semibold mb-2 font-poppins">{version.title}</h4>
                <p className="text-blue-100 text-sm font-poppins">{version.description}</p>
              </div>

              {/* Contenu de la carte */}
              <div className="p-6">
                {/* Date de sortie */}
                {version.releaseDate && (
                  <div className="flex items-center text-sm text-gray-600 mb-4">
                    <Clock size={16} className="mr-2" />
                    <span className="font-poppins">Sortie: {version.releaseDate}</span>
                  </div>
                )}

                {/* Liste des fonctionnalités */}
                <div className="mb-6">
                  <h5 className="text-sm font-semibold text-gray-900 mb-3 font-poppins flex items-center">
                    <FileText size={16} className="mr-2" />
                    Fonctionnalités principales
                  </h5>
                  <ul className="space-y-2">
                    {version.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-sm text-gray-600">
                        <CheckCircle size={14} className="mr-2 text-green-500 flex-shrink-0" />
                        <span className="font-poppins">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Bouton d'action */}
                <motion.button
                  whileHover={{ scale: version.status === 'active' ? 1.02 : 1 }}
                  whileTap={{ scale: version.status === 'active' ? 0.98 : 1 }}
                  className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-200 font-poppins flex items-center justify-center ${
                    version.status === 'active'
                      ? 'bg-blue-500 hover:bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                  }`}
                  disabled={version.status !== 'active'}
                >
                  {version.status === 'active' ? (
                    <>
                      <Users size={20} className="mr-2" />
                      Utiliser cette version
                      <ArrowRight size={16} className="ml-2" />
                    </>
                  ) : (
                    <>
                      <Clock size={20} className="mr-2" />
                      Bientôt disponible
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Section d'information supplémentaire */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-12 bg-white rounded-2xl shadow-lg p-8"
        >
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 font-poppins">
              Évolution du système
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto mb-6 font-poppins">
              Notre système de contrôle de présence évolue constamment pour répondre aux besoins 
              changeants de l'ENSET. Chaque version apporte des améliorations significatives en 
              termes de fonctionnalités, d'ergonomie et de performance.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 mt-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Users className="text-blue-600" size={24} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2 font-poppins">Simplicité d'usage</h3>
                <p className="text-sm text-gray-600 font-poppins">
                  Interface intuitive conçue pour tous les utilisateurs
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle className="text-green-600" size={24} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2 font-poppins">Fiabilité</h3>
                <p className="text-sm text-gray-600 font-poppins">
                  Système robuste avec sauvegarde automatique des données
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Star className="text-purple-600" size={24} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2 font-poppins">Innovation</h3>
                <p className="text-sm text-gray-600 font-poppins">
                  Technologies avancées pour une expérience optimale
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ControlePresencePage;
