import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Camera, User, CheckCircle } from 'lucide-react';

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
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user' // Use front camera for selfie
        }
      });
      
      setStream(mediaStream);
      setShowCamera(true);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (error) {
      console.error('Camera access error:', error);
      alert('Impossible d\'accéder à la caméra. Veuillez vérifier les permissions.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setShowCamera(false);
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0);
        
        const imageData = canvas.toDataURL('image/jpeg', 0.8);
        setCapturedImage(imageData);
        stopCamera();
        performFaceVerification(imageData);
      }
    }
  };

  const performFaceVerification = (imageData: string) => {
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
            className="w-full max-w-md mx-auto rounded-lg shadow-md transform scale-x-[-1]"
          />
          <canvas ref={canvasRef} className="hidden" />
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
    </motion.div>
  );
};

export default FaceVerification;
