import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, User, MapPin, AlertCircle, Loader2, GraduationCap, Navigation, ChevronDown, Check, Users, Building } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';

interface StudentData {
  id: string;
  nom: string;
  prenom: string;
  epreuve: string;
  filieres_reussies: string[];
  list: string; // "principale" | "attente"
}

interface ConfirmationInfo {
  student: StudentData;
  assignedSalle: string;
  selectedFiliere: string;
  list: string;
}

const InscriptionEnset: React.FC = () => {
  const [cne, setCne] = useState<string>('');
  const [selectedEpreuve, setSelectedEpreuve] = useState<string>('MI');
  const [foundStudent, setFoundStudent] = useState<StudentData | null>(null);
  const [confirmationInfo, setConfirmationInfo] = useState<ConfirmationInfo | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [currentStep, setCurrentStep] = useState<'search' | 'filiere-selection' | 'confirmation'>('search');
  const { isDark } = useTheme();
  const navigate = useNavigate();

  // Configuration des départements disponibles
  const epreuves = [
    { value: 'MI', label: 'Département Mathématiques et Informatique' },
    { value: 'GM', label: 'Département Génie Mécanique' },
    { value: 'GE', label: 'Département Génie Électrique' }
  ];

  // Mapping des filières vers leurs noms complets
  const filiereMapping = {
    'GLSID': 'Génie du Logiciel et Systèmes Informatiques Distribués',
    'II-BDCC': 'Ingénierie Informatique, Big Data et Cloud Computing',
    'II-CCN': 'Ingénierie Informatique, cybersécurité et confiance numérique',
    'GIL': 'Génie Industriel et Logistique',
    'GMSI': 'Génie Mécanique des Systèmes Industriels',
    'GEER': 'Génie Électrique et Energies Renouvelables',
    'GECSI': 'Génie Électrique et Contrôle des Systèmes Industriels'
  };

  // Mapping des salles pour liste principale
  const sallesPrincipales = {
    'GLSID': 'SALLE 1',
    'II-BDCC': 'SALLE 2',
    'II-CCN': 'SALLE 3',
    'GIL': 'SALLE 4',
    'GMSI': 'SALLE 5',
    'GEER': 'SALLE 6',
    'GECSI': 'AMPHI 5'
  };

  // Mapping des salles pour liste d'attente
  const sallesAttente = {
    'GLSID': 'GRAND AMPHI',
    'II-BDCC': 'GRAND AMPHI',
    'II-CCN': 'GRAND AMPHI',
    'GIL': 'AMPHI 1',
    'GMSI': 'AMPHI 2',
    'GEER': 'AMPHI 3',
    'GECSI': 'AMPHI 4'
  };

  // Fonction pour déterminer la liste (principale/attente) d'un étudiant
  // Cette information est maintenant directement disponible dans les données JSON
  const determinerListe = (student: StudentData): string => {
    // Utiliser la propriété 'list' directement depuis les données JSON
    return student.list || 'attente'; // fallback vers 'attente' si non défini
  };

  // Fonction pour obtenir la salle assignée
  const obtenirSalleAssignee = (filiere: string, liste: string): string => {
    if (liste === 'principale') {
      return sallesPrincipales[filiere as keyof typeof sallesPrincipales] || 'SALLE INCONNUE';
    } else {
      return sallesAttente[filiere as keyof typeof sallesAttente] || 'AMPHI INCONNU';
    }
  };

  // Fonction pour charger les données d'inscription
  const loadInscriptionData = async (epreuve: string): Promise<StudentData[]> => {
    try {
      const response = await fetch(`/ins-enset-student-${epreuve.toLowerCase()}.json`);
      if (!response.ok) {
        throw new Error(`Impossible de charger les données pour le département ${epreuve}`);
      }
      return await response.json();
    } catch (error) {
      throw new Error(`Erreur lors du chargement des données: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    }
  };

  // Fonction pour normaliser le CNE saisi
  const normalizeCNE = (inputCne: string): string => {
    // Supprimer tous les espaces (début, fin, milieu)
    // Convertir en majuscules
    // Supprimer les caractères non alphanumériques (sauf virgules et points pour certains CNE)
    return inputCne
      .replace(/\s+/g, '') // Supprimer tous les espaces
      .toUpperCase() // Mettre en majuscules
      .trim(); // Supprimer les espaces de début/fin (au cas où)
  };

  // Fonction de recherche d'étudiant
  const handleStudentSearch = async () => {
    if (!cne.trim()) {
      setError('Veuillez saisir votre CNE');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const students = await loadInscriptionData(selectedEpreuve);
      
      // Normaliser le CNE saisi
      const normalizedInputCne = normalizeCNE(cne);
      
      // Rechercher l'étudiant avec une comparaison flexible
      const student = students.find(s => {
        const normalizedStudentId = normalizeCNE(s.id);
        return normalizedStudentId === normalizedInputCne;
      });

      if (!student) {
        setError(`Aucun étudiant trouvé avec le CNE "${normalizedInputCne}" pour le département ${selectedEpreuve}. Vérifiez votre CNE et le département sélectionné.`);
        setFoundStudent(null);
      } else {
        setFoundStudent(student);
        setCurrentStep('filiere-selection');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Erreur lors de la recherche');
      setFoundStudent(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction de sélection de filière
  const handleFiliereSelection = (filiere: string) => {
    if (!foundStudent) return;

    const liste = determinerListe(foundStudent);
    const salle = obtenirSalleAssignee(filiere, liste);

    setConfirmationInfo({
      student: foundStudent,
      assignedSalle: salle,
      selectedFiliere: filiere,
      list: liste
    });
    setCurrentStep('confirmation');
  };

  // Fonction pour commencer la navigation
  const startNavigation = () => {
    if (!confirmationInfo) return;

    // Convertir la salle assignée en identifiant de destination
    let destination = '';
    
    const salle = confirmationInfo.assignedSalle;
    
    if (salle.includes('SALLE 1')) {
      destination = 'Salle1';
    } else if (salle.includes('SALLE 2')) {
      destination = 'Salle2';
    } else if (salle.includes('SALLE 3')) {
      destination = 'Salle3';
    } else if (salle.includes('SALLE 4')) {
      destination = 'Salle4';
    } else if (salle.includes('SALLE 5')) {
      destination = 'Salle5';
    } else if (salle.includes('SALLE 6')) {
      destination = 'Salle6';
    } else if (salle.includes('AMPHI 1')) {
      destination = 'Amphi1';
    } else if (salle.includes('AMPHI 2')) {
      destination = 'Amphi2';
    } else if (salle.includes('AMPHI 3')) {
      destination = 'Amphi3';
    } else if (salle.includes('AMPHI 4')) {
      destination = 'Amphi4';
    } else if (salle.includes('AMPHI 5')) {
      destination = 'Amphi5';
    } else if (salle.includes('GRAND AMPHI')) {
      destination = 'Amphitheatre';
    } else {
      destination = 'Amphitheatre'; // Fallback
    }
    
    const navigationId = `Porte2To${destination}`;
    navigate(`/navigate/${navigationId}`);
  };

  // Fonction pour recommencer
  const resetForm = () => {
    setCne('');
    setFoundStudent(null);
    setConfirmationInfo(null);
    setError('');
    setCurrentStep('search');
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

  return (
    <div className={`min-h-screen transition-colors duration-500 relative ${
      isDark 
        ? 'bg-gradient-to-br from-gray-900 via-slate-800 to-blue-900' 
        : 'bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100'
    }`}>
      <FloatingBubbles />
      
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
            Inscription ENSET – Session 2025
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className={`text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed ${
              isDark ? 'text-gray-300' : 'text-slate-600'
            }`}
          >
            Journée d'inscription - Trouvez votre salle d'inscription.<br />
            Veuillez saisir votre CNE pour être guidé vers votre salle d'inscription.
          </motion.p>
        </motion.div>

        {/* Formulaire principal ou informations d'inscription */}
        <div className="max-w-lg mx-auto">
          <AnimatePresence mode="wait">
            {!foundStudent ? (
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
                <div className="space-y-6">
                  {/* Sélection du département */}
                  <div>
                    <label htmlFor="epreuve" className={`block text-xs sm:text-sm font-semibold mb-3 ${
                      isDark ? 'text-gray-200' : 'text-slate-700'
                    }`}>
                      Département
                    </label>
                    <div className="relative">
                      <GraduationCap className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 ${
                        isDark ? 'text-gray-400' : 'text-slate-400'
                      }`} />
                      <ChevronDown className={`absolute right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 pointer-events-none ${
                        isDark ? 'text-gray-400' : 'text-slate-400'
                      }`} />
                      <select
                        id="epreuve"
                        value={selectedEpreuve}
                        onChange={(e) => setSelectedEpreuve(e.target.value)}
                        className={`w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-3 sm:py-4 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-base sm:text-lg font-medium appearance-none cursor-pointer ${
                          isDark 
                            ? 'bg-gray-700/70 border-gray-600 text-gray-100' 
                            : 'bg-white/70 border-slate-200 text-slate-900'
                        }`}
                        disabled={isLoading}
                      >
                        {epreuves.map((epreuve) => (
                          <option key={epreuve.value} value={epreuve.value}>
                            {epreuve.label}
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
                      Code National de l'Étudiant (CNE)
                    </label>
                    <div className="relative">
                      <User className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 ${
                        isDark ? 'text-gray-400' : 'text-slate-400'
                      }`} />
                      <input
                        type="text"
                        id="cne"
                        value={cne}
                        onChange={(e) => {
                          // Normaliser la saisie en temps réel
                          const normalizedValue = e.target.value
                            .replace(/\s+/g, '') // Supprimer tous les espaces
                            .toUpperCase(); // Convertir en majuscules
                          setCne(normalizedValue);
                        }}
                        placeholder="Ex: A123456789"
                        className={`w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-base sm:text-lg font-medium ${
                          isDark 
                            ? 'bg-gray-700/70 border-gray-600 text-gray-100 placeholder-gray-400' 
                            : 'bg-white/70 border-slate-200 text-slate-900 placeholder-slate-400'
                        }`}
                        disabled={isLoading}
                        onKeyPress={(e) => e.key === 'Enter' && handleStudentSearch()}
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
                    onClick={handleStudentSearch}
                    disabled={isLoading || !cne.trim()}
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
                        <span className="text-sm sm:text-base">Rechercher mon dossier</span>
                      </>
                    )}
                  </motion.button>
                </div>
              </motion.div>
            ) : currentStep === 'filiere-selection' ? (
              <motion.div
                key="filiere-selection"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5 }}
                className={`backdrop-blur-lg rounded-2xl shadow-xl p-8 border ${
                  isDark 
                    ? 'bg-gray-800/90 border-gray-700/50' 
                    : 'bg-white/90 border-white/20'
                }`}
              >
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-white" />
                  </div>
                  <h3 className={`text-xl sm:text-2xl font-bold mb-2 ${
                    isDark ? 'text-gray-100' : 'text-slate-800'
                  }`}>Félicitations {foundStudent?.prenom} {foundStudent?.nom}!</h3>
                  <p className={`text-sm sm:text-base ${isDark ? 'text-gray-300' : 'text-slate-600'}`}>
                    Vous êtes admis(e) dans les filières suivantes
                  </p>
                </div>

                <div className="mb-6">
                  <h3 className={`text-lg font-semibold mb-4 text-center ${
                    isDark ? 'text-gray-200' : 'text-slate-700'
                  }`}>
                    Veuillez choisir la filière dans laquelle vous souhaitez vous inscrire :
                  </h3>
                  <div className="space-y-3">
                    {foundStudent?.filieres_reussies.map((filiere) => (
                      <motion.button
                        key={filiere}
                        onClick={() => handleFiliereSelection(filiere)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                          isDark 
                            ? 'bg-gray-700/50 border-gray-600 hover:border-blue-400 hover:bg-gray-600/50 text-gray-100' 
                            : 'bg-white/70 border-slate-200 hover:border-blue-400 hover:bg-blue-50 text-slate-900'
                        }`}
                      >
                        <div className="font-semibold text-blue-600">{filiere}</div>
                        <div className={`text-sm mt-1 ${
                          isDark ? 'text-gray-400' : 'text-slate-600'
                        }`}>
                          {filiereMapping[filiere as keyof typeof filiereMapping]}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                <motion.button
                  onClick={resetForm}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-3 px-6 border font-semibold rounded-xl transition-all duration-200 text-sm sm:text-base ${
                    isDark 
                      ? 'bg-gray-800/80 border-gray-600 text-gray-200 hover:bg-gray-700/80' 
                      : 'bg-white/80 border-slate-200 text-slate-700 hover:bg-white'
                  }`}
                >
                  Recommencer la recherche
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                key="confirmation"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                {/* Carte d'informations étudiant */}
                <div className={`backdrop-blur-lg rounded-2xl shadow-xl p-8 border ${
                  isDark 
                    ? 'bg-gray-800/90 border-gray-700/50' 
                    : 'bg-white/90 border-white/20'
                }`}>
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Building className="w-8 h-8 text-white" />
                    </div>
                    <h3 className={`text-xl sm:text-2xl font-bold mb-2 ${
                      isDark ? 'text-gray-100' : 'text-slate-800'
                    }`}>Votre salle d'inscription</h3>
                    <p className={`text-sm sm:text-base ${isDark ? 'text-gray-300' : 'text-slate-600'}`}>
                      Informations confirmées
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
                      }`}>{confirmationInfo?.student.prenom} {confirmationInfo?.student.nom}</span>
                    </div>
                    
                    <div className={`flex items-center justify-between p-3 sm:p-4 rounded-xl ${
                      isDark ? 'bg-gray-700/50' : 'bg-slate-50'
                    }`}>
                      <span className={`font-semibold text-sm sm:text-base ${
                        isDark ? 'text-gray-300' : 'text-slate-700'
                      }`}>CNE</span>
                      <span className={`font-medium text-sm sm:text-base ${
                        isDark ? 'text-gray-100' : 'text-slate-800'
                      }`}>{confirmationInfo?.student.id}</span>
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
                        }`}>Filière choisie</span>
                      </div>
                      <span className={`font-bold ${
                        isDark ? 'text-green-200' : 'text-green-800'
                      }`}>{confirmationInfo?.selectedFiliere}</span>
                    </div>
                    
                    <div className={`flex items-center justify-between p-4 rounded-xl border ${
                      confirmationInfo?.list === 'principale'
                        ? isDark 
                          ? 'bg-blue-900/30 border-blue-700' 
                          : 'bg-blue-50 border-blue-200'
                        : isDark 
                          ? 'bg-orange-900/30 border-orange-700' 
                          : 'bg-orange-50 border-orange-200'
                    }`}>
                      <div className="flex items-center gap-2">
                        <Users className={`w-5 h-5 ${
                          confirmationInfo?.list === 'principale'
                            ? isDark ? 'text-blue-400' : 'text-blue-600'
                            : isDark ? 'text-orange-400' : 'text-orange-600'
                        }`} />
                        <span className={`text-sm font-medium ${
                          confirmationInfo?.list === 'principale'
                            ? isDark ? 'text-blue-300' : 'text-blue-700'
                            : isDark ? 'text-orange-300' : 'text-orange-700'
                        }`}>Liste</span>
                      </div>
                      <span className={`font-bold ${
                        confirmationInfo?.list === 'principale'
                          ? isDark ? 'text-blue-200' : 'text-blue-800'
                          : isDark ? 'text-orange-200' : 'text-orange-800'
                      }`}>
                        {confirmationInfo?.list === 'principale' ? 'Liste Principale' : 'Liste d\'Attente'}
                      </span>
                    </div>
                    
                    <div className={`p-6 rounded-xl border-2 text-center ${
                      confirmationInfo?.list === 'principale'
                        ? isDark 
                          ? 'bg-indigo-900/30 border-indigo-700' 
                          : 'bg-indigo-50 border-indigo-200'
                        : isDark 
                          ? 'bg-yellow-900/30 border-yellow-700' 
                          : 'bg-yellow-50 border-yellow-200'
                    }`}>
                      <MapPin className={`w-8 h-8 mx-auto mb-2 ${
                        confirmationInfo?.list === 'principale'
                          ? isDark ? 'text-indigo-400' : 'text-indigo-600'
                          : isDark ? 'text-yellow-400' : 'text-yellow-600'
                      }`} />
                      <div className={`text-xl font-bold mb-1 ${
                        confirmationInfo?.list === 'principale'
                          ? isDark ? 'text-indigo-200' : 'text-indigo-800'
                          : isDark ? 'text-yellow-200' : 'text-yellow-800'
                      }`}>
                        {confirmationInfo?.assignedSalle}
                      </div>
                      <div className={`text-sm ${
                        confirmationInfo?.list === 'principale'
                          ? isDark ? 'text-indigo-300' : 'text-indigo-600'
                          : isDark ? 'text-yellow-300' : 'text-yellow-600'
                      }`}>
                        Votre salle d'inscription
                      </div>
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
            © ENSET Mohammedia - Inscription ENSET 2025
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

export default InscriptionEnset;
