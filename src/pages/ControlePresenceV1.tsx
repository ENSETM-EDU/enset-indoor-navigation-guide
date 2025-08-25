import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, User, AlertCircle, Loader2, ChevronDown, Check, Users, ArrowLeft, CheckCircle, Download, FileText, Calendar, Clock, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PresenceManager, SessionData } from '../utils/presenceManager';
import { PDFReportGenerator } from '../utils/pdfGenerator';

interface StudentData {
  id: string;
  nom: string;
  prenom: string;
  numero_examen: number;
  salle_examen: string;
  epreuve: string;
}

const ControlePresenceV1: React.FC = () => {
  const [numeroExamen, setNumeroExamen] = useState<string>('');
  const [selectedEpreuve, setSelectedEpreuve] = useState<string>('GE');
  const [foundStudent, setFoundStudent] = useState<StudentData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [surveillantValidated, setSurveillantValidated] = useState<boolean>(false);
  const [studentValidated, setStudentValidated] = useState<boolean>(false);
  const [currentSession, setCurrentSession] = useState<SessionData | null>(null);
  const [surveillantName, setSurveillantName] = useState<string>('');
  const [showSessionInfo, setShowSessionInfo] = useState<boolean>(false);
  const navigate = useNavigate();

  // Configuration des départements disponibles
  const epreuves = [
    { value: 'GE', label: 'Département Génie Électrique', file: 'cnc-enset-student-ge.json' },
    { value: 'GM', label: 'Département Génie Mécanique', file: 'cnc-enset-student-gm.json' },
    { value: 'MI', label: 'Département Mathématiques et Informatique', file: 'cnc-enset-student-mi.json' }
  ];

  useEffect(() => {
    // Charger ou créer une session pour l'épreuve sélectionnée
    initializeSession();
  }, [selectedEpreuve]);

  const initializeSession = () => {
    let session = PresenceManager.getCurrentSession(selectedEpreuve);
    
    if (!session) {
      session = PresenceManager.createNewSession(selectedEpreuve, surveillantName || 'Non spécifié');
    }
    
    setCurrentSession(session);
  };

  const updateSurveillantName = () => {
    if (!currentSession || !surveillantName.trim()) return;
    
    const sessions = PresenceManager.getAllSessions();
    const sessionIndex = sessions.findIndex(s => s.sessionId === currentSession.sessionId);
    
    if (sessionIndex >= 0) {
      sessions[sessionIndex].surveillant = surveillantName.trim();
      localStorage.setItem('enset_presence_sessions', JSON.stringify(sessions));
      setCurrentSession(sessions[sessionIndex]);
    }
  };

  const searchStudent = async () => {
    if (!numeroExamen.trim()) {
      setError('Veuillez entrer un numéro d\'examen');
      return;
    }

    setIsLoading(true);
    setError('');
    setFoundStudent(null);
    setSurveillantValidated(false);
    setStudentValidated(false);

    try {
      const selectedEpreuveData = epreuves.find(e => e.value === selectedEpreuve);
      if (!selectedEpreuveData) {
        throw new Error('Épreuve non trouvée');
      }

      const response = await fetch(`/${selectedEpreuveData.file}`);
      if (!response.ok) {
        throw new Error('Erreur lors du chargement des données');
      }

      const students: StudentData[] = await response.json();
      const student = students.find(s => s.numero_examen && s.numero_examen.toString() === numeroExamen.trim());

      if (student) {
        setFoundStudent(student);
        
        // Vérifier si l'étudiant est déjà enregistré dans la session
        if (currentSession) {
          const existingPresence = PresenceManager.getStudentPresence(currentSession.sessionId, student.id);
          if (existingPresence) {
            setSurveillantValidated(existingPresence.surveillantValidation);
            setStudentValidated(existingPresence.studentValidation);
          }
        }
      } else {
        setError('Aucun étudiant trouvé avec ce numéro d\'examen');
      }
    } catch (err) {
      setError('Erreur lors de la recherche. Veuillez réessayer.');
      console.error('Erreur de recherche:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSurveillantValidation = () => {
    if (!foundStudent || !currentSession) return;

    setSurveillantValidated(true);
    PresenceManager.updateStudentPresence(
      currentSession.sessionId,
      foundStudent,
      true,
      studentValidated
    );
    
    // Recharger la session pour mettre à jour les statistiques
    const updatedSession = PresenceManager.getSessionById(currentSession.sessionId);
    if (updatedSession) setCurrentSession(updatedSession);
  };

  const handleStudentValidation = () => {
    if (!foundStudent || !currentSession) return;

    setStudentValidated(true);
    PresenceManager.updateStudentPresence(
      currentSession.sessionId,
      foundStudent,
      surveillantValidated,
      true
    );
    
    // Recharger la session pour mettre à jour les statistiques
    const updatedSession = PresenceManager.getSessionById(currentSession.sessionId);
    if (updatedSession) setCurrentSession(updatedSession);
  };

  const resetSearch = () => {
    setNumeroExamen('');
    setFoundStudent(null);
    setError('');
    setSurveillantValidated(false);
    setStudentValidated(false);
  };

  const generatePDFReport = () => {
    if (!currentSession) {
      alert('Aucune session active');
      return;
    }
    PDFReportGenerator.generatePresenceReport(currentSession.sessionId);
  };

  const generateSummaryReport = () => {
    PDFReportGenerator.generateSummaryReport(selectedEpreuve);
  };

  const isPresenceComplete = surveillantValidated && studentValidated;
  const sessionStats = currentSession ? PresenceManager.getSessionStats(currentSession.sessionId) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100 px-4 py-8">
      <div className="max-w-4xl mx-auto">
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
          <p className="text-lg text-gray-600 max-w-2xl mx-auto font-poppins">
            Système de contrôle de présence pour les examens ENSET
          </p>
        </motion.div>

        {/* Informations de session et paramètres */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900 font-poppins flex items-center mb-4 md:mb-0">
              <Settings className="mr-2" size={24} />
              Configuration de session
            </h2>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowSessionInfo(!showSessionInfo)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-200 font-poppins"
            >
              {showSessionInfo ? 'Masquer détails' : 'Voir détails'}
            </motion.button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Sélection de l'épreuve */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins">
                Épreuve
              </label>
              <div className="relative">
                <select
                  value={selectedEpreuve}
                  onChange={(e) => setSelectedEpreuve(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white text-gray-900 font-poppins"
                >
                  {epreuves.map((epreuve) => (
                    <option key={epreuve.value} value={epreuve.value}>
                      {epreuve.value} - {epreuve.label.split(' ').slice(1).join(' ')}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              </div>
            </div>

            {/* Nom du surveillant */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-poppins">
                Nom du surveillant
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={surveillantName}
                  onChange={(e) => setSurveillantName(e.target.value)}
                  placeholder="Entrez votre nom..."
                  className="flex-1 p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 font-poppins"
                />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={updateSurveillantName}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-xl font-semibold transition-all duration-200 font-poppins"
                >
                  <Check size={16} />
                </motion.button>
              </div>
            </div>
          </div>

          {/* Détails de session */}
          <AnimatePresence>
            {showSessionInfo && currentSession && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-6 pt-6 border-t border-gray-200"
              >
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center">
                    <Calendar className="mr-2 text-blue-500" size={16} />
                    <span className="font-poppins">
                      <strong>Date:</strong> {new Date(currentSession.date).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="mr-2 text-blue-500" size={16} />
                    <span className="font-poppins">
                      <strong>Heure:</strong> {currentSession.time}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <User className="mr-2 text-blue-500" size={16} />
                    <span className="font-poppins">
                      <strong>Surveillant:</strong> {currentSession.surveillant}
                    </span>
                  </div>
                </div>
                <div className="mt-4 text-xs text-gray-500 font-poppins">
                  ID Session: {currentSession.sessionId}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Recherche par numéro d'examen */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white rounded-2xl shadow-lg p-6 mb-8"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4 font-poppins flex items-center">
            <Search className="mr-2" size={24} />
            Recherche par numéro d'examen
          </h2>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                value={numeroExamen}
                onChange={(e) => setNumeroExamen(e.target.value)}
                placeholder="Entrez le numéro d'examen..."
                className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 font-poppins"
                onKeyPress={(e) => e.key === 'Enter' && searchStudent()}
              />
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={searchStudent}
              disabled={isLoading}
              className="button-primary text-white px-8 py-4 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 font-poppins flex items-center justify-center min-w-[120px]"
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  <Search size={20} className="mr-2" />
                  Rechercher
                </>
              )}
            </motion.button>
          </div>
        </motion.div>

        {/* Affichage des erreurs */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="bg-red-50 border border-red-200 rounded-xl p-4 mb-8 flex items-center"
            >
              <AlertCircle className="text-red-500 mr-3" size={20} />
              <span className="text-red-700 font-poppins">{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Résultats de la recherche */}
        <AnimatePresence>
          {foundStudent && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8"
            >
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6 font-poppins flex items-center">
                  <User className="mr-2" size={24} />
                  Informations de l'étudiant
                </h2>

                <div className="grid md:grid-cols-2 gap-8">
                  {/* Informations de l'étudiant */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="font-medium text-gray-600 font-poppins">CNE:</span>
                      <span className="text-gray-900 font-semibold font-poppins">{foundStudent.id}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="font-medium text-gray-600 font-poppins">Nom:</span>
                      <span className="text-gray-900 font-semibold font-poppins">{foundStudent.nom}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="font-medium text-gray-600 font-poppins">Prénom:</span>
                      <span className="text-gray-900 font-semibold font-poppins">{foundStudent.prenom}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="font-medium text-gray-600 font-poppins">N° Examen:</span>
                      <span className="text-gray-900 font-semibold font-poppins">{foundStudent.numero_examen}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="font-medium text-gray-600 font-poppins">Salle:</span>
                      <span className="text-gray-900 font-semibold font-poppins">{foundStudent.salle_examen}</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="font-medium text-gray-600 font-poppins">Épreuve:</span>
                      <span className="text-gray-900 font-semibold font-poppins">{foundStudent.epreuve}</span>
                    </div>
                  </div>

                  {/* Photo de l'étudiant */}
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-gray-200 shadow-lg mb-4">
                      <img
                        src="/photo_test.jpg"
                        alt="Photo de l'étudiant"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = `data:image/svg+xml,${encodeURIComponent(`
                            <svg xmlns="http://www.w3.org/2000/svg" width="192" height="192" viewBox="0 0 192 192" fill="none">
                              <rect width="192" height="192" fill="#f3f4f6"/>
                              <circle cx="96" cy="76" r="24" fill="#d1d5db"/>
                              <path d="M96 108c-24 0-40 16-40 32v16h80v-16c0-16-16-32-40-32z" fill="#d1d5db"/>
                            </svg>
                          `)}`;
                        }}
                      />
                    </div>
                    <p className="text-sm text-gray-600 font-poppins text-center">Photo de l'étudiant</p>
                  </div>
                </div>

                {/* Section de validation de présence */}
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6 font-poppins flex items-center">
                    <Users className="mr-2" size={20} />
                    Validation de présence
                  </h3>

                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Validation surveillant */}
                    <div className="bg-gray-50 rounded-xl p-4">
                      <h4 className="font-medium text-gray-900 mb-3 font-poppins">Validation Surveillant</h4>
                      <motion.button
                        whileHover={{ scale: surveillantValidated ? 1 : 1.02 }}
                        whileTap={{ scale: surveillantValidated ? 1 : 0.98 }}
                        onClick={handleSurveillantValidation}
                        disabled={surveillantValidated}
                        className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 font-poppins flex items-center justify-center ${
                          surveillantValidated
                            ? 'bg-green-500 text-white cursor-default'
                            : 'bg-blue-500 hover:bg-blue-600 text-white'
                        }`}
                      >
                        {surveillantValidated ? (
                          <>
                            <CheckCircle size={20} className="mr-2" />
                            Validé
                          </>
                        ) : (
                          <>
                            <Check size={20} className="mr-2" />
                            Marquer présent
                          </>
                        )}
                      </motion.button>
                    </div>

                    {/* Validation étudiant */}
                    <div className="bg-gray-50 rounded-xl p-4">
                      <h4 className="font-medium text-gray-900 mb-3 font-poppins">Validation Étudiant</h4>
                      <motion.button
                        whileHover={{ scale: studentValidated ? 1 : 1.02 }}
                        whileTap={{ scale: studentValidated ? 1 : 0.98 }}
                        onClick={handleStudentValidation}
                        disabled={studentValidated}
                        className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 font-poppins flex items-center justify-center ${
                          studentValidated
                            ? 'bg-green-500 text-white cursor-default'
                            : 'bg-orange-500 hover:bg-orange-600 text-white'
                        }`}
                      >
                        {studentValidated ? (
                          <>
                            <CheckCircle size={20} className="mr-2" />
                            Confirmé
                          </>
                        ) : (
                          <>
                            <Check size={20} className="mr-2" />
                            Confirmer présence
                          </>
                        )}
                      </motion.button>
                    </div>
                  </div>

                  {/* Statut de présence */}
                  {(surveillantValidated || studentValidated) && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className={`mt-6 p-4 rounded-xl border ${
                        isPresenceComplete
                          ? 'bg-green-50 border-green-200 text-green-800'
                          : 'bg-yellow-50 border-yellow-200 text-yellow-800'
                      }`}
                    >
                      <div className="flex items-center justify-center">
                        {isPresenceComplete ? (
                          <>
                            <CheckCircle size={24} className="mr-2" />
                            <span className="font-semibold font-poppins">Présence confirmée par les deux parties</span>
                          </>
                        ) : (
                          <>
                            <AlertCircle size={24} className="mr-2" />
                            <span className="font-semibold font-poppins">
                              En attente de validation {!surveillantValidated ? 'surveillant' : 'étudiant'}
                            </span>
                          </>
                        )}
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Bouton nouvelle recherche */}
                <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={resetSearch}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 font-poppins"
                  >
                    Nouvelle recherche
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Statistiques et actions */}
        {sessionStats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-2xl shadow-lg p-6 mb-8"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900 font-poppins flex items-center mb-4 md:mb-0">
                <Users className="mr-2" size={24} />
                Statistiques de présence
              </h2>
              <div className="flex flex-col sm:flex-row gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={generatePDFReport}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-200 font-poppins flex items-center"
                >
                  <Download size={16} className="mr-2" />
                  Rapport PDF
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={generateSummaryReport}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-200 font-poppins flex items-center"
                >
                  <FileText size={16} className="mr-2" />
                  Récapitulatif
                </motion.button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="bg-blue-50 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-blue-600 font-poppins">{sessionStats.total}</div>
                <div className="text-sm text-blue-800 font-poppins">Total vérifications</div>
              </div>
              <div className="bg-green-50 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-green-600 font-poppins">{sessionStats.present}</div>
                <div className="text-sm text-green-800 font-poppins">Présents</div>
              </div>
              <div className="bg-yellow-50 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-yellow-600 font-poppins">{sessionStats.surveillantOnly}</div>
                <div className="text-sm text-yellow-800 font-poppins">Surveillant seul</div>
              </div>
              <div className="bg-orange-50 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-orange-600 font-poppins">{sessionStats.studentOnly}</div>
                <div className="text-sm text-orange-800 font-poppins">Étudiant seul</div>
              </div>
              <div className="bg-purple-50 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-purple-600 font-poppins">{sessionStats.presentagePresent}%</div>
                <div className="text-sm text-purple-800 font-poppins">Taux présence</div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ControlePresenceV1;