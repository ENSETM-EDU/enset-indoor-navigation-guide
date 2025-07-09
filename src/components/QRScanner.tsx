import React, { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner, Html5Qrcode } from 'html5-qrcode';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Camera, AlertCircle, CheckCircle, Upload, SwitchCamera } from 'lucide-react';

interface QRScannerProps {
  onScanSuccess: () => void;
}

const QRScanner: React.FC<QRScannerProps> = ({ onScanSuccess }) => {
  const navigate = useNavigate();
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const [error, setError] = useState<string>('');
  const [scanning, setScanning] = useState(false);
  const [success, setSuccess] = useState(false);
  const [useFrontCamera, setUseFrontCamera] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSuccessfulScan = (decodedText: string) => {
    setSuccess(true);
    setScanning(false);
    
    try {
      const url = new URL(decodedText);
      const pathParts = url.pathname.split('/');
      
      if (pathParts.includes('navigate') && pathParts.length >= 3) {
        const id = pathParts[pathParts.indexOf('navigate') + 1];
        setTimeout(() => {
          navigate(`/navigate/${id}`);
          onScanSuccess();
        }, 1000);
      } else {
        setError('QR Code invalide. Veuillez utiliser un QR Code de navigation ENSET.');
        setSuccess(false);
      }
    } catch (e) {
      setError('Format de QR Code non reconnu.');
      setSuccess(false);
    }
  };

  const startScanner = async () => {
    try {
      // Vérifier d'abord si on a accès à la caméra
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: useFrontCamera ? 'user' : 'environment' 
        } 
      });
      stream.getTracks().forEach(track => track.stop()); // Libérer le stream

      if (scannerRef.current) {
        scannerRef.current.clear();
      }

      const scanner = new Html5QrcodeScanner(
        'qr-reader',
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          aspectRatio: 1.0,
          disableFlip: false,
          videoConstraints: {
            facingMode: useFrontCamera ? 'user' : 'environment'
          }
        },
        false
      );

      scanner.render(
        handleSuccessfulScan,
        (error) => {
          console.warn('QR Code scan error:', error);
          setError('Erreur lors du scan. Veuillez réessayer.');
        }
      );

      scannerRef.current = scanner;
      setScanning(true);
      setError(''); // Effacer les erreurs précédentes
    } catch (error) {
      console.error('Camera access error:', error);
      setError('Impossible d\'accéder à la caméra. Veuillez vérifier les permissions.');
      setScanning(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const html5QrcodeFile = new Html5Qrcode("qr-reader");
      const result = await html5QrcodeFile.scanFile(file, true);
      handleSuccessfulScan(result);
    } catch (error) {
      setError('Impossible de lire le QR code dans l\'image.');
      setSuccess(false);
    }
  };

  const toggleCamera = () => {
    setUseFrontCamera(!useFrontCamera);
    if (scanning) {
      if (scannerRef.current) {
        scannerRef.current.clear();
      }
      startScanner();
    }
  };

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear();
      }
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="max-w-md mx-auto"
    >
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-gray-200/50 shadow-xl">
        <div className="text-center mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-900 to-blue-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
            {success ? (
              <CheckCircle className="w-8 h-8 text-green-400" />
            ) : (
              <Camera className="w-8 h-8 text-white" />
            )}
          </div>
          <h3 className="text-xl font-semibold text-gray-900">
            {success ? 'QR Code Scanné!' : 'Scanner QR Code'}
          </h3>
          <p className="text-gray-600 text-sm mt-2">
            {success 
              ? 'Redirection en cours...' 
              : scanning 
                ? 'Positionnez le QR Code dans le cadre'
                : 'Choisissez une méthode de scan'
            }
          </p>
        </div>

        {!scanning && !success && (
          <div className="flex flex-col gap-4">
            <button
              onClick={startScanner}
              className="w-full py-3 px-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <Camera className="w-5 h-5" />
              Utiliser la caméra
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-3 px-4 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
            >
              <Upload className="w-5 h-5" />
              Télécharger une image
            </button>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              ref={fileInputRef}
              className="hidden"
            />
          </div>
        )}

        {scanning && !success && (
          <div className="qr-scanner-container relative">
            <div id="qr-reader" className="w-full"></div>
            <button
              onClick={toggleCamera}
              className="absolute top-2 right-2 p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
            >
              <SwitchCamera className="w-6 h-6 text-gray-700" />
            </button>
          </div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-8"
          >
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <p className="text-green-600 font-medium">Navigation activée!</p>
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-4 bg-red-50 rounded-2xl border border-red-200"
          >
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          </motion.div>
        )}

        {scanning && (
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              Assurez-vous que votre caméra est activée et que le QR Code est bien éclairé
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default QRScanner;