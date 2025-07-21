import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, X, GraduationCap, User, CheckCircle, Navigation, ArrowRight, AlertCircle } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

interface InstructionsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const InstructionsDialog: React.FC<InstructionsDialogProps> = ({ isOpen, onClose }) => {
  const { isDark } = useTheme();

  const instructions = [
    {
      step: 1,
      icon: <GraduationCap className="w-6 h-6" />,
      title: "Choisir votre filière",
      description: "Sélectionnez la filière correspondant à votre spécialité (Génie Informatique, Génie Mécanique, ou Génie Électrique)"
    },
    {
      step: 2,
      icon: <User className="w-6 h-6" />,
      title: "Entrer votre CNE",
      description: "Saisissez votre numéro CNE valide tel qu'il apparaît sur votre convocation"
    },
    {
      step: 3,
      icon: <CheckCircle className="w-6 h-6" />,
      title: "Vérifier vos informations",
      description: "Consultez vos informations d'examen (salle, horaire, numéro d'examen)"
    },
    {
      step: 4,
      icon: <Navigation className="w-6 h-6" />,
      title: "Suivre votre parcours",
      description: "Cliquez sur 'Suivre le parcours' pour être guidé vers votre salle d'examen"
    }
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
        onClick={(e) => {
          if (e.target === e.currentTarget) {
            onClose();
          }
        }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className={`max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl ${
            isDark 
              ? 'bg-gray-800/95 border border-gray-700' 
              : 'bg-white/95 border border-gray-200'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className={`p-6 border-b ${
            isDark ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                  <Info className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className={`text-xl font-bold ${
                    isDark ? 'text-gray-100' : 'text-slate-800'
                  }`}>
                    Guide d'utilisation
                  </h2>
                  <p className={`text-sm ${
                    isDark ? 'text-gray-400' : 'text-slate-600'
                  }`}>
                    Comment utiliser l'application de navigation
                  </p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className={`p-2 rounded-full transition-colors ${
                  isDark 
                    ? 'hover:bg-gray-700 text-gray-400 hover:text-gray-200' 
                    : 'hover:bg-gray-100 text-slate-400 hover:text-slate-600'
                }`}
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="space-y-6">
              {instructions.map((instruction, index) => (
                <motion.div
                  key={instruction.step}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex gap-4 p-4 rounded-xl border ${
                    isDark 
                      ? 'bg-gray-700/30 border-gray-600' 
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex-shrink-0">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      isDark 
                        ? 'bg-blue-600/20 text-blue-400' 
                        : 'bg-blue-100 text-blue-600'
                    }`}>
                      {instruction.icon}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        isDark 
                          ? 'bg-blue-600/20 text-blue-400' 
                          : 'bg-blue-100 text-blue-600'
                      }`}>
                        Étape {instruction.step}
                      </span>
                      <h3 className={`font-semibold ${
                        isDark ? 'text-gray-100' : 'text-slate-800'
                      }`}>
                        {instruction.title}
                      </h3>
                    </div>
                    <p className={`text-sm leading-relaxed ${
                      isDark ? 'text-gray-300' : 'text-slate-600'
                    }`}>
                      {instruction.description}
                    </p>
                  </div>
                  {index < instructions.length - 1 && (
                    <ArrowRight className={`w-5 h-5 mt-3 ${
                      isDark ? 'text-gray-500' : 'text-slate-400'
                    }`} />
                  )}
                </motion.div>
              ))}
            </div>

            {/* Important Notice */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className={`mt-6 p-4 rounded-xl border ${
                isDark 
                  ? 'bg-red-900/20 border-red-700 text-red-300' 
                  : 'bg-red-50 border-red-200 text-red-800'
              }`}
            >
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold mb-2">Important</h4>
                  <div className="space-y-2 text-sm">
                    <p>
                      En cas d'échéance ou vous n'avez pas trouvé vos informations, vous êtes amenés à chercher 
                      vos informations dans les tableaux et à suivre la méthode classique pour accéder à votre salle. 
                      Cette application a uniquement pour but de faciliter l'accès.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Footer */}
          <div className={`p-6 border-t ${
            isDark ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onClose}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-5 h-5" />
              J'ai compris, commencer
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default InstructionsDialog;
