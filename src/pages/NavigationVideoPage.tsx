import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  RotateCcw, 
  MapPin, 
  Clock, 
  CheckCircle,
  Gauge,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import NavigationModal from '../components/NavigationModal';
import ProgressBar from '../components/ProgressBar';

interface PathData {
  id: string;
  from: string;
  to: string;
  time: string;
  videoPath: string; // Video file path
  path: string; // Keep for compatibility with NavigationModal
  title: string;
  description: string;
  duration?: number; // Video duration in seconds
}

interface WalkingPace {
  label: string;
  speed: number;
}

// Helper function to get optimized video URL
const getVideoUrl = (pathData: PathData) => {
  // Check if it's already a full URL
  if (pathData.videoPath.startsWith('http')) {
    return pathData.videoPath;
  }
  
  // For local files in public folder, ensure proper path
  const videoPath = pathData.videoPath.startsWith('/') ? pathData.videoPath : `/${pathData.videoPath}`;
  
  // Return the path directly (React serves from public folder)
  return videoPath;
};

const NavigationVideoPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Path and video states
  const [pathData, setPathData] = useState<PathData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(true);
  const [videoUrl, setVideoUrl] = useState<string>('');
  
  // Video playback states
  const [isWalking, setIsWalking] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [walkingPace, setWalkingPace] = useState('Marche normale');
  const [videoLoading, setVideoLoading] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [initialPressPosition, setInitialPressPosition] = useState<{ x: number; y: number } | null>(null);

  // Walking pace options
  const paceOptions: WalkingPace[] = [
    { label: 'Marche très lente', speed: 0.25 },
    { label: 'Marche lente', speed: 0.5 },
    { label: 'Marche normale', speed: 1 },
    { label: 'Marche rapide', speed: 1.5 },
    { label: 'Course légère', speed: 2 },
    { label: 'Course rapide', speed: 2.5 }
  ];

  useEffect(() => {
    const loadPathData = async () => {
      try {
        // Rediriger vers la page toilettes si l'ID commence par 'toilettes'
        if (id === 'toilettes') {
          const urlParams = new URLSearchParams(window.location.search);
          const pointDepart = urlParams.get('from') || 'Porte1';
          navigate(`/toilettes/${pointDepart}`);
          return;
        }

        // Rediriger vers la page mosquée si l'ID commence par 'mosquee'
        if (id === 'mosquee') {
          const urlParams = new URLSearchParams(window.location.search);
          const pointDepart = urlParams.get('from') || 'Porte1';
          navigate(`/mosquee/${pointDepart}`);
          return;
        }

        const response = await fetch('/paths.json');
        const paths = await response.json();
        const path = paths.find((p: PathData) => p.id === id);

        if (path) {
          setPathData(path);
          // Set the video URL
          const videoUrl = getVideoUrl(path);
          setVideoUrl(videoUrl);
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

  // Video event handlers
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      setVideoLoading(false);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };

    const handleEnded = () => {
      setIsWalking(false);
      setCurrentTime(video.duration);
    };

    const handleLoadStart = () => {
      setVideoLoading(true);
    };

    const handleCanPlay = () => {
      setVideoLoading(false);
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('loadstart', handleLoadStart);
    video.addEventListener('canplay', handleCanPlay);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('loadstart', handleLoadStart);
      video.removeEventListener('canplay', handleCanPlay);
    };
  }, [pathData]);

  // Video control functions
  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    
    setIsPressed(true);
    setInitialPressPosition({ x: clientX, y: clientY });
    
    // Démarrer la vidéo avec la vitesse normale
    const video = videoRef.current;
    if (video) {
      video.play();
      video.playbackRate = 1;
      setIsWalking(true);
      setWalkingPace('Marche normale');
    }
  };

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    if (!isPressed || !initialPressPosition) return;
    
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    // Calculer la différence verticale
    const deltaY = initialPressPosition.y - clientY;
    const sensitivity = 30; // Pixels de mouvement pour changer de vitesse (réduit pour plus de sensibilité)
    
    // Déterminer la vitesse basée sur le mouvement vertical
    let speedIndex = Math.floor(deltaY / sensitivity) + 2; // Index central = vitesse normale
    speedIndex = Math.max(0, Math.min(paceOptions.length - 1, speedIndex));
    
    const selectedPace = paceOptions[speedIndex];
    
    // Appliquer la vitesse
    const video = videoRef.current;
    if (video && video.readyState >= 2) { // Assurer que la vidéo est prête
      video.playbackRate = selectedPace.speed;
      setWalkingPace(selectedPace.label);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    setIsPressed(false);
    setInitialPressPosition(null);
    
    // Pauser la vidéo
    const video = videoRef.current;
    if (video) {
      video.pause();
      setIsWalking(false);
    }
  };

  const restartVideo = () => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = 0;
    video.playbackRate = 1;
    setCurrentTime(0);
    setIsWalking(false);
    setWalkingPace('Marche normale');
  };

  const seekBackward = () => {
    const video = videoRef.current;
    if (!video) return;
    
    video.currentTime = Math.max(0, video.currentTime - 3);
  };

  const seekForward = () => {
    const video = videoRef.current;
    if (!video) return;
    
    video.currentTime = Math.min(video.duration, video.currentTime + 3);
  };

  const startNavigation = () => {
    setShowModal(false);
  };

  // Helper functions
  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const isVideoEnded = currentTime >= duration - 1 && duration > 0;

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

  return (
    <div className="h-screen flex flex-col">
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
          className="h-full flex flex-col relative"
        >
          {/* Progress Bar - Fixed at top */}
          <div className="absolute top-0 left-0 right-0 z-20 px-4 py-2 bg-gradient-to-b from-black/50 to-transparent">
            <ProgressBar current={currentTime} total={duration} />
          </div>

          {/* Status Info - Fixed at top */}
          <div className="absolute top-12 left-1/2 -translate-x-1/2 z-20 bg-black/70 backdrop-blur-sm px-4 py-2 rounded-full text-white">
            <div className="flex items-center justify-center space-x-3 text-sm">
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{pathData.time}</span>
              </div>
              {videoLoading && (
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-xs">Chargement...</span>
                </div>
              )}
            </div>
          </div>

          {/* Video Container - Full Screen */}
          <div className="flex-1 relative">
            <AnimatePresence mode="wait">
              {isVideoEnded ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  className="absolute inset-0 bg-white text-center p-6 flex flex-col items-center justify-center z-10"
                >
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Destination atteinte !
                  </h2>
                  <div className="flex flex-col gap-3 w-full max-w-xs mx-auto">
                    <button
                      onClick={restartVideo}
                      className="button-secondary w-full text-gray-700 px-6 py-3 rounded-xl font-medium flex items-center justify-center space-x-2 bg-white/80 backdrop-blur-sm"
                    >
                      <RotateCcw className="w-5 h-5" />
                      <span>Recommencer le parcours</span>
                    </button>
                    <button
                      onClick={() => navigate('/')}
                      className="button-primary w-full text-white px-6 py-3 rounded-xl font-medium"
                    >
                      Nouveau parcours
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="video"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.2 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="absolute inset-0"
                >
                  {videoLoading ? (
                    <div className="w-full h-full flex items-center justify-center bg-gray-900">
                      <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  ) : (
                    <video
                      ref={videoRef}
                      src={videoUrl}
                      className="w-full h-full object-cover"
                      playsInline
                      preload="metadata"
                      onError={(e) => {
                        console.error('Video loading error:', e);
                      }}
                    />
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Controls Overlay - Only show when video is not ended */}
          {!isVideoEnded && (
            <div className="absolute inset-0 pointer-events-none z-30">
              {/* Speed Indicators */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 translate-y-32 pointer-events-none">
                {/* Up arrows for speed increase */}
                <div className="absolute -top-20 left-1/2 -translate-x-1/2 flex flex-col items-center space-y-1">
                  <ChevronUp className={`w-4 h-4 ${walkingPace.includes('rapide') || walkingPace.includes('Course') ? 'text-green-400' : 'text-white/60'}`} />
                  <ChevronUp className={`w-4 h-4 ${walkingPace.includes('rapide') || walkingPace.includes('Course') ? 'text-green-400' : 'text-white/60'}`} />
                  <span className="text-xs text-white/60 font-medium">Accélérer</span>
                </div>

                {/* Down arrows for speed decrease */}
                <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 flex flex-col items-center space-y-1">
                  <span className="text-xs text-white/60 font-medium">Ralentir</span>
                  <ChevronDown className={`w-4 h-4 ${walkingPace.includes('lente') ? 'text-yellow-400' : 'text-white/60'}`} />
                  <ChevronDown className={`w-4 h-4 ${walkingPace.includes('lente') ? 'text-yellow-400' : 'text-white/60'}`} />
                </div>

                {/* Left arrows for seek backward */}
                <div className="absolute top-1/2 -left-20 -translate-y-1/2 flex flex-col items-center space-y-1">
                  <div className="flex items-center space-x-1">
                    <ChevronLeft className="w-4 h-4 text-white/60" />
                    <ChevronLeft className="w-4 h-4 text-white/60" />
                  </div>
                  <span className="text-xs text-white/60 font-medium">-3s</span>
                </div>

                {/* Right arrows for seek forward */}
                <div className="absolute top-1/2 -right-20 -translate-y-1/2 flex flex-col items-center space-y-1">
                  <div className="flex items-center space-x-1">
                    <ChevronRight className="w-4 h-4 text-white/60" />
                    <ChevronRight className="w-4 h-4 text-white/60" />
                  </div>
                  <span className="text-xs text-white/60 font-medium">+3s</span>
                </div>
              </div>

              {/* Central Control Button */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 translate-y-32 pointer-events-auto">
                <button
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                  onMouseDown={handleTouchStart}
                  onMouseMove={handleTouchMove}
                  onMouseUp={handleTouchEnd}
                  onMouseLeave={handleTouchEnd}
                  className={`w-32 h-32 rounded-full border-4 border-white/80 bg-black/40 backdrop-blur-sm flex items-center justify-center transition-all duration-200 select-none ${
                    isPressed
                      ? 'scale-110 border-white bg-black/60'
                      : 'hover:bg-black/50'
                  }`}
                  style={{ touchAction: 'none' }}
                  aria-label={isWalking ? "Arrêter la navigation" : "Commencer la navigation"}
                >
                  {/* Empty circle - no icon */}
                </button>
              </div>

              {/* Seek Control Areas - Positioned within screen */}
              <button
                onClick={seekBackward}
                className="absolute top-1/2 left-4 w-20 h-20 -translate-y-1/2 pointer-events-auto rounded-full"
                style={{ background: 'rgba(0,0,0,0.1)' }}
                aria-label="Reculer de 3 secondes"
              />
              <button
                onClick={seekForward}
                className="absolute top-1/2 right-4 w-20 h-20 -translate-y-1/2 pointer-events-auto rounded-full"
                style={{ background: 'rgba(0,0,0,0.1)' }}
                aria-label="Avancer de 3 secondes"
              />
            </div>
          )}

          {/* Bottom Status Bar */}
          {!isVideoEnded && (
            <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/80 to-transparent p-4">
              <div className="flex justify-between items-center text-white text-sm">
                <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
                <div className="flex items-center space-x-2">
                  <Gauge className="w-4 h-4" />
                  <span>{walkingPace}</span>
                  {isPressed && (
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  )}
                </div>
              </div>
              
              {/* Restart button */}
              <div className="flex justify-center mt-2">
                <button
                  onClick={restartVideo}
                  className="text-white/80 hover:text-white px-4 py-2 rounded-lg font-medium flex items-center justify-center space-x-2 bg-white/10 backdrop-blur-sm"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Recommencer</span>
                </button>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default NavigationVideoPage;
