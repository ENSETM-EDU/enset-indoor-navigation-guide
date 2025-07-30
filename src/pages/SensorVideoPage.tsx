import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  MapPin, 
  Clock, 
  CheckCircle,
  Smartphone,
  Gauge,
  Activity,
  AlertTriangle,
  Zap
} from 'lucide-react';
import NavigationModal from '../components/NavigationModal';
import ProgressBar from '../components/ProgressBar';

interface PathData {
  id: string;
  from: string;
  to: string;
  time: string;
  videoPath: string;
  path: string;
  title: string;
  description: string;
  duration?: number;
}

// Helper function to get optimized video URL
const getVideoUrl = (pathData: PathData) => {
  if (pathData.videoPath.startsWith('http')) {
    return pathData.videoPath;
  }
  
  const videoPath = pathData.videoPath.startsWith('/') ? pathData.videoPath : `/${pathData.videoPath}`;
  return videoPath;
};

// Helper function to get device-appropriate video quality
const getOptimalVideoPath = (pathData: PathData) => {
  const isMobile = window.innerWidth < 768;
  const isTablet = window.innerWidth < 1024;
  
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

const SensorVideoPage: React.FC = () => {
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
  const [videoLoading, setVideoLoading] = useState(false);
  
  // Sensor states
  const [sensorsEnabled, setSensorsEnabled] = useState(false);
  const [sensorPermission, setSensorPermission] = useState<'granted' | 'denied' | 'pending'>('pending');
  const [currentSpeed, setCurrentSpeed] = useState(1);
  const [sensorStatus, setSensorStatus] = useState('Capteurs désactivés');
  
  // Sensor thresholds and settings
  const TILT_THRESHOLD = 15; // degrees
  const SHAKE_THRESHOLD = 15; // m/s²
  const ROTATION_THRESHOLD = 30; // degrees
  const SEEK_AMOUNT = 5; // seconds
  
  // Debounce for shake detection
  const lastShakeTime = useRef(0);
  const SHAKE_DEBOUNCE = 1000; // 1 second

  useEffect(() => {
    const loadPathData = async () => {
      try {
        if (id === 'toilettes') {
          const urlParams = new URLSearchParams(window.location.search);
          const pointDepart = urlParams.get('from') || 'Porte1';
          navigate(`/toilettes/${pointDepart}`);
          return;
        }

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

  // Device motion handler
  const handleDeviceMotion = useCallback((event: DeviceMotionEvent) => {
    const acceleration = event.accelerationIncludingGravity;
    if (!acceleration) return;

    const now = Date.now();
    
    // Detect shake (sudden movement)
    const totalAcceleration = Math.sqrt(
      (acceleration.x || 0) ** 2 + 
      (acceleration.y || 0) ** 2 + 
      (acceleration.z || 0) ** 2
    );

    // Debug log every 2 seconds
    if (now % 2000 < 100) {
      console.log('Motion event:', { totalAcceleration, x: acceleration.x, y: acceleration.y, z: acceleration.z });
    }

    if (totalAcceleration > SHAKE_THRESHOLD && now - lastShakeTime.current > SHAKE_DEBOUNCE) {
      console.log('Shake detected!', totalAcceleration);
      lastShakeTime.current = now;
      toggleWalking();
      setSensorStatus('🔄 Secousse détectée - Toggle lecture');
    }
  }, []);

  // Device orientation handler
  const handleDeviceOrientation = useCallback((event: DeviceOrientationEvent) => {
    const beta = event.beta || 0; // Front/back tilt
    const gamma = event.gamma || 0; // Left/right tilt

    // Debug log every 2 seconds
    const now = Date.now();
    if (now % 2000 < 100) {
      console.log('Orientation event:', { beta, gamma });
    }

    const video = videoRef.current;
    if (!video) return;

    // Control video speed based on front/back tilt (beta)
    let newSpeed = 1;
    let status = 'Vitesse normale';

    if (beta > TILT_THRESHOLD) {
      // Tilted forward - speed up
      newSpeed = 2;
      status = '⚡ Accélération (penché avant)';
      console.log('Tilted forward, speeding up');
    } else if (beta < -TILT_THRESHOLD) {
      // Tilted backward - slow down
      newSpeed = 0.5;
      status = '🐌 Ralentissement (penché arrière)';
      console.log('Tilted backward, slowing down');
    }

    if (newSpeed !== currentSpeed) {
      video.playbackRate = newSpeed;
      setCurrentSpeed(newSpeed);
      setSensorStatus(status);
    }

    // Control video seeking based on left/right tilt (gamma)
    if (Math.abs(gamma) > ROTATION_THRESHOLD) {
      if (now - lastShakeTime.current > 500) { // Throttle seeking
        lastShakeTime.current = now;
        
        if (gamma > ROTATION_THRESHOLD) {
          // Tilted right - seek forward
          console.log('Tilted right, seeking forward');
          video.currentTime = Math.min(video.duration, video.currentTime + SEEK_AMOUNT);
          setSensorStatus('⏩ Avance rapide (penché droite)');
        } else if (gamma < -ROTATION_THRESHOLD) {
          // Tilted left - seek backward
          console.log('Tilted left, seeking backward');
          video.currentTime = Math.max(0, video.currentTime - SEEK_AMOUNT);
          setSensorStatus('⏪ Retour rapide (penché gauche)');
        }
      }
    }
  }, [currentSpeed]);

  // Request sensor permissions
  const requestSensorPermission = async () => {
    try {
      setSensorPermission('pending');
      console.log('Requesting sensor permissions...');
      
      // Check if we're on a mobile device
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
      if (!isMobile) {
        console.warn('Not on a mobile device');
        setSensorPermission('denied');
        setSensorStatus('❌ Capteurs non disponibles sur cet appareil');
        return;
      }

      // For iOS 13+, we need to request permission
      if (typeof (DeviceMotionEvent as any).requestPermission === 'function') {
        console.log('iOS device detected, requesting permissions...');
        const motionPermission = await (DeviceMotionEvent as any).requestPermission();
        const orientationPermission = await (DeviceOrientationEvent as any).requestPermission();
        
        console.log('Motion permission:', motionPermission);
        console.log('Orientation permission:', orientationPermission);
        
        if (motionPermission === 'granted' && orientationPermission === 'granted') {
          setSensorPermission('granted');
          enableSensors();
        } else {
          setSensorPermission('denied');
          setSensorStatus('❌ Permission refusée');
        }
      } else {
        // For Android and older iOS versions
        console.log('Android device or older iOS, enabling sensors directly...');
        setSensorPermission('granted');
        enableSensors();
      }
    } catch (error) {
      console.error('Erreur lors de la demande de permission:', error);
      setSensorPermission('denied');
      setSensorStatus('❌ Erreur de permission');
    }
  };

  // Enable sensors
  const enableSensors = () => {
    console.log('Enabling sensors...');
    setSensorsEnabled(true);
    setSensorStatus('✅ Capteurs activés - Bougez votre téléphone !');
    
    // Check if DeviceMotionEvent is available
    if (typeof DeviceMotionEvent === 'undefined') {
      console.error('DeviceMotionEvent not supported');
      setSensorStatus('❌ DeviceMotionEvent non supporté');
      return;
    }

    // Check if DeviceOrientationEvent is available
    if (typeof DeviceOrientationEvent === 'undefined') {
      console.error('DeviceOrientationEvent not supported');
      setSensorStatus('❌ DeviceOrientationEvent non supporté');
      return;
    }

    // Add event listeners
    window.addEventListener('devicemotion', handleDeviceMotion, { passive: true });
    window.addEventListener('deviceorientation', handleDeviceOrientation, { passive: true });
    
    console.log('Event listeners added for devicemotion and deviceorientation');
    
    // Test if sensors are working after a delay
    setTimeout(() => {
      console.log('Checking if sensors are responding...');
      setSensorStatus('✅ Capteurs prêts - Testez en bougeant le téléphone');
    }, 1000);
  };

  // Disable sensors
  const disableSensors = () => {
    console.log('Disabling sensors...');
    setSensorsEnabled(false);
    setSensorStatus('⏸️ Capteurs désactivés');
    
    window.removeEventListener('devicemotion', handleDeviceMotion);
    window.removeEventListener('deviceorientation', handleDeviceOrientation);
    
    // Reset video speed
    const video = videoRef.current;
    if (video) {
      video.playbackRate = 1;
      setCurrentSpeed(1);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disableSensors();
    };
  }, []);

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

  const getSpeedIcon = (speed: number) => {
    if (speed > 1.5) return '⚡';
    if (speed < 0.8) return '🐌';
    return '🚶‍♂️';
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
            {/* Status bar */}
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

            {/* Sensor status bar */}
            <div className="absolute top-12 left-1/2 -translate-x-1/2 z-10 bg-blue-50/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-md border border-blue-200">
              <div className="flex items-center space-x-2 text-xs">
                <Activity className="w-3 h-3 text-blue-600" />
                <span className="text-blue-800">{sensorStatus}</span>
                {sensorsEnabled && (
                  <div className="flex items-center space-x-1">
                    <span className="text-blue-600">{getSpeedIcon(currentSpeed)}</span>
                    <span className="text-blue-700">{currentSpeed}x</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1 flex flex-col mt-16">
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
                          <div className="w-full h-[60vh] flex items-center justify-center bg-gray-100">
                            <div className="w-8 h-8 border-4 border-blue-900 border-t-transparent rounded-full animate-spin"></div>
                          </div>
                        ) : (
                          <video
                            ref={videoRef}
                            src={videoUrl}
                            className="w-full h-[60vh] object-cover"
                            playsInline
                            preload="metadata"
                            onError={(e) => {
                              console.error('Video loading error:', e);
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
                    {/* Time display */}
                    <div className="flex justify-between items-center text-sm text-gray-600">
                      <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
                      <div className="flex items-center space-x-1">
                        <Gauge className="w-4 h-4" />
                        <span>{getSpeedIcon(currentSpeed)} {currentSpeed}x</span>
                      </div>
                    </div>

                    {/* Sensor controls */}
                    <div className="space-y-3">
                      {!sensorsEnabled ? (
                        <button
                          onClick={requestSensorPermission}
                          disabled={sensorPermission === 'pending'}
                          className="w-full button-primary text-white px-4 py-3 rounded-xl font-medium flex items-center justify-center space-x-2"
                        >
                          <Smartphone className="w-5 h-5" />
                          <span>
                            {sensorPermission === 'pending' ? 'Activation...' : 'Activer les capteurs'}
                          </span>
                        </button>
                      ) : (
                        <div className="flex space-x-2">
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
                            onClick={disableSensors}
                            className="button-secondary text-gray-700 px-4 py-3 rounded-xl font-medium flex items-center justify-center"
                          >
                            <Zap className="w-5 h-5" />
                          </button>
                        </div>
                      )}

                      {/* Sensor instructions */}
                      {sensorsEnabled && (
                        <div className="bg-blue-50 rounded-xl p-3 text-xs text-blue-800">
                          <div className="flex items-start space-x-2">
                            <AlertTriangle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                            <div className="space-y-1">
                              <p><strong>Instructions :</strong></p>
                              <p>• Penchez vers l'avant pour accélérer ⚡</p>
                              <p>• Penchez vers l'arrière pour ralentir 🐌</p>
                              <p>• Inclinez à gauche/droite pour naviguer ⏪⏩</p>
                              <p>• Secouez pour pause/lecture 🔄</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {sensorPermission === 'denied' && (
                        <div className="bg-red-50 rounded-xl p-3 text-xs text-red-800">
                          <div className="flex items-center space-x-2">
                            <AlertTriangle className="w-4 h-4 text-red-600" />
                            <p>Permission refusée. Activez les capteurs dans les paramètres de votre navigateur.</p>
                          </div>
                        </div>
                      )}
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

export default SensorVideoPage;
