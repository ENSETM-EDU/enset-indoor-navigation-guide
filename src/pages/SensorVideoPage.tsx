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
  const TILT_THRESHOLD = 10; // Réduit pour plus de sensibilité
  const SHAKE_THRESHOLD = 12; // Réduit pour plus de sensibilité 
  const ROTATION_THRESHOLD = 20; // Réduit pour plus de sensibilité
  const SEEK_AMOUNT = 3; // Réduit pour des mouvements plus fins
  
  // Debounce for shake detection
  const lastShakeTime = useRef(0);
  const lastOrientationTime = useRef(0);
  const SHAKE_DEBOUNCE = 800; // Réduit pour plus de réactivité
  const ORIENTATION_DEBOUNCE = 300;

  // Variables pour calibrer l'orientation initiale
  const initialBeta = useRef<number | null>(null);
  const initialGamma = useRef<number | null>(null);
  const calibrationSamples = useRef<{beta: number[], gamma: number[]}>({beta: [], gamma: []});

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

  // Fonction pour calibrer l'orientation initiale
  const calibrateOrientation = useCallback((beta: number, gamma: number) => {
    const samples = calibrationSamples.current;
    
    samples.beta.push(beta);
    samples.gamma.push(gamma);
    
    // Garde seulement les 10 derniers échantillons
    if (samples.beta.length > 10) {
      samples.beta.shift();
      samples.gamma.shift();
    }
    
    // Calcule la moyenne pour avoir une position de référence stable
    if (samples.beta.length >= 5) {
      initialBeta.current = samples.beta.reduce((a, b) => a + b) / samples.beta.length;
      initialGamma.current = samples.gamma.reduce((a, b) => a + b) / samples.gamma.length;
    }
  }, []);

  // Device motion handler - CORRIGÉ
  const handleDeviceMotion = useCallback((event: DeviceMotionEvent) => {
    if (!sensorsEnabled) return;

    const acceleration = event.accelerationIncludingGravity;
    if (!acceleration || !acceleration.x || !acceleration.y || !acceleration.z) {
      console.log('Pas de données d\'accélération disponibles');
      return;
    }

    const now = Date.now();
    
    // Calcule l'accélération totale
    const totalAcceleration = Math.sqrt(
      acceleration.x ** 2 + 
      acceleration.y ** 2 + 
      acceleration.z ** 2
    );

    // Log de debug moins fréquent
    if (now % 3000 < 100) {
      console.log('Motion détecté:', { 
        totalAcceleration: totalAcceleration.toFixed(2), 
        x: acceleration.x.toFixed(2), 
        y: acceleration.y.toFixed(2), 
        z: acceleration.z.toFixed(2) 
      });
    }

    // Détection de secousse avec seuil ajusté
    if (totalAcceleration > SHAKE_THRESHOLD && now - lastShakeTime.current > SHAKE_DEBOUNCE) {
      console.log('Secousse détectée!', totalAcceleration.toFixed(2));
      lastShakeTime.current = now;
      toggleWalking();
      setSensorStatus(`🔄 Secousse détectée (${totalAcceleration.toFixed(1)} m/s²)`);
    }
  }, [sensorsEnabled]);

  // Device orientation handler - CORRIGÉ
  const handleDeviceOrientation = useCallback((event: DeviceOrientationEvent) => {
    if (!sensorsEnabled) return;

    const beta = event.beta; // Front/back tilt (-180 à 180)
    const gamma = event.gamma; // Left/right tilt (-90 à 90)

    if (beta === null || gamma === null) {
      console.log('Pas de données d\'orientation disponibles');
      return;
    }

    const now = Date.now();

    // Calibration initiale
    if (initialBeta.current === null || initialGamma.current === null) {
      calibrateOrientation(beta, gamma);
      return;
    }

    // Calcule les différences par rapport à la position initiale
    const deltaBeta = beta - initialBeta.current;
    const deltaGamma = gamma - initialGamma.current;

    // Log de debug moins fréquent
    if (now % 2000 < 100) {
      console.log('Orientation:', { 
        beta: beta.toFixed(1), 
        gamma: gamma.toFixed(1),
        deltaBeta: deltaBeta.toFixed(1),
        deltaGamma: deltaGamma.toFixed(1)
      });
    }

    const video = videoRef.current;
    if (!video) return;

    // Contrôle de la vitesse basé sur l'inclinaison avant/arrière
    let newSpeed = 1;
    let status = 'Vitesse normale 🚶‍♂️';

    if (deltaBeta > TILT_THRESHOLD) {
      // Penché vers l'avant - accélère
      const speedMultiplier = Math.min(2, 1 + (deltaBeta - TILT_THRESHOLD) / 30);
      newSpeed = speedMultiplier;
      status = `⚡ Accélération (${speedMultiplier.toFixed(1)}x)`;
      console.log('Penché vers l\'avant, accélération:', speedMultiplier);
    } else if (deltaBeta < -TILT_THRESHOLD) {
      // Penché vers l'arrière - ralentit
      const speedMultiplier = Math.max(0.25, 1 + deltaBeta / 30);
      newSpeed = speedMultiplier;
      status = `🐌 Ralentissement (${speedMultiplier.toFixed(1)}x)`;
      console.log('Penché vers l\'arrière, ralentissement:', speedMultiplier);
    }

    // Applique le changement de vitesse seulement si différent
    if (Math.abs(newSpeed - currentSpeed) > 0.1) {
      video.playbackRate = newSpeed;
      setCurrentSpeed(newSpeed);
      setSensorStatus(status);
    }

    // Contrôle de navigation basé sur l'inclinaison gauche/droite
    if (now - lastOrientationTime.current > ORIENTATION_DEBOUNCE) {
      if (Math.abs(deltaGamma) > ROTATION_THRESHOLD) {
        lastOrientationTime.current = now;
        
        if (deltaGamma > ROTATION_THRESHOLD) {
          // Incliné vers la droite - avance rapide
          console.log('Incliné vers la droite, avance rapide');
          const newTime = Math.min(video.duration, video.currentTime + SEEK_AMOUNT);
          video.currentTime = newTime;
          setSensorStatus(`⏩ Avance rapide (+${SEEK_AMOUNT}s)`);
        } else if (deltaGamma < -ROTATION_THRESHOLD) {
          // Incliné vers la gauche - recule
          console.log('Incliné vers la gauche, recul');
          const newTime = Math.max(0, video.currentTime - SEEK_AMOUNT);
          video.currentTime = newTime;
          setSensorStatus(`⏪ Retour rapide (-${SEEK_AMOUNT}s)`);
        }
      }
    }
  }, [sensorsEnabled, currentSpeed, calibrateOrientation]);

  // Request sensor permissions - AMÉLIORÉ
  const requestSensorPermission = async () => {
    try {
      setSensorPermission('pending');
      setSensorStatus('🔄 Demande de permission...');
      console.log('Demande de permissions capteurs...');
      
      // Vérification du type d'appareil
      const userAgent = navigator.userAgent.toLowerCase();
      const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
      const isIOS = /iphone|ipad|ipod/i.test(userAgent);
      
      console.log('Type d\'appareil:', { isMobile, isIOS, userAgent });
      
      if (!isMobile) {
        console.warn('Pas sur un appareil mobile');
        setSensorPermission('denied');
        setSensorStatus('❌ Capteurs non disponibles (utilisez un téléphone)');
        return;
      }

      let permissionGranted = false;

      // Pour iOS 13+
      if (isIOS && typeof (DeviceMotionEvent as any).requestPermission === 'function') {
        console.log('iOS détecté, demande de permissions...');
        
        try {
          const motionPermission = await (DeviceMotionEvent as any).requestPermission();
          console.log('Permission motion:', motionPermission);
          
          if (motionPermission === 'granted') {
            permissionGranted = true;
          }
        } catch (error) {
          console.error('Erreur permission motion:', error);
        }

        try {
          if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
            const orientationPermission = await (DeviceOrientationEvent as any).requestPermission();
            console.log('Permission orientation:', orientationPermission);
            
            if (orientationPermission !== 'granted') {
              permissionGranted = false;
            }
          }
        } catch (error) {
          console.error('Erreur permission orientation:', error);
        }
      } else {
        // Pour Android et versions iOS plus anciennes
        console.log('Android ou iOS ancien détecté');
        permissionGranted = true;
      }

      if (permissionGranted) {
        setSensorPermission('granted');
        enableSensors();
      } else {
        setSensorPermission('denied');
        setSensorStatus('❌ Permission refusée');
      }
    } catch (error) {
      console.error('Erreur lors de la demande de permission:', error);
      setSensorPermission('denied');
      setSensorStatus('❌ Erreur de permission');
    }
  };

  // Enable sensors - AMÉLIORÉ
  const enableSensors = () => {
    console.log('Activation des capteurs...');
    setSensorsEnabled(true);
    setSensorStatus('🔄 Initialisation des capteurs...');
    
    // Reset des valeurs de calibration
    initialBeta.current = null;
    initialGamma.current = null;
    calibrationSamples.current = {beta: [], gamma: []};
    
    // Vérification de la disponibilité des APIs
    if (typeof DeviceMotionEvent === 'undefined') {
      console.error('DeviceMotionEvent non supporté');
      setSensorStatus('❌ DeviceMotionEvent non supporté');
      return;
    }

    if (typeof DeviceOrientationEvent === 'undefined') {
      console.error('DeviceOrientationEvent non supporté');
      setSensorStatus('❌ DeviceOrientationEvent non supporté');
      return;
    }

    // Ajout des événements avec options passives
    try {
      window.addEventListener('devicemotion', handleDeviceMotion, { passive: true });
      window.addEventListener('deviceorientation', handleDeviceOrientation, { passive: true });
      
      console.log('Event listeners ajoutés');
      setSensorStatus('🔄 Calibration en cours...');
      
      // Test de fonctionnement après un délai
      setTimeout(() => {
        if (initialBeta.current !== null && initialGamma.current !== null) {
          setSensorStatus('✅ Capteurs actifs - Bougez votre téléphone !');
        } else {
          setSensorStatus('⚠️ Capteurs activés - En attente de mouvement...');
        }
      }, 2000);
      
    } catch (error) {
      console.error('Erreur lors de l\'ajout des event listeners:', error);
      setSensorStatus('❌ Erreur d\'activation');
    }
  };

  // Disable sensors
  const disableSensors = () => {
    console.log('Désactivation des capteurs...');
    setSensorsEnabled(false);
    setSensorStatus('⏸️ Capteurs désactivés');
    
    try {
      window.removeEventListener('devicemotion', handleDeviceMotion);
      window.removeEventListener('deviceorientation', handleDeviceOrientation);
    } catch (error) {
      console.error('Erreur lors de la suppression des event listeners:', error);
    }
    
    // Reset des valeurs
    initialBeta.current = null;
    initialGamma.current = null;
    calibrationSamples.current = {beta: [], gamma: []};
    
    // Reset de la vitesse vidéo
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
  const toggleWalking = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isWalking) {
      video.pause();
      setIsWalking(false);
    } else {
      video.play().catch(error => {
        console.error('Erreur lors de la lecture:', error);
      });
      setIsWalking(true);
    }
  }, [isWalking]);

  const restartVideo = () => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = 0;
    setCurrentTime(0);
    setIsWalking(false);
    
    // Reset la calibration
    initialBeta.current = null;
    initialGamma.current = null;
    calibrationSamples.current = {beta: [], gamma: []};
    
    if (sensorsEnabled) {
      setSensorStatus('🔄 Recalibration...');
    }
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
            <div className="absolute top-12 left-1/2 -translate-x-1/2 z-10 bg-blue-50/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-md border border-blue-200 max-w-xs">
              <div className="flex items-center space-x-2 text-xs">
                <Activity className="w-3 h-3 text-blue-600 flex-shrink-0" />
                <span className="text-blue-800 truncate">{sensorStatus}</span>
                {sensorsEnabled && currentSpeed !== 1 && (
                  <div className="flex items-center space-x-1 flex-shrink-0">
                    <span className="text-blue-600">{getSpeedIcon(currentSpeed)}</span>
                    <span className="text-blue-700">{currentSpeed.toFixed(1)}x</span>
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
                        <span>{getSpeedIcon(currentSpeed)} {currentSpeed.toFixed(1)}x</span>
                      </div>
                    </div>

                    {/* Sensor controls */}
                    <div className="space-y-3">
                      {!sensorsEnabled ? (
                        <button
                          onClick={requestSensorPermission}
                          disabled={sensorPermission === 'pending'}
                          className="w-full button-primary text-white px-4 py-3 rounded-xl font-medium flex items-center justify-center space-x-2 disabled:opacity-50"
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
                              <p><strong>Instructions améliorées :</strong></p>
                              <p>• Penchez vers l'avant pour accélérer ⚡ (Plus sensible)</p>
                              <p>• Penchez vers l'arrière pour ralentir 🐌</p>
                              <p>• Inclinez à gauche/droite pour naviguer ⏪⏩ (±3s)</p>
                              <p>• Secouez pour pause/lecture 🔄 (Plus réactif)</p>
                              <p>• <strong>Calibration automatique</strong> au démarrage</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {sensorPermission === 'denied' && (
                        <div className="bg-red-50 rounded-xl p-3 text-xs text-red-800">
                          <div className="flex items-start space-x-2">
                            <AlertTriangle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                            <div>
                              <p><strong>Permission refusée</strong></p>
                              <p>• Rechargez la page et réessayez</p>
                              <p>• Vérifiez les paramètres de votre navigateur</p>
                              <p>• Utilisez un téléphone (pas un ordinateur)</p>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* Debug info pour développement */}
                      {sensorsEnabled && import.meta.env.NODE_ENV === 'development' && (
                        <div className="bg-gray-50 rounded-xl p-3 text-xs text-gray-600">
                          <div className="space-y-1">
                            <p><strong>Debug Info:</strong></p>
                            <p>Initial Beta: {initialBeta.current?.toFixed(1) || 'Non calibré'}</p>
                            <p>Initial Gamma: {initialGamma.current?.toFixed(1) || 'Non calibré'}</p>
                            <p>Vitesse actuelle: {currentSpeed.toFixed(2)}x</p>
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