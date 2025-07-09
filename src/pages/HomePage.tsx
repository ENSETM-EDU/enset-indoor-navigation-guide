import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { QrCode } from 'lucide-react';
import QRScanner from '../components/QRScanner';

const HomePage: React.FC = () => {
  const [showScanner, setShowScanner] = useState(false);

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-12"
      >
        <motion.h1
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
        >
          Bienvenue à l'
          <span className="gradient-bg bg-clip-text text-transparent">ENSET</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-xl text-gray-600 max-w-2xl mx-auto mb-8"
        >
          Scannez un QR Code pour commencer votre parcours guidé vers la cérémonie de remise des diplômes
        </motion.p>
        
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowScanner(!showScanner)}
          className="button-primary text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-lg flex items-center space-x-3 mx-auto"
        >
          <QrCode className="w-6 h-6" />
          <span>{showScanner ? 'Fermer le Scanner' : 'Scanner QR Code'}</span>
        </motion.button>
      </motion.div>

      {showScanner && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="mb-12"
        >
          <QRScanner onScanSuccess={() => setShowScanner(false)} />
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="mt-16 text-center"
      >
        <div className="inline-block bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50 shadow-lg">
          <p className="text-gray-600 text-sm">
            🎓 Cérémonie de Remise des Diplômes • École Normale Supérieure de l'Enseignement Technique
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default HomePage;