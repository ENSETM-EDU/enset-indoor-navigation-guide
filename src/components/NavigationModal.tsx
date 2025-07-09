import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, Navigation, X } from 'lucide-react';

interface PathData {
  id: string;
  from: string;
  to: string;
  time: string;
  path: string;
  title: string;
  description: string;
}

interface NavigationModalProps {
  pathData: PathData;
  onStart: () => void;
  onClose: () => void;
}

const NavigationModal: React.FC<NavigationModalProps> = ({ pathData, onStart, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-gray-200/50"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-900 to-blue-700 rounded-2xl flex items-center justify-center">
            <Navigation className="w-6 h-6 text-white" />
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {pathData.title}
          </h2>
          <p className="text-gray-600 leading-relaxed">
            {pathData.description}
          </p>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-4 mb-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-blue-900">Trajet</p>
                <p className="text-sm text-blue-700">{pathData.from} → {pathData.to}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-blue-900">Durée</p>
                <p className="text-sm text-blue-700">{pathData.time}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onClose}
            className="flex-1 button-secondary text-gray-700 px-6 py-3 rounded-2xl font-medium text-center"
          >
            Annuler
          </button>
          <button
            onClick={onStart}
            className="flex-1 button-primary text-white px-6 py-3 rounded-2xl font-medium text-center"
          >
            Commencer
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default NavigationModal;