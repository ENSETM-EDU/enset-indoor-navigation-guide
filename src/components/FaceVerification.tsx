import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Camera, User, CheckCircle } from 'lucide-react';
import { checkCameraPermission, createCameraConstraints, CameraPermissionStatus } from '../utils/cameraUtils';
import CameraDiagnostic from './CameraDiagnostic';

interface UserInfo {
  nom: string;
  prenom: string;
  cin: string;
  fonction: string;
}

interface FaceVerificationProps {
  userInfo: UserInfo | null;
  onVerificationComplete: () => void;
}

const FaceVerification: React.FC<FaceVerificationProps> = ({ userInfo, onVerificationComplete }) => {
  const [isVerifying, setIsVerifying] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [showDiagnostic, setShowDiagnostic] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startCamera = async () => {
    setCameraError(null);
    
    try {
      // Check camera permission first
      const permissionStatus: CameraPermissionStatus = await checkCameraPermission();
      
      if (!permissionStatus.isSupported) {
        throw new Error('getUserMedia not supported');
      }
      
      if (!permissionStatus.hasPermission && permissionStatus.error) {
        setCameraError(permissionStatus.error);
        alert(permissionStatus.error);
        return;
      }

      // Get camera constraints for front camera (selfie)
      const constraints = createCameraConstraints('user', { width: 640, height: 480 });
      
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      
      setStream(mediaStream);
      setShowCamera(true);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        
        // Wait for video to be ready
        videoRef.current.addEventListener('loadedmetadata', () => {
          if (videoRef.current) {
            videoRef.current.play().catch(err => {
              console.error('Error playing video:', err);
              setCameraError('Erreur lors de la lecture de la vidéo.');
            });
          }
        });
      }
    } catch (error) {
      console.error('Camera access error:', error);
      let errorMessage = 'Impossible d\'accéder à la caméra.';
      
      if (error instanceof Error) {
        if (error.name === 'NotAllowedError') {
          errorMessage = 'Accès à la caméra refusé. Veuillez autoriser l\'accès à la caméra dans les paramètres de votre navigateur.';
        } else if (error.name === 'NotFoundError') {
          errorMessage = 'Aucune caméra trouvée sur cet appareil.';
        } else if (error.name === 'NotSupportedError' || error.message === 'getUserMedia not supported') {
          errorMessage = 'Votre navigateur ne supporte pas l\'accès à la caméra.';
        } else if (error.name === 'OverconstrainedError') {
          errorMessage = 'La caméra ne peut pas satisfaire les contraintes demandées.';
        }
      }
      
      setCameraError(errorMessage);
      alert(errorMessage);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setShowCamera(false);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Check if video is ready and playing
      if (video.readyState !== 4) { // HAVE_ENOUGH_DATA
        alert('La vidéo n\'est pas encore prête. Veuillez attendre un moment.');
        return;
      }
      
      const context = canvas.getContext('2d');
      
      if (context) {
        // Set canvas dimensions to match video
        canvas.width = video.videoWidth || video.offsetWidth;
        canvas.height = video.videoHeight || video.offsetHeight;
        
        // Draw the current frame (flip horizontally for selfie)
        context.scale(-1, 1);
        context.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
        
        const imageData = canvas.toDataURL('image/jpeg', 0.8);
        setCapturedImage(imageData);
        stopCamera();
        performFaceVerification(imageData);
      }
    }
  };

  const performFaceVerification = (_imageData: string) => {
    setIsVerifying(true);
    
    // Simulate face verification process
    // In a real implementation, this would involve:
    // 1. Face detection in the captured image
    // 2. Face comparison with the ID card photo
    // 3. Similarity score calculation
    
    setTimeout(() => {
      setIsVerifying(false);
      setIsVerified(true);
      
      setTimeout(() => {
        onVerificationComplete();
      }, 2000);
    }, 3000);
  };

  const handleFaceCapture = () => {
    startCamera();
  };

  if (isVerified) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center bg-white rounded-2xl shadow-xl p-8"
      >
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Vérification Réussie!</h2>
        <p className="text-gray-600 mb-4">Votre identité a été confirmée avec succès.</p>
        
        {userInfo && (
          <div className="bg-green-50 rounded-lg p-4 mb-6">
            <p className="text-green-800 font-medium">
              Bienvenue, {userInfo.prenom} {userInfo.nom}
            </p>
            <p className="text-green-600 text-sm">
              {userInfo.fonction} - CIN: {userInfo.cin}
            </p>
          </div>
        )}
        
        <p className="text-sm text-gray-500">Redirection vers l'interface de vote...</p>
      </motion.div>
    );
  }

  if (isVerifying) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center bg-white rounded-2xl shadow-xl p-8"
      >
        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <User className="h-10 w-10 text-blue-600 animate-pulse" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Vérification en cours...</h2>
        <p className="text-gray-600 mb-8">Comparaison de votre visage avec la photo de la carte d'identité</p>
        
        <div className="flex justify-center mb-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
        
        {capturedImage && (
          <div className="flex justify-center space-x-8 items-center">
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-2">Photo de la carte</p>
              <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center">
                <User className="h-8 w-8 text-gray-400" />
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-2">Photo capturée</p>
              <img 
                src={capturedImage} 
                alt="Visage capturé" 
                className="w-24 h-24 rounded-lg object-cover"
              />
            </div>
          </div>
        )}
      </motion.div>
    );
  }

  if (showCamera) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white rounded-2xl shadow-xl p-8"
      >
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Capturer votre Visage</h2>
          <p className="text-gray-600">Positionnez votre visage dans le cadre et appuyez sur capturer</p>
        </div>

        <div className="relative mb-6">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full max-w-md mx-auto rounded-lg shadow-md transform scale-x-[-1]"
            onLoadedMetadata={() => {
              console.log('Video metadata loaded');
            }}
            onError={(e) => {
              console.error('Video error:', e);
              alert('Erreur lors du chargement de la vidéo.');
            }}
          />
          <canvas ref={canvasRef} className="hidden" />
          
          {/* Face detection overlay for better UX */}
          <div className="absolute inset-0 border-2 border-dashed border-purple-400 rounded-lg pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-60 border-2 border-purple-500 rounded-full pointer-events-none opacity-50" />
        </div>

        <div className="flex justify-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={captureImage}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-medium transition-colors duration-200"
          >
            Capturer
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={stopCamera}
            className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-xl font-medium transition-colors duration-200"
          >
            Annuler
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-2xl shadow-xl p-8"
    >
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <User className="h-10 w-10 text-purple-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Vérification Faciale</h2>
        <p className="text-gray-600">
          Veuillez positionner votre visage devant la caméra pour vérifier votre identité
        </p>
      </div>

      {userInfo && (
        <div className="bg-blue-50 rounded-lg p-4 mb-8">
          <h3 className="font-medium text-blue-900 mb-2">Informations extraites de votre carte:</h3>
          <div className="space-y-1 text-sm text-blue-800">
            <p><strong>Nom:</strong> {userInfo.nom}</p>
            <p><strong>Prénom:</strong> {userInfo.prenom}</p>
            <p><strong>CIN:</strong> {userInfo.cin}</p>
            <p><strong>Fonction:</strong> {userInfo.fonction}</p>
          </div>
        </div>
      )}

      <div className="text-center">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleFaceCapture}
          className="inline-flex items-center space-x-3 bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-xl font-medium transition-colors duration-200"
        >
          <Camera className="h-5 w-5" />
          <span>Capturer mon visage</span>
        </motion.button>
      </div>

      <div className="mt-8 p-4 bg-purple-50 rounded-lg">
        <p className="text-sm text-purple-800">
          <strong>Note:</strong> Assurez-vous d'être dans un endroit bien éclairé et regardez directement la caméra.
        </p>
      </div>

      {cameraError && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-800">
                <strong>Erreur caméra:</strong> {cameraError}
              </p>
            </div>
            <button
              onClick={() => setShowDiagnostic(true)}
              className="text-red-600 hover:text-red-800 text-sm font-medium underline ml-4"
            >
              Diagnostic
            </button>
          </div>
        </div>
      )}

      {showDiagnostic && (
        <CameraDiagnostic onClose={() => setShowDiagnostic(false)} />
      )}
    </motion.div>
  );
};

export default FaceVerification;
