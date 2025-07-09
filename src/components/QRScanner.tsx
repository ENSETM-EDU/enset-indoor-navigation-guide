import React, { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Camera, AlertCircle, CheckCircle } from 'lucide-react';

interface QRScannerProps {
  onScanSuccess: () => void;
}

const QRScanner: React.FC<QRScannerProps> = ({ onScanSuccess }) => {
  const navigate = useNavigate();
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const [error, setError] = useState<string>('');
  const [scanning, setScanning] = useState(true);
  const [success, setSuccess] = useState(false);
  const [permissionRequested, setPermissionRequested] = useState(false);

  useEffect(() => {
    const initializeScanner = async () => {
      try {
        // Demander la permission de caméra explicitement
        if (!permissionRequested) {
          setPermissionRequested(true);
        }
        
        const scanner = new Html5QrcodeScanner(
          'qr-reader',
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1.0,
            disableFlip: false,
            // Configuration pour utiliser directement la caméra arrière
            videoConstraints: {
              facingMode: "environment" // Force l'utilisation de la caméra arrière
            },
            // Éviter de montrer le sélecteur de caméra
            showTorchButtonIfSupported: true,
            formatsToSupport: [0] // QR Code uniquement
          },
          false
        );

        scanner.render(
          (decodedText) => {
            setSuccess(true);
            setScanning(false);
            
            // Analyser l'URL scannée
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
          },
          (error) => {
            console.warn('QR Code scan error:', error);
            // Gérer les erreurs de permission de caméra
            if (error.includes('Permission') || error.includes('NotAllowedError')) {
              setError('Permission de caméra refusée. Veuillez autoriser l\'accès à la caméra dans les paramètres de votre navigateur.');
            }
          }
        );

        scannerRef.current = scanner;
      } catch (error) {
        console.error('Erreur d\'initialisation du scanner:', error);
        setError('Impossible d\'accéder à la caméra. Vérifiez les permissions.');
      }
    };

    initializeScanner();

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear();
      }
    };
  }, [navigate, onScanSuccess, permissionRequested]);

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
              : !permissionRequested
                ? 'Autorisation de caméra nécessaire'
                : 'Positionnez le QR Code dans le cadre'
            }
          </p>
        </div>

        {scanning && !success && (
          <div className="qr-scanner-container">
            <div id="qr-reader" className="w-full"></div>
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

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Assurez-vous que votre caméra est activée et que le QR Code est bien éclairé
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default QRScanner;