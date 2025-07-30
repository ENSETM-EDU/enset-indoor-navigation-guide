import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  MapPin, 
  Clock, 
  CheckCircle,
  SkipBack,
  SkipForward,
  Gauge
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
  icon: string;
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

// Helper function to get device-appropriate video quality
const getOptimalVideoPath = (pathData: PathData) => {
  const isMobile = window.innerWidth < 768;
  const isTablet = window.innerWidth < 1024;
  
  // Try to use device-specific versions if they exist
  if (isMobile && pathData.videoPath) {
    const mobilePath = pathData.videoPath.replace('.mp4', '_mobile.mp4');
    return getVideoUrl({ ...pathData, videoPath: mobilePath });
  }
  
  if (isTablet && pathData.videoPath) {
    const tabletPath = pathData.videoPath.replace('.mp4', '_tablet.mp4');
    return getVideoUrl({ ...pathData, videoPath: tabletPath });
  }
  
  return getVideoUrl(pathData);
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
  const [walkingPace, setWalkingPace] = useState('normale');
  const [videoLoading, setVideoLoading] = useState(false);

  // Walking pace options
  const paceOptions: WalkingPace[] = [
    { label: 'Marche lente', icon: '🚶‍♂️', speed: 0.5 },
    { label: 'Marche normale', icon: '🚶‍♂️', speed: 1 },
    { label: 'Marche rapide', icon: '🏃‍♂️', speed: 1.5 },
    { label: 'Course légère', icon: '🏃‍♂️', speed: 2 }
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
          // Set the optimal video URL based on device and available qualities
          const optimalUrl = getOptimalVideoPath(path);
          setVideoUrl(optimalUrl);
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

  // Check video size for performance optimization
  useEffect(() => {
    if (videoUrl) {
      checkVideoSize(videoUrl);
    }
  }, [videoUrl]);

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
  const toggleWalking = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isWalking) {
      video.pause();
      setIsWalking(false);
    } else {
      video.play();
      setIsWalking(true);
    }
  };

  const changePace = (pace: WalkingPace) => {
    const video = videoRef.current;
    if (!video) return;

    video.playbackRate = pace.speed;
    setWalkingPace(pace.label);
  };

  const seekBackward = () => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = Math.max(0, video.currentTime - 10);
  };

  const seekForward = () => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = Math.min(video.duration, video.currentTime + 10);
  };

  const restartVideo = () => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = 0;
    setCurrentTime(0);
    setIsWalking(false);
  };

  const startNavigation = () => {
    setShowModal(false);
  };

  // Helper functions
  const getProgressMessage = (currentTime: number, duration: number) => {
    const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
    if (progress < 10) return "🚩 Début du parcours";
    if (progress < 25) return "📍 Première partie";
    if (progress < 50) return "📍 Milieu du parcours";
    if (progress < 75) return "📍 Bientôt arrivé";
    if (progress < 95) return "🎯 Presque là !";
    return "✅ Destination atteinte !";
  };

  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Check if video file size is too large and suggest compression
  const checkVideoSize = async (url: string) => {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      const contentLength = response.headers.get('content-length');
      if (contentLength) {
        const sizeMB = parseInt(contentLength) / (1024 * 1024);
        if (sizeMB > 10) {
          console.warn(`Video is ${sizeMB.toFixed(1)}MB. Consider compressing for better performance.`);
        }
      }
    } catch (error) {
      console.error('Error checking video size:', error);
    }
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
          className="h-full flex flex-col overflow-hidden"
        >
          <div className="px-4 py-2">
            <ProgressBar current={currentTime} total={duration} />
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
                  <span className="text-gray-700">
                    {getProgressMessage(currentTime, duration)}
                  </span>
                </div>
                {videoLoading && (
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    <span className="text-blue-600 text-xs">Chargement...</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1 flex flex-col mt-6">
              <div className="flex-1 bg-white/80 backdrop-blur-sm rounded-t-3xl border border-b-0 border-gray-200/50 shadow-xl overflow-hidden">
                <AnimatePresence mode="wait">
                  {isVideoEnded ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.4 }}
                      className="relative text-center p-6 flex flex-col items-center justify-center h-full"
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
                      className="h-full"
                    >
                      <div className="h-full relative overflow-hidden">
                        {videoLoading ? (
                          <div className="w-full h-[67vh] flex items-center justify-center bg-gray-100">
                            <div className="w-8 h-8 border-4 border-blue-900 border-t-transparent rounded-full animate-spin"></div>
                          </div>
                        ) : (
                          <video
                            ref={videoRef}
                            src={videoUrl}
                            className="w-full h-[67vh] object-cover"
                            playsInline
                            preload="metadata"
                            onError={(e) => {
                              console.error('Video loading error:', e);
                              // Fallback to original path if optimized version fails
                              if (pathData && videoUrl !== pathData.videoPath) {
                                setVideoUrl(pathData.videoPath);
                              }
                            }}
                          />
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {!isVideoEnded && (
                <div className="bg-white/80 backdrop-blur-sm rounded-b-3xl border border-t-0 border-gray-200/50 shadow-xl">
                  <div className="p-4 space-y-4">
                    {/* Time and pace display */}
                    <div className="flex justify-between items-center text-sm text-gray-600">
                      <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
                      <div className="flex items-center space-x-1">
                        <Gauge className="w-4 h-4" />
                        <span>{walkingPace}</span>
                      </div>
                    </div>

                    {/* Main controls */}
                    <div className="flex justify-between items-center gap-3">
                      <button
                        onClick={seekBackward}
                        className="flex-1 button-secondary text-gray-700 px-4 py-3 rounded-xl font-medium flex items-center justify-center space-x-1"
                      >
                        <SkipBack className="w-5 h-5" />
                        <span>Retour</span>
                      </button>

                      <button
                        onClick={toggleWalking}
                        className="flex-1 button-primary text-white px-4 py-3 rounded-xl font-medium flex items-center justify-center space-x-1"
                      >
                        {isWalking ? (
                          <>
                            <Pause className="w-5 h-5" />
                            <span>Pause</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-5 h-5" />
                            <span>Marcher</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={seekForward}
                        className="flex-1 button-secondary text-gray-700 px-4 py-3 rounded-xl font-medium flex items-center justify-center space-x-1"
                      >
                        <span>Avancer</span>
                        <SkipForward className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Pace control */}
                    <div className="flex justify-center space-x-2">
                      {paceOptions.map((pace) => (
                        <button
                          key={pace.label}
                          onClick={() => changePace(pace)}
                          className={`px-3 py-2 rounded-lg text-xs font-medium flex items-center space-x-1 transition-colors ${
                            walkingPace === pace.label
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          <span>{pace.icon}</span>
                          <span>{pace.label}</span>
                        </button>
                      ))}
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

export default NavigationVideoPage;
