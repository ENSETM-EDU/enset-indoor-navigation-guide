import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, User, MapPin, FileText, CheckCircle, AlertCircle, Navigation } from 'lucide-react';

interface Student {
  id: string;
  fullName: string;
  examNumber: string;
  cin: string;
  salle: string;
  concours: {
    name: string;
  };
}

interface ApiResponse {
  success: boolean;
  data?: Student;
  message?: string;
}

const FindMyExamRoomPage: React.FC = () => {
  const { idConcours } = useParams<{ idConcours: string }>();
  const navigate = useNavigate();
  
  const [cin, setCin] = useState('');
  const [loading, setLoading] = useState(false);
  const [student, setStudent] = useState<Student | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!cin.trim()) {
      setError('Veuillez entrer votre CIN');
      return;
    }

    setLoading(true);
    setError(null);
    setStudent(null);

    try {
      const response = await fetch(`/api/concours/${idConcours}/students?cin=${cin.trim()}`);
      const data: ApiResponse = await response.json();

      if (response.ok && data.success && data.data) {
        setStudent(data.data);
        setShowSuccess(true);
      } else {
        setError(data.message || 'Étudiant non trouvé. Veuillez vérifier votre CIN.');
      }
    } catch (err) {
      setError('Erreur de connexion. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const handleStartNavigation = () => {
    if (student) {
      navigate(`/navigate/Porte2To${student.salle}`);
    }
  };

  const resetForm = () => {
    setCin('');
    setStudent(null);
    setError(null);
    setShowSuccess(false);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md mx-auto"
      >
        {/* Page Title */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center mb-8"
        >
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Trouvez votre salle d'examen
          </h1>
          <p className="text-gray-600">
            Entrez votre CIN pour aller vers votre salle d'examen
          </p>
        </motion.div>

        {/* Search Form */}
        {!showSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="glass-effect rounded-2xl p-6 shadow-lg"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="relative">
                <label htmlFor="cin" className="block text-sm font-medium text-gray-700 mb-2">
                  Numéro CIN
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    id="cin"
                    type="text"
                    value={cin}
                    onChange={(e) => setCin(e.target.value)}
                    placeholder="Ex: AB123456"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80"
                    disabled={loading}
                  />
                </div>
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                className="w-full button-primary text-white py-3 rounded-xl font-semibold text-lg shadow-lg flex items-center justify-center space-x-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Recherche...</span>
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    <span>Rechercher</span>
                  </>
                )}
              </motion.button>
            </form>
          </motion.div>
        )}

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="mt-6 bg-red-50 border border-red-200 rounded-xl p-4 flex items-center space-x-3"
            >
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-red-700 font-medium">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Success Card */}
        <AnimatePresence>
          {showSuccess && student && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
              className="glass-effect rounded-2xl p-6 shadow-xl border border-green-200"
            >
              {/* Success Header */}
              <div className="text-center mb-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.2, type: "spring", stiffness: 200 }}
                  className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </motion.div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">Étudiant trouvé !</h2>
              </div>

              {/* Student Information */}
              <div className="space-y-4 mb-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                  className="flex items-center space-x-3 p-3 bg-white/60 rounded-lg"
                >
                  <User className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Nom complet</p>
                    <p className="font-semibold text-gray-900">{student.fullName}</p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 }}
                  className="flex items-center space-x-3 p-3 bg-white/60 rounded-lg"
                >
                  <FileText className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Numéro d'examen</p>
                    <p className="font-semibold text-gray-900">{student.examNumber}</p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.5 }}
                  className="flex items-center space-x-3 p-3 bg-white/60 rounded-lg"
                >
                  <FileText className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Concours</p>
                    <p className="font-semibold text-gray-900">{student.concours.name}</p>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.6 }}
                  className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200"
                >
                  <MapPin className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Salle d'examen</p>
                    <p className="font-bold text-blue-900 text-lg">{student.salle}</p>
                  </div>
                </motion.div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.7 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleStartNavigation}
                  className="w-full button-primary text-white py-3 rounded-xl font-semibold text-lg shadow-lg flex items-center justify-center space-x-2"
                >
                  <Navigation className="w-5 h-5" />
                  <span>Commencer la navigation</span>
                </motion.button>

                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.8 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={resetForm}
                  className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold text-lg hover:bg-gray-200 transition-colors duration-200"
                >
                  Nouvelle recherche
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default FindMyExamRoomPage;
