import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, RotateCcw, MapPin, Clock, CheckCircle } from 'lucide-react';
import NavigationModal from '../components/NavigationModal';
import ProgressBar from '../components/ProgressBar';

interface PathData {
  id: string;
  from: string;
  to: string;
  time: string;
  path: string;
  title: string;
  description: string;
}

const NavigationPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [pathData, setPathData] = useState<PathData | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [totalSteps, setTotalSteps] = useState(0);
  const [showModal, setShowModal] = useState(true);
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPathData = async () => {
      try {
        // Rediriger vers la sélection du genre pour toilettes et mosquée
        if (id === 'toilettes' || id === 'mosquee') {
          navigate(`/gender-selection/${id}`);
          return;
        }

        const response = await fetch('/paths.json');
        const paths = await response.json();
        const path = paths.find((p: PathData) => p.id === id);

        if (path) {
          setPathData(path);
          await loadImages(path.path);
        } else {
          console.error('Parcours non trouvé');
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPathData();
  }, [id, navigate]);

  const loadImages = async (pathDir: string) => {
    const imageUrls: string[] = [];
    let step = 1;
    const maxSteps = 100; // Safety limit to prevent infinite loops

    try {
      // Load numbered images (1.png, 2.png, 3.png, etc.)
      while (step <= maxSteps) {
        const imagePath = `/${pathDir}/${step}.png`;

        try {
          // Create a promise to check if image exists
          const imageExists = await new Promise<boolean>((resolve) => {
            const img = new Image();
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
            img.src = imagePath;
          });

          if (imageExists) {
            imageUrls.push(imagePath);
            step++;
          } else {
            // No more images found, break the loop
            break;
          }
        } catch (error) {
          console.error(`Erreur lors du chargement de l'image ${step}:`, error);
          break;
        }
      }

      if (imageUrls.length > 0) {
        setImages(imageUrls);
        setTotalSteps(imageUrls.length);
      } else {
        console.error('Aucune image trouvée pour ce parcours');
      }
    } catch (error) {
      console.error('Erreur générale lors du chargement des images:', error);
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const restart = () => {
    setCurrentStep(0);
  };

  const startNavigation = () => {
    setShowModal(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-900 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement du parcours...</p>
        </div>
      </div>
    );
  }

  if (!pathData) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <div className="max-w-md mx-auto bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-gray-200/50 shadow-xl">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Parcours non trouvé</h2>
          <p className="text-gray-600 mb-6">Le parcours demandé n'existe pas ou n'est pas disponible.</p>
          <button
            onClick={() => navigate('/')}
            className="button-primary text-white px-6 py-3 rounded-2xl font-medium"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  const isLastStep = currentStep === totalSteps - 1;

  return (
    <div className="min-h-screen flex flex-col">
      <AnimatePresence>
        {showModal && (
          <NavigationModal
            pathData={pathData}
            onStart={startNavigation}
            onClose={() => navigate('/')}
          />
        )}
      </AnimatePresence>

      {!showModal && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="h-screen flex flex-col overflow-hidden"
        >
          <div className="px-4 py-2">
            <ProgressBar current={currentStep + 1} total={totalSteps} />
          </div>

          <div className="flex-1 flex flex-col px-4 relative">
            <div className="absolute top-2 left-1/2 -translate-x-1/2 z-10 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
              <div className="flex items-center justify-center space-x-3 text-sm">
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4 text-gray-600" />
                  <span className="text-gray-700">{pathData.time}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4 text-gray-600" />
                  <span className="text-gray-700">{currentStep + 1}/{totalSteps}</span>
                </div>
              </div>
            </div>

            <div className="flex-1 flex flex-col mt-12">
              <div className="flex-1 bg-white/80 backdrop-blur-sm rounded-t-3xl border border-b-0 border-gray-200/50 shadow-xl overflow-hidden">
                <AnimatePresence mode="wait">
                  {isLastStep ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.4 }}
                      className="relative text-center p-6 flex flex-col items-center justify-center h-full"
                    >
                      <div 
                        className="absolute inset-0 z-0"
                        style={{
                          backgroundImage: `url(${images[images.length - 1]})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          opacity: 0.3
                        }}
                      />
                      <div className="relative z-10">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                          <CheckCircle className="w-10 h-10 text-green-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                          Destination atteinte !
                        </h2>
                        <div className="flex flex-col gap-3 w-full max-w-xs mx-auto">
                          <button
                            onClick={restart}
                            className="button-secondary w-full text-gray-700 px-6 py-3 rounded-xl font-medium flex items-center justify-center space-x-2 bg-white/80 backdrop-blur-sm"
                          >
                            <RotateCcw className="w-5 h-5" />
                            <span>Recommencer</span>
                          </button>
                          <button
                            onClick={() => navigate('/')}
                            className="button-primary w-full text-white px-6 py-3 rounded-xl font-medium"
                          >
                            Nouveau parcours
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key={currentStep}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.2 }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      className="h-full"
                    >
                      <div className="h-full relative overflow-hidden">
                        <motion.img
                          src={images[currentStep]}
                          alt={`Étape ${currentStep + 1}`}
                          className="w-full h-full object-cover"
                          onClick={nextStep}
                          loading="lazy"
                          initial={{ scale: 1 }}
                          animate={{ scale: 1.05 }}
                          transition={{ duration: 3, ease: "easeOut" }}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {!isLastStep && (
                <div className="bg-white/80 backdrop-blur-sm rounded-b-3xl border border-t-0 border-gray-200/50 shadow-xl">
                  <div className="p-4">
                    <div className="flex justify-between items-center gap-3">
                      <button
                        onClick={prevStep}
                        disabled={currentStep === 0}
                        className="flex-1 button-secondary text-gray-700 px-4 py-3 rounded-xl font-medium flex items-center justify-center space-x-1 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronLeft className="w-5 h-5" />
                        <span>Précédent</span>
                      </button>

                      <button
                        onClick={nextStep}
                        disabled={currentStep === totalSteps - 1}
                        className="flex-1 button-primary text-white px-4 py-3 rounded-xl font-medium flex items-center justify-center space-x-1 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span>Suivant</span>
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default NavigationPage;