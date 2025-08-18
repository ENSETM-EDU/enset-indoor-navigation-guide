import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Camera, Upload, FileText, RefreshCw } from 'lucide-react';
import Tesseract from 'tesseract.js';

interface UserInfo {
  nom: string;
  prenom: string;
  cin: string;
  fonction: string;
}

interface IDCardScannerProps {
  onScanComplete: (info: UserInfo) => void;
}

const IDCardScanner: React.FC<IDCardScannerProps> = ({ onScanComplete }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [ocrProgress, setOcrProgress] = useState(0);
  const [scannedImage, setScannedImage] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const extractUserInfoFromText = (text: string): UserInfo => {
    // Clean the text
    const cleanText = text.replace(/[^\w\s]/gi, ' ').replace(/\s+/g, ' ').trim();
    const lines = cleanText.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    
    // Default values
    let nom = '';
    let prenom = '';
    let cin = '';
    let fonction = 'Employé';

    // Look for patterns in the text
    const textUpper = cleanText.toUpperCase();
    
    // Try to extract CIN (various formats)
    const cinPatterns = [
      /\b[A-Z]{1,2}\d{6}\b/g,
      /\b\d{8}\b/g,
      /\bCIN[\s:]*([A-Z0-9]+)/gi,
      /\bCARTE[\s:]*([A-Z0-9]+)/gi
    ];
    
    for (const pattern of cinPatterns) {
      const match = textUpper.match(pattern);
      if (match) {
        cin = match[0].replace(/CIN|CARTE/gi, '').trim();
        break;
      }
    }
    
    // Extract names - look for common patterns
    const nameLines = lines.filter(line => {
      const lineUpper = line.toUpperCase();
      return lineUpper.length > 2 && 
             !lineUpper.includes('CARTE') &&
             !lineUpper.includes('IDENTITE') &&
             !lineUpper.includes('NATIONALE') &&
             !lineUpper.includes('MAROC') &&
             !/\d/.test(line) && // No numbers
             line.split(' ').length <= 3; // Not too many words
    });
    
    if (nameLines.length >= 2) {
      nom = nameLines[0].trim();
      prenom = nameLines[1].trim();
    } else if (nameLines.length === 1) {
      const words = nameLines[0].split(' ');
      if (words.length >= 2) {
        nom = words[0];
        prenom = words[1];
      } else {
        nom = words[0];
        prenom = '';
      }
    }
    
    // If we couldn't extract names, use fallback
    if (!nom && !prenom) {
      nom = 'UTILISATEUR';
      prenom = 'Inconnu';
    }
    
    // If no CIN found, generate one
    if (!cin) {
      cin = 'ID' + Math.random().toString(36).substr(2, 6).toUpperCase();
    }

    return { nom, prenom, cin, fonction };
  };

  const performOCR = async (imageData: string) => {
    setIsScanning(true);
    setOcrProgress(0);
    
    try {
      const result = await Tesseract.recognize(
        imageData,
        'eng+fra+ara', // English, French, and Arabic
        {
          logger: (m) => {
            if (m.status === 'recognizing text') {
              setOcrProgress(Math.round(m.progress * 100));
            }
          }
        }
      );
      
      const extractedText = result.data.text;
      console.log('OCR Result:', extractedText);
      
      const userInfo = extractUserInfoFromText(extractedText);
      setIsScanning(false);
      onScanComplete(userInfo);
      
    } catch (error) {
      console.error('OCR Error:', error);
      setIsScanning(false);
      
      // Fallback to mock data if OCR fails
      const fallbackInfo: UserInfo = {
        nom: 'ERREUR_OCR',
        prenom: 'Utilisateur',
        cin: 'ERR' + Math.random().toString(36).substr(2, 5).toUpperCase(),
        fonction: 'Employé'
      };
      onScanComplete(fallbackInfo);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target?.result as string;
        setScannedImage(imageData);
        performOCR(imageData);
      };
      reader.readAsDataURL(file);
    }
  };

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'environment' // Use back camera if available
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
        setScannedImage(imageData);
        stopCamera();
        performOCR(imageData);
      }
    }
  };

  if (isScanning) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center bg-white rounded-2xl shadow-xl p-8"
      >
        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <FileText className="h-10 w-10 text-blue-600 animate-pulse" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Analyse OCR en cours...</h2>
        <p className="text-gray-600 mb-8">Extraction des informations de votre carte d'identité</p>
        
        {scannedImage && (
          <div className="mb-6">
            <img 
              src={scannedImage} 
              alt="Carte scannée" 
              className="max-w-sm mx-auto rounded-lg shadow-md"
            />
          </div>
        )}
        
        <div className="mb-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${ocrProgress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-500 mt-2">{ocrProgress}% terminé</p>
        </div>
        
        <div className="flex justify-center">
          <RefreshCw className="h-6 w-6 text-blue-600 animate-spin" />
        </div>
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
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Capturer votre Carte d'Identité</h2>
          <p className="text-gray-600">Positionnez votre carte d'identité dans le cadre et appuyez sur capturer</p>
        </div>

        <div className="relative mb-6">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full max-w-md mx-auto rounded-lg shadow-md"
          />
          <canvas ref={canvasRef} className="hidden" />
        </div>

        <div className="flex justify-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={captureImage}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-colors duration-200"
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
        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Camera className="h-10 w-10 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Scanner votre Carte d'Identité</h2>
        <p className="text-gray-600">
          Veuillez scanner ou photographier votre carte d'identité pour extraire vos informations
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Camera option */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={startCamera}
          className="flex flex-col items-center p-6 border-2 border-dashed border-blue-300 rounded-xl hover:border-blue-500 transition-colors duration-200"
        >
          <Camera className="h-12 w-12 text-blue-600 mb-4" />
          <span className="font-medium text-gray-900">Prendre une photo</span>
          <span className="text-sm text-gray-500 mt-2">Utiliser la caméra</span>
        </motion.button>

        {/* Upload option */}
        <motion.label
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex flex-col items-center p-6 border-2 border-dashed border-blue-300 rounded-xl hover:border-blue-500 transition-colors duration-200 cursor-pointer"
        >
          <Upload className="h-12 w-12 text-blue-600 mb-4" />
          <span className="font-medium text-gray-900">Télécharger une image</span>
          <span className="text-sm text-gray-500 mt-2">Formats: JPG, PNG</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </motion.label>
      </div>

      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> Assurez-vous que votre carte d'identité est bien éclairée et lisible pour un meilleur résultat OCR.
        </p>
      </div>
    </motion.div>
  );
};

export default IDCardScanner;
