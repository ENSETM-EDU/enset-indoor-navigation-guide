import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, User, Clock, MapPin, AlertCircle, Loader2, Stethoscope, Navigation } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';

interface StudentData {
  id: string;
  cne: string;
  nom: string;
  prenom: string;
  numero_examen: number;
  salle_examen: string;
}

interface ExamInfo {
  name: string;
  cin: string;
  cne: string;
  salle: string;
  numeroExamen: number;
  heure: string;
  porte: string;
}

const ConcoursMedecine: React.FC = () => {
  const [cin, setCin] = useState<string>('');
  const [examInfo, setExamInfo] = useState<ExamInfo | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const { isDark } = useTheme();
  const navigate = useNavigate();

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

  // Fonction pour obtenir les informations de la salle
  const getSalleInfo = (salleExamen: string) => {
    const salleMapping: { [key: string]: { nom: string; porte: string; heure: string } } = {
      'amphi1': { nom: 'Amphithéâtre 1', porte: 'Porte 2', heure: '08:30 - 11:30' },
      'amphi2': { nom: 'Amphithéâtre 2', porte: 'Porte 2', heure: '08:30 - 11:30' },
      'amphi3': { nom: 'Amphithéâtre 3', porte: 'Porte 2', heure: '08:30 - 11:30' },
      'amphi4': { nom: 'Amphithéâtre 4', porte: 'Porte 2', heure: '08:30 - 11:30' },
      'amphi5': { nom: 'Amphithéâtre 5', porte: 'Porte 2', heure: '08:30 - 11:30' },
      'amphitheatre': { nom: 'Amphithéâtre Principal', porte: 'Porte 1', heure: '08:30 - 11:30' },
      'salle1': { nom: 'Salle 1', porte: 'Porte 2', heure: '08:30 - 11:30' },
      'salle2': { nom: 'Salle 2', porte: 'Porte 2', heure: '08:30 - 11:30' },
      'salle3': { nom: 'Salle 3', porte: 'Porte 2', heure: '08:30 - 11:30' },
      'salle4': { nom: 'Salle 4', porte: 'Porte 2', heure: '08:30 - 11:30' },
      'salle5': { nom: 'Salle 5', porte: 'Porte 2', heure: '08:30 - 11:30' },
      'salle6': { nom: 'Salle 6', porte: 'Porte 2', heure: '08:30 - 11:30' },
    };
    return salleMapping[salleExamen] || { nom: salleExamen, porte: 'Porte 1', heure: '08:30 - 11:30' };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!cin.trim()) {
      setError('Veuillez saisir votre numéro CIN');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Charger les données depuis le fichier JSON
      const response = await fetch('/cnc-medcine-student.json');
      
      if (!response.ok) {
        throw new Error('Impossible de charger les données');
      }

      const studentsData: StudentData[] = await response.json();
      
      // Rechercher l'étudiant par CIN (id dans le JSON)
      const student = studentsData.find(s => s.id.toLowerCase() === cin.toLowerCase());
      
      if (!student) {
        setError('CIN non trouvé dans notre base de données. Veuillez vérifier votre numéro.');
        return;
      }

      // Obtenir les informations de la salle
      const salleInfo = getSalleInfo(student.salle_examen);
      
      // Transformer les données pour l'affichage
      setExamInfo({
        name: `${student.prenom} ${student.nom}`,
        cin: student.id,
        cne: student.cne,
        salle: salleInfo.nom,
        numeroExamen: student.numero_examen,
        heure: salleInfo.heure,
        porte: salleInfo.porte
      });
      
    } catch (err) {
      console.error('Erreur lors de la recherche:', err);
      setError('Une erreur est survenue lors de la recherche. Veuillez réessayer.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setCin('');
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
      
      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          {/* Icon médical */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full shadow-lg mb-6"
          >
            <Stethoscope className="w-10 h-10 text-white" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className={`text-4xl md:text-5xl font-bold mb-4 ${
              isDark ? 'text-gray-100' : 'text-slate-800'
            }`}
          >
            Bienvenue à l'<span className="text-blue-600">ENSET Mohammedia</span>
          </motion.h1>
          
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className={`text-2xl md:text-3xl font-semibold mb-6 ${
              isDark ? 'text-blue-400' : 'text-blue-700'
            }`}
          >
            Concours Médecine – Session 2025
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className={`text-lg max-w-2xl mx-auto leading-relaxed ${
              isDark ? 'text-gray-300' : 'text-slate-600'
            }`}
          >
            Merci de vous présenter ici pour accéder à vos informations d'examen.<br />
            Veuillez saisir votre numéro de CIN pour être guidé vers votre salle d'examen.
          </motion.p>
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
                  <div>
                    <label htmlFor="cin" className={`block text-sm font-semibold mb-3 ${
                      isDark ? 'text-gray-200' : 'text-slate-700'
                    }`}>
                      Numéro CIN
                    </label>
                    <div className="relative">
                      <User className={`absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
                        isDark ? 'text-gray-400' : 'text-slate-400'
                      }`} />
                      <input
                        type="text"
                        id="cin"
                        value={cin}
                        onChange={(e) => setCin(e.target.value.toUpperCase())}
                        placeholder="Ex: AB123456"
                        className={`w-full pl-12 pr-4 py-4 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-lg font-medium ${
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
                      <AlertCircle className="w-5 h-5" />
                      <span className="text-sm font-medium">{error}</span>
                    </motion.div>
                  )}

                  <motion.button
                    type="submit"
                    disabled={isLoading || !cin.trim()}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Recherche en cours...
                      </>
                    ) : (
                      <>
                        <Search className="w-5 h-5" />
                        Afficher mon parcours
                      </>
                    )}
                  </motion.button>
                </form>

                {/* Note d'aide */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2 }}
                  className={`mt-6 text-center text-sm ${
                    isDark ? 'text-gray-400' : 'text-slate-500'
                  }`}
                >
                  <p>💡 <strong>Astuce :</strong> Essayez avec NI583215, A730547, ou DR834152</p>
                </motion.div>
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
                    <h3 className={`text-2xl font-bold mb-2 ${
                      isDark ? 'text-gray-100' : 'text-slate-800'
                    }`}>Informations confirmées</h3>
                    <p className={isDark ? 'text-gray-300' : 'text-slate-600'}>
                      Votre place d'examen a été trouvée
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className={`flex items-center justify-between p-4 rounded-xl ${
                      isDark ? 'bg-gray-700/50' : 'bg-slate-50'
                    }`}>
                      <span className={`font-semibold ${
                        isDark ? 'text-gray-300' : 'text-slate-700'
                      }`}>Nom complet</span>
                      <span className={`font-medium ${
                        isDark ? 'text-gray-100' : 'text-slate-800'
                      }`}>{examInfo.name}</span>
                    </div>
                    
                    <div className={`flex items-center justify-between p-4 rounded-xl ${
                      isDark ? 'bg-gray-700/50' : 'bg-slate-50'
                    }`}>
                      <span className={`font-semibold ${
                        isDark ? 'text-gray-300' : 'text-slate-700'
                      }`}>CIN</span>
                      <span className={`font-medium ${
                        isDark ? 'text-gray-100' : 'text-slate-800'
                      }`}>{examInfo.cin}</span>
                    </div>
                    
                    <div className={`flex items-center justify-between p-4 rounded-xl ${
                      isDark ? 'bg-gray-700/50' : 'bg-slate-50'
                    }`}>
                      <span className={`font-semibold ${
                        isDark ? 'text-gray-300' : 'text-slate-700'
                      }`}>CNE</span>
                      <span className={`font-medium ${
                        isDark ? 'text-gray-100' : 'text-slate-800'
                      }`}>{examInfo.cne}</span>
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
                        <span className={`font-semibold ${
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
                        <span className={`font-semibold ${
                          isDark ? 'text-orange-300' : 'text-orange-700'
                        }`}>Horaire</span>
                      </div>
                      <span className={`font-bold ${
                        isDark ? 'text-orange-200' : 'text-orange-800'
                      }`}>{examInfo.heure}</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className={`p-4 rounded-xl border text-center ${
                        isDark 
                          ? 'bg-purple-900/30 border-purple-700' 
                          : 'bg-purple-50 border-purple-200'
                      }`}>
                        <div className={`font-semibold mb-1 ${
                          isDark ? 'text-purple-300' : 'text-purple-700'
                        }`}>Entrée</div>
                        <div className={`font-bold ${
                          isDark ? 'text-purple-200' : 'text-purple-800'
                        }`}>{examInfo.porte}</div>
                      </div>
                      <div className={`p-4 rounded-xl border text-center ${
                        isDark 
                          ? 'bg-indigo-900/30 border-indigo-700' 
                          : 'bg-indigo-50 border-indigo-200'
                      }`}>
                        <div className={`font-semibold mb-1 ${
                          isDark ? 'text-indigo-300' : 'text-indigo-700'
                        }`}>N° Examen</div>
                        <div className={`font-bold ${
                          isDark ? 'text-indigo-200' : 'text-indigo-800'
                        }`}>{examInfo.numeroExamen}</div>
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
                    className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <Navigation className="w-5 h-5" />
                    Commencer le guidage
                  </motion.button>
                  
                  <motion.button
                    onClick={resetForm}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`px-6 py-4 border font-semibold rounded-xl transition-all duration-200 ${
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
            © ENSET Mohammedia - Concours Médecine 2025
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

export default ConcoursMedecine;
