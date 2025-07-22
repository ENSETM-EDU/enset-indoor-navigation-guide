import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, User, Clock, MapPin, AlertCircle, Loader2, GraduationCap, Navigation, ChevronDown, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import InstructionsDialog from '../components/InstructionsDialog';

interface StudentData {
  id: string;
  nom: string;
  prenom: string;
  numero_examen: number;
  salle_examen: string;
  epreuve: string;
}

interface ExamInfo {
  name: string;
  cne: string;
  salle: string;
  numeroExamen: number;
  heure: string;
  porte: string;
  epreuve: string;
  epreuveNom: string;
  dateExamen: string;
}

const ConcoursEnset: React.FC = () => {
  const [cne, setCne] = useState<string>('');
  const [selectedFiliere, setSelectedFiliere] = useState<string>('gm');
  const [examInfo, setExamInfo] = useState<ExamInfo | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [showInstructions, setShowInstructions] = useState<boolean>(false);
  const { isDark } = useTheme();
  const navigate = useNavigate();

  // Définition des filières disponibles
  const filieres = [
    {
      value: 'mi',
      label: 'Génie Informatique',
      specialites: ['II-BDCC', 'II-CCN', 'GLSID']
    },
    {
      value: 'gm',
      label: 'Génie Mécanique',
      specialites: ['GIL', 'GMSI']
    },
    {
      value: 'ge',
      label: 'Génie Électrique',
      specialites: ['GECSI', 'GEER']
    }
  ];

  // Fonction pour commencer la navigation
  const startNavigation = () => {
    if (examInfo) {
      // Convertir la salle d'examen en identifiant de destination
      let destination = '';
      
      // Mapping des salles vers les destinations de navigation
      if (examInfo.salle.includes('Amphithéâtre 1')) {
        destination = 'Amphi1';
      } else if (examInfo.salle.includes('Amphithéâtre 2')) {
        destination = 'Amphi2';
      } else if (examInfo.salle.includes('Amphithéâtre 3')) {
        destination = 'Amphi3';
      } else if (examInfo.salle.includes('Amphithéâtre 4')) {
        destination = 'Amphi4';
      } else if (examInfo.salle.includes('Amphithéâtre 5')) {
        destination = 'Amphi5';
      } else if (examInfo.salle.includes('Amphithéâtre Principal')) {
        destination = 'Amphitheatre';
      } else if (examInfo.salle.includes('Salle 1')) {
        destination = 'Salle1';
      } else if (examInfo.salle.includes('Salle 2')) {
        destination = 'Salle2';
      } else if (examInfo.salle.includes('Salle 3')) {
        destination = 'Salle3';
      } else if (examInfo.salle.includes('Salle 4')) {
        destination = 'Salle4';
      } else if (examInfo.salle.includes('Salle 5')) {
        destination = 'Salle5';
      } else if (examInfo.salle.includes('Salle 6')) {
        destination = 'Salle6';
      } else {
        // Fallback vers amphithéâtre si la salle n'est pas reconnue
        destination = 'Amphitheatre';
      }
      
      // Créer l'ID de navigation basé sur la porte et la destination
      const navigationId = `Porte2To${destination}`;
      
      // Rediriger vers la page de navigation
      navigate(`/navigate/${navigationId}`);
    }
  };

  // Animation des bulles flottantes
  const FloatingBubbles = () => {
    const bubbles = Array.from({ length: 8 }, (_, i) => i);
    
    return (
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {bubbles.map((bubble) => (
          <motion.div
            key={bubble}
            className={`absolute rounded-full ${
              isDark 
                ? 'bg-gradient-to-br from-blue-400/10 to-blue-500/20' 
                : 'bg-gradient-to-br from-blue-200/20 to-blue-300/30'
            }`}
            style={{
              width: Math.random() * 100 + 50,
              height: Math.random() * 100 + 50,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              x: [0, Math.random() * 50 - 25, 0],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    );
  };

  // Composant pour les instructions - maintenant importé depuis components/InstructionsDialog.tsx

  // Fonction pour obtenir les informations d'épreuve
  const getEpreuveInfo = (epreuve: string) => {
    const epreuveMapping: { [key: string]: { nom: string; date: string; heure: string } } = {
      'GM': { nom: 'Génie Mécanique', date: 'Mardi 22/07/2025', heure: '08:30 - 11:30' },
      'MI': { nom: 'Génie Informatique', date: 'Mardi 22/07/2025', heure: '14:30 - 17:30' },
      'GE': { nom: 'Génie Électrique', date: 'Mercredi 23/07/2025', heure: '08:30 - 11:30' },
    };
    return epreuveMapping[epreuve] || { nom: epreuve, date: 'Date à confirmer', heure: '08:30 - 11:30' };
  };

  // Fonction pour obtenir les informations de la salle
  const getSalleInfo = (salleExamen: string) => {
    const salleMapping: { [key: string]: { nom: string; porte: string } } = {
      'amphi1': { nom: 'Amphithéâtre 1', porte: 'Porte 2' },
      'amphi2': { nom: 'Amphithéâtre 2', porte: 'Porte 2' },
      'amphi3': { nom: 'Amphithéâtre 3', porte: 'Porte 2' },
      'amphi4': { nom: 'Amphithéâtre 4', porte: 'Porte 2' },
      'amphi5': { nom: 'Amphithéâtre 5', porte: 'Porte 2' },
      'amphitheatre': { nom: 'Amphithéâtre Principal', porte: 'Porte 1' },
      'salle1': { nom: 'Salle 1', porte: 'Porte 2' },
      'salle2': { nom: 'Salle 2', porte: 'Porte 2' },
      'salle3': { nom: 'Salle 3', porte: 'Porte 2' },
      'salle4': { nom: 'Salle 4', porte: 'Porte 2' },
      'salle5': { nom: 'Salle 5', porte: 'Porte 2' },
      'salle6': { nom: 'Salle 6', porte: 'Porte 2' },
    };
    return salleMapping[salleExamen] || { nom: salleExamen, porte: 'Porte 1' };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!cne.trim()) {
      setError('Veuillez saisir votre numéro CNE');
      return;
    }

    if (!selectedFiliere) {
      setError('Veuillez sélectionner une filière');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Charger les données depuis le fichier JSON correspondant à la filière sélectionnée
      const response = await fetch(`/cnc-enset-student-${selectedFiliere}.json`);
      
      if (!response.ok) {
        throw new Error('Impossible de charger les données');
      }

      const studentsData: StudentData[] = await response.json();
      
      // Rechercher l'étudiant par CNE (id dans le JSON)
      const student = studentsData.find(s => s.id.toLowerCase() === cne.toLowerCase());
      
      if (!student) {
        setError('CNE non trouvé dans notre base de données pour cette filière. Veuillez vérifier votre numéro ou changer de filière.');
        return;
      }

      // Obtenir les informations de la salle et de l'épreuve
      const salleInfo = getSalleInfo(student.salle_examen);
      const epreuveInfo = getEpreuveInfo(student.epreuve);
      
      // Transformer les données pour l'affichage
      setExamInfo({
        name: `${student.prenom} ${student.nom}`,
        cne: student.id,
        salle: salleInfo.nom,
        numeroExamen: student.numero_examen,
        heure: epreuveInfo.heure,
        porte: salleInfo.porte,
        epreuve: student.epreuve,
        epreuveNom: epreuveInfo.nom,
        dateExamen: epreuveInfo.date
      });
      
    } catch (err) {
      console.error('Erreur lors de la recherche:', err);
      setError('Une erreur est survenue lors de la recherche. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setCne('');
    setSelectedFiliere('');
    setExamInfo(null);
    setError('');
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 relative ${
      isDark 
        ? 'bg-gradient-to-br from-gray-900 via-slate-800 to-blue-900' 
        : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100'
    }`}>
      <FloatingBubbles />
      
      {/* Instructions Dialog */}
      <InstructionsDialog 
        isOpen={showInstructions} 
        onClose={() => setShowInstructions(false)} 
      />
      
      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          {/* Icon éducation */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full shadow-lg mb-6"
          >
            <GraduationCap className="w-10 h-10 text-white" />
          </motion.div> 

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className={`text-2xl sm:text-3xl md:text-5xl font-bold mb-4 ${
              isDark ? 'text-gray-100' : 'text-slate-800'
            }`}
          >
            Bienvenue à l'<span className="text-blue-600">ENSET Mohammedia</span>
          </motion.h1>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className={`text-lg sm:text-xl md:text-3xl font-semibold mb-6 ${
              isDark ? 'text-blue-400' : 'text-blue-700'
            }`}
          >
            Concours ENSET – Session 2025
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className={`text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed ${
              isDark ? 'text-gray-300' : 'text-slate-600'
            }`}
          >
            Merci de vous présenter ici pour accéder à vos informations d'examen.<br />
            Veuillez saisir votre numéro de CNE pour être guidé vers votre salle d'examen.
          </motion.p>
          
          {/* Bouton d'aide */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="mt-6"
          >
            <motion.button
              onClick={() => setShowInstructions(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                isDark 
                  ? 'bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-600/30' 
                  : 'bg-blue-100 hover:bg-blue-200 text-blue-700 border border-blue-200'
              }`}
            >
              <Info className="w-4 h-4" />
              <span className="text-sm">Guide d'utilisation</span>
            </motion.button>
          </motion.div>
        </motion.div>

        {/* Formulaire principal ou informations d'examen */}
        <div className="max-w-lg mx-auto">
          <AnimatePresence mode="wait">
            {!examInfo ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5 }}
                className={`backdrop-blur-lg rounded-2xl shadow-xl p-8 border ${
                  isDark 
                    ? 'bg-gray-800/80 border-gray-700/50' 
                    : 'bg-white/80 border-white/20'
                }`}
              >
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Sélection de filière */}
                  <div>
                    <label htmlFor="filiere" className={`block text-xs sm:text-sm font-semibold mb-3 ${
                      isDark ? 'text-gray-200' : 'text-slate-700'
                    }`}>
                      Filière d'examen
                    </label>
                    <div className="relative">
                      <GraduationCap className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 ${
                        isDark ? 'text-gray-400' : 'text-slate-400'
                      }`} />
                      <ChevronDown className={`absolute right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 pointer-events-none ${
                        isDark ? 'text-gray-400' : 'text-slate-400'
                      }`} />
                      <select
                        id="filiere"
                        value={selectedFiliere}
                        onChange={(e) => setSelectedFiliere(e.target.value)}
                        className={`w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-3 sm:py-4 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-base sm:text-lg font-medium appearance-none cursor-pointer ${
                          isDark 
                            ? 'bg-gray-700/70 border-gray-600 text-gray-100' 
                            : 'bg-white/70 border-slate-200 text-slate-900'
                        }`}
                        disabled={isLoading}
                      >
                        <option value="">Sélectionnez votre filière</option>
                        {filieres.map((filiere) => (
                          <option key={filiere.value} value={filiere.value}>
                            {filiere.label} ({filiere.specialites.join(', ')})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Champ CNE */}
                  <div>
                    <label htmlFor="cne" className={`block text-xs sm:text-sm font-semibold mb-3 ${
                      isDark ? 'text-gray-200' : 'text-slate-700'
                    }`}>
                      Numéro CNE
                    </label>
                    <div className="relative">
                      <User className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 ${
                        isDark ? 'text-gray-400' : 'text-slate-400'
                      }`} />
                      <input
                        type="text"
                        id="cne"
                        value={cne}
                        onChange={(e) => setCne(e.target.value.toUpperCase())}
                        placeholder="Ex: C843584730"
                        className={`w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-base sm:text-lg font-medium ${
                          isDark 
                            ? 'bg-gray-700/70 border-gray-600 text-gray-100 placeholder-gray-400' 
                            : 'bg-white/70 border-slate-200 text-slate-900 placeholder-slate-400'
                        }`}
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex items-center gap-2 p-3 rounded-lg border ${
                        isDark 
                          ? 'text-red-400 bg-red-900/50 border-red-800' 
                          : 'text-red-600 bg-red-50 border-red-200'
                      }`}
                    >
                      <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="text-xs sm:text-sm font-medium">{error}</span>
                    </motion.div>
                  )}

                  <motion.button
                    type="submit"
                    disabled={isLoading || !cne.trim() || !selectedFiliere}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 sm:py-4 px-4 sm:px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                        <span className="text-sm sm:text-base">Recherche en cours...</span>
                      </>
                    ) : (
                      <>
                        <Search className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span className="text-sm sm:text-base">Afficher mon parcours</span>
                      </>
                    )}
                  </motion.button>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="results"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                {/* Carte d'informations candidat */}
                <div className={`backdrop-blur-lg rounded-2xl shadow-xl p-8 border ${
                  isDark 
                    ? 'bg-gray-800/90 border-gray-700/50' 
                    : 'bg-white/90 border-white/20'
                }`}>
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <User className="w-8 h-8 text-white" />
                    </div>
                    <h3 className={`text-xl sm:text-2xl font-bold mb-2 ${
                      isDark ? 'text-gray-100' : 'text-slate-800'
                    }`}>Informations confirmées</h3>
                    <p className={`text-sm sm:text-base ${isDark ? 'text-gray-300' : 'text-slate-600'}`}>
                      Votre place d'examen a été trouvée
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className={`flex items-center justify-between p-3 sm:p-4 rounded-xl ${
                      isDark ? 'bg-gray-700/50' : 'bg-slate-50'
                    }`}>
                      <span className={`font-semibold text-sm sm:text-base ${
                        isDark ? 'text-gray-300' : 'text-slate-700'
                      }`}>Nom complet</span>
                      <span className={`font-medium text-sm sm:text-base ${
                        isDark ? 'text-gray-100' : 'text-slate-800'
                      }`}>{examInfo.name}</span>
                    </div>
                    
                    <div className={`flex items-center justify-between p-3 sm:p-4 rounded-xl ${
                      isDark ? 'bg-gray-700/50' : 'bg-slate-50'
                    }`}>
                      <span className={`font-semibold text-sm sm:text-base ${
                        isDark ? 'text-gray-300' : 'text-slate-700'
                      }`}>CNE</span>
                      <span className={`font-medium text-sm sm:text-base ${
                        isDark ? 'text-gray-100' : 'text-slate-800'
                      }`}>{examInfo.cne}</span>
                    </div>
                    
                    <div className={`flex items-center justify-between p-4 rounded-xl border ${
                      isDark 
                        ? 'bg-green-900/30 border-green-700' 
                        : 'bg-green-50 border-green-200'
                    }`}>
                      <div className="flex items-center gap-2">
                        <GraduationCap className={`w-5 h-5 ${
                          isDark ? 'text-green-400' : 'text-green-600'
                        }`} />
                        <span className={`text-sm font-medium ${
                          isDark ? 'text-green-300' : 'text-green-700'
                        }`}>Épreuve</span>
                      </div>
                      <div className="text-right">
                        <div className={`font-bold ${
                          isDark ? 'text-green-200' : 'text-green-800'
                        }`}>{examInfo.epreuveNom}</div>
                        <div className={`text-sm ${
                          isDark ? 'text-green-300' : 'text-green-600'
                        }`}>({examInfo.epreuve})</div>
                      </div>
                    </div>
                    
                    <div className={`flex items-center justify-between p-4 rounded-xl border ${
                      isDark 
                        ? 'bg-yellow-900/30 border-yellow-700' 
                        : 'bg-yellow-50 border-yellow-200'
                    }`}>
                      <div className="flex items-center gap-2">
                        <Clock className={`w-5 h-5 ${
                          isDark ? 'text-yellow-400' : 'text-yellow-600'
                        }`} />
                        <span className={`text-sm font-medium ${
                          isDark ? 'text-yellow-300' : 'text-yellow-700'
                        }`}>Date d'examen</span>
                      </div>
                      <span className={`font-bold ${
                        isDark ? 'text-yellow-200' : 'text-yellow-800'
                      }`}>{examInfo.dateExamen}</span>
                    </div>
                    
                    <div className={`flex items-center justify-between p-4 rounded-xl border ${
                      isDark 
                        ? 'bg-blue-900/30 border-blue-700' 
                        : 'bg-blue-50 border-blue-200'
                    }`}>
                      <div className="flex items-center gap-2">
                        <MapPin className={`w-5 h-5 ${
                          isDark ? 'text-blue-400' : 'text-blue-600'
                        }`} />
                        <span className={`text-sm font-medium ${
                          isDark ? 'text-blue-300' : 'text-blue-700'
                        }`}>Salle d'examen</span>
                      </div>
                      <span className={`font-bold ${
                        isDark ? 'text-blue-200' : 'text-blue-800'
                      }`}>{examInfo.salle}</span>
                    </div>
                    
                    <div className={`flex items-center justify-between p-4 rounded-xl border ${
                      isDark 
                        ? 'bg-orange-900/30 border-orange-700' 
                        : 'bg-orange-50 border-orange-200'
                    }`}>
                      <div className="flex items-center gap-2">
                        <Clock className={`w-5 h-5 ${
                          isDark ? 'text-orange-400' : 'text-orange-600'
                        }`} />
                        <span className={`text-sm font-medium ${
                          isDark ? 'text-orange-300' : 'text-orange-700'
                        }`}>Horaire d'examen</span>
                      </div>
                      <span className={`font-bold ${
                        isDark ? 'text-orange-200' : 'text-orange-800'
                      }`}>{examInfo.heure}</span>
                    </div>
                    
                    <div className={`p-4 rounded-xl border text-center ${
                      isDark 
                        ? 'bg-indigo-900/30 border-indigo-700' 
                        : 'bg-indigo-50 border-indigo-200'
                    }`}>
                      <div className={`text-sm font-medium mb-1 ${
                        isDark ? 'text-indigo-300' : 'text-indigo-700'
                      }`}>N° Examen</div>
                      <div className={`font-bold ${
                        isDark ? 'text-indigo-200' : 'text-indigo-800'
                      }`}>{examInfo.numeroExamen}</div>
                    </div>
                  </div>
                </div>

                {/* Boutons d'action */}
                <div className="flex gap-4">
                  <motion.button
                    onClick={startNavigation}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-3 sm:py-4 px-4 sm:px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <Navigation className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="text-sm sm:text-base">Suivre le parcours</span>
                  </motion.button>
                  
                  <motion.button
                    onClick={resetForm}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`px-4 sm:px-6 py-3 sm:py-4 border font-semibold rounded-xl transition-all duration-200 text-sm sm:text-base ${
                      isDark 
                        ? 'bg-gray-800/80 border-gray-600 text-gray-200 hover:bg-gray-700/80' 
                        : 'bg-white/80 border-slate-200 text-slate-700 hover:bg-white'
                    }`}
                  >
                    Nouvelle recherche
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.5 }}
          className="mt-16 text-center"
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <img 
              src="/logo192.png" 
              alt="ENSET Mohammedia" 
              className="h-12 w-auto"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
          <p className={`text-sm ${
            isDark ? 'text-gray-400' : 'text-slate-500'
          }`}>
            © ENSET Mohammedia - Concours ENSET 2025
          </p>
          <p className={`text-xs mt-2 ${
            isDark ? 'text-gray-500' : 'text-slate-400'
          }`}>
            École Normale Supérieure de l'Enseignement Technique
          </p>
        </motion.footer>
      </div>
    </div>
  );
};

export default ConcoursEnset;
