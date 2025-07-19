import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

const EnsetPage: React.FC = () => {
  const navigate = useNavigate();
  const { porte } = useParams<{ porte?: string }>();

  // Floating star component
  const FloatingStar = ({ delay, top, left, right, size = 'text-2xl' }: { 
    delay: number; 
    top: string; 
    left?: string; 
    right?: string;
    size?: string;
  }) => (
    <motion.div
      className={`absolute ${size} text-yellow-400 opacity-60`}
      style={{
        top,
        left,
        right,
      }}
      animate={{
        y: [0, -10, 0],
        opacity: [0.6, 1, 0.6],
      }}
      transition={{
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
    >
      ✦
    </motion.div>
  );

  return (
    <div className="min-h-screen relative overflow-hidden" style={{
      background: 'linear-gradient(135deg, #1a2b4a 0%, #2d4a6b 50%, #1e3a5f 100%)'
    }}>
      {/* Golden border */}
      <div className="absolute inset-4 border-4 border-yellow-400 shadow-2xl" style={{
        boxShadow: '0 0 30px rgba(212, 175, 55, 0.2), inset 0 0 0 2px rgba(212, 175, 55, 0.1)'
      }}>
        {/* Background overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 to-blue-800/10 backdrop-blur-sm" />
      </div>

      {/* Back Button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        onClick={() => navigate(-1)}
        className="absolute top-8 left-8 z-20 flex items-center space-x-2 text-white/80 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Retour</span>
      </motion.button>

      {/* Floating Stars */}
      <FloatingStar delay={0} top="10%" left="15%" />
      <FloatingStar delay={-2} top="20%" right="20%" size="text-xl" />
      <FloatingStar delay={-4} top="60%" left="10%" />
      <FloatingStar delay={-1} top="70%" right="15%" size="text-xl" />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-between min-h-screen px-8 py-16">
        {/* Header with dual logos */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex justify-between items-center w-full max-w-4xl mb-4"
        >
          {/* ENSET Logo - Left */}
          <motion.img 
            src="/enset-ceremonie-logo.png" 
            alt="ENSET 40 ans - Logo de cérémonie" 
            className="h-20 md:h-28 w-auto"
            initial={{ scale: 0, opacity: 0, x: -50 }}
            animate={{ scale: 1, opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          />
          
          {/* FDE Logo - Right */}
          <motion.img 
            src="/fde-logo.png" 
            alt="FDE Logo" 
            className="h-20 md:h-28 w-auto"
            initial={{ scale: 0, opacity: 0, x: 50 }}
            animate={{ scale: 1, opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          />
        </motion.div>

        {/* Main content area */}
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          {/* Main Title */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-center mb-2"
          >
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-yellow-400 mb-1 leading-tight"
                style={{ 
                  fontFamily: 'Playfair Display, Georgia, serif',
                  textShadow: '0 2px 4px rgba(212, 175, 55, 0.3)'
                }}>
              CÉRÉMONIE DE REMISE<br />
              DE DIPLÔMES
            </h1>
          </motion.div>

          {/* Promo banner */}
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mb-2"
          >
            <img 
              src="/enset-promo-2025.png" 
              alt="PROMO 2025" 
              className="h-16 md:h-20 w-auto mx-auto"
            />
          </motion.div>

          {/* Graduation cap illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="mb-8"
          >
            <img 
              src="/ceremonie-cap.png" 
              alt="Golden Graduation Cap and Diploma" 
              className="h-24 md:h-40 w-auto mx-auto"
            />
          </motion.div>

          {/* Navigation Button */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.5 }}
            className="mb-4 relative"
          >
            {/* Flow particles around button */}
            <div className="absolute inset-0 flex items-center justify-center">
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-3 h-3 bg-yellow-400 rounded-full opacity-80"
                  style={{
                    filter: 'blur(1px)',
                    left: '50%',
                    top: '50%',
                    transformOrigin: '0 0',
                  }}
                  animate={{
                    x: [
                      Math.cos((i * 45 * Math.PI) / 180) * 80 - 6,
                      Math.cos(((i * 45 + 90) * Math.PI) / 180) * 80 - 6,
                      Math.cos(((i * 45 + 180) * Math.PI) / 180) * 80 - 6,
                      Math.cos(((i * 45 + 270) * Math.PI) / 180) * 80 - 6,
                      Math.cos((i * 45 * Math.PI) / 180) * 80 - 6,
                    ],
                    y: [
                      Math.sin((i * 45 * Math.PI) / 180) * 80 - 6,
                      Math.sin(((i * 45 + 90) * Math.PI) / 180) * 80 - 6,
                      Math.sin(((i * 45 + 180) * Math.PI) / 180) * 80 - 6,
                      Math.sin(((i * 45 + 270) * Math.PI) / 180) * 80 - 6,
                      Math.sin((i * 45 * Math.PI) / 180) * 80 - 6,
                    ],
                    opacity: [0.8, 1, 0.8, 1, 0.8],
                    scale: [0.8, 1.4, 0.8, 1.4, 0.8],
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "linear",
                    delay: i * 0.15,
                  }}
                />
              ))}
            </div>

            {/* Glowing ring around button */}
            <motion.div
              className="absolute inset-0 -m-4 rounded-full border-2 border-yellow-400/40"
              animate={{
                rotate: [0, 360],
                scale: [1, 1.1, 1],
                opacity: [0.4, 0.8, 0.4],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "linear",
              }}
            />

            {/* Secondary ring */}
            <motion.div
              className="absolute inset-0 -m-6 rounded-full border border-amber-300/30"
              animate={{
                rotate: [360, 0],
                scale: [1.1, 1, 1.1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear",
              }}
            />

            <motion.button
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
              className="relative z-10 bg-gradient-to-r from-yellow-400/30 to-amber-500/30 backdrop-blur-sm border-2 border-yellow-400 text-white px-8 py-4 rounded-full font-bold text-lg hover:from-yellow-400/50 hover:to-amber-500/50 hover:scale-110 transition-all duration-200 shadow-2xl"
              style={{
                background: 'linear-gradient(45deg, rgba(212, 175, 55, 0.3), rgba(245, 158, 11, 0.3))',
                borderColor: '#d4af37',
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)'
              }}
              animate={{
                boxShadow: [
                  '0 0 25px rgba(212, 175, 55, 0.5)',
                  '0 0 50px rgba(245, 158, 11, 0.8)',
                  '0 0 25px rgba(212, 175, 55, 0.5)',
                  '0 0 60px rgba(212, 175, 55, 0.9)',
                  '0 0 25px rgba(245, 158, 11, 0.5)'
                ],
                scale: [1, 1.15, 0.95, 1.12, 1]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              Commencer la navigation
            </motion.button>
          </motion.div>
        </div>

        {/* Event details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.8 }}
          className="text-center"
        >
          <div className="flex items-center justify-center space-x-6 md:space-x-16 text-yellow-400 mb-4">
            <div className="text-center">
              <div className="text-3xl md:text-5xl font-bold"
                   style={{ 
                     fontFamily: 'Playfair Display, Georgia, serif',
                     textShadow: '0 2px 4px rgba(212, 175, 55, 0.3)'
                   }}>
                14:00
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-4xl md:text-7xl lg:text-8xl font-bold"
                   style={{ 
                     fontFamily: 'Playfair Display, Georgia, serif',
                     textShadow: '0 2px 4px rgba(212, 175, 55, 0.3)'
                   }}>
                19
              </div>
              <div className="text-xl md:text-3xl font-bold"
                   style={{ 
                     fontFamily: 'Playfair Display, Georgia, serif',
                     textShadow: '0 2px 4px rgba(212, 175, 55, 0.3)'
                   }}>
                JUILLET
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl md:text-4xl font-bold"
                   style={{ 
                     fontFamily: 'Playfair Display, Georgia, serif',
                     textShadow: '0 2px 4px rgba(212, 175, 55, 0.3)'
                   }}>
                Amphi
              </div>
              <div className="text-xl md:text-3xl font-bold"
                   style={{ 
                     fontFamily: 'Playfair Display, Georgia, serif',
                     textShadow: '0 2px 4px rgba(212, 175, 55, 0.3)'
                   }}>
                Théâtre
              </div>
            </div>
          </div>
          
          <div className="text-yellow-400 text-lg font-bold mb-2">
            SAMEDI
          </div>
          
          <div className="text-yellow-400/80 text-sm tracking-widest">
            enset-media.ac.ma
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default EnsetPage;
