import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

const EnsadPage: React.FC = () => {
  const navigate = useNavigate();
  const { porte } = useParams<{ porte?: string }>();

  // Floating diploma component
  const FloatingDiploma = ({ delay, rotation, top, left, right }: { 
    delay: number; 
    rotation: number; 
    top: string; 
    left?: string; 
    right?: string; 
  }) => (
    <motion.div
      className="absolute w-15 h-5 bg-gradient-to-r from-gray-100 to-gray-200 rounded-lg opacity-80"
      style={{
        top,
        left,
        right,
        transform: `rotate(${rotation}deg)`,
      }}
      animate={{
        y: [0, -20, 0],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
    />
  );

  return (
    <div className="min-h-screen relative overflow-hidden" style={{
      background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #4472c4 100%)'
    }}>
      {/* Back Button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        onClick={() => navigate(-1)}
        className="absolute top-6 left-6 z-20 flex items-center space-x-2 text-white/80 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Retour</span>
      </motion.button>

      {/* Floating Diplomas */}
      <FloatingDiploma delay={0} rotation={15} top="10%" left="5%" />
      <FloatingDiploma delay={-2} rotation={-20} top="20%" right="8%" />
      <FloatingDiploma delay={-4} rotation={25} top="60%" left="3%" />
      <FloatingDiploma delay={-6} rotation={-15} top="70%" right="5%" />
      <FloatingDiploma delay={-1} rotation={10} top="30%" left="15%" />
      <FloatingDiploma delay={-3} rotation={-25} top="80%" right="15%" />
      <FloatingDiploma delay={-5} rotation={20} top="40%" right="20%" />
      <FloatingDiploma delay={-7} rotation={-10} top="50%" left="12%" />

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center min-h-screen px-5 py-14 relative z-10">
        {/* Logo Section */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-10"
        >
          <div className="flex justify-center mb-4">
            <img 
              src="/logo-ensad.png" 
              alt="ENSAD Logo" 
              className="h-20 md:h-24 w-auto"
            />
          </div>
        </motion.div>

        {/* Main Title */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-center mb-2"
        >
          <h1 className="text-white text-5xl md:text-7xl font-light italic mb-2" style={{ fontFamily: 'Georgia, serif' }}>
            Cérémonie
          </h1>
          <p className="text-white/90 text-xl md:text-2xl font-light italic mb-8">
            de remise de diplômes
          </p>
        </motion.div>

        {/* Navigation Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mb-12"
        >
          <button
            onClick={() => {
              // Redirection basée sur le paramètre porte
              if (porte === 'porte1') {
                navigate('/navigate/Porte1ToAmphitheatre');
              } else if (porte === 'porte2') {
                navigate('/navigate/Porte2ToAmphitheatre');
              } else {
                // Si pas de paramètre spécifique, aller à la page d'accueil
                navigate('/');
              }
            }}
            className="bg-white/20 backdrop-blur-sm border border-white/30 text-white px-8 py-4 rounded-full font-medium text-lg hover:bg-white/30 hover:scale-105 transition-all duration-300 shadow-lg"
          >
            Commencer la navigation
          </button>
        </motion.div>

        {/* Promotion Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="text-center my-10"
        >
          <div className="text-white text-6xl md:text-8xl font-light italic" style={{ fontFamily: 'Georgia, serif' }}>
            <span className="text-7xl md:text-9xl font-bold">5</span>
            <sup className="text-4xl md:text-5xl">ème</sup>
          </div>
          <div className="text-white text-4xl md:text-6xl font-light italic mt-2" style={{ fontFamily: 'Georgia, serif' }}>
            promotion
          </div>
        </motion.div>

        {/* Degree Title */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="text-center mb-16"
        >
          <p className="text-white text-xl md:text-2xl font-light tracking-wide">
            Diplôme des Métiers d'Art et de Design
          </p>
        </motion.div>

        {/* Divider */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '80px' }}
          transition={{ duration: 1, delay: 1.5 }}
          className="h-0.5 bg-white mb-10"
        />

        {/* Event Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.8 }}
          className="text-center text-white"
        >
          <p className="text-2xl md:text-3xl font-light mb-3">
            Jeudi 17 juillet 2025
          </p>
          <p className="text-lg opacity-90 mb-12">
            16h00 - ENSET Mohammedia
          </p>
          <p className="text-sm opacity-80 tracking-widest">
            ensad.ma
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default EnsadPage;
