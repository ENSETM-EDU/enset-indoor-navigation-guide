import React, { useEffect, useRef, useState } from 'react';
import QrScanner from 'qr-scanner';
import { motion } from 'framer-motion';
import { Camera, AlertCircle, CheckCircle } from 'lucide-react';

interface QRScannerProps {
  onScanSuccess?: () => void;
}

const QRScanner: React.FC<QRScannerProps> = ({ onScanSuccess }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const qrScannerRef = useRef<QrScanner | null>(null);
  const [error, setError] = useState<string>('');
  const [scanning, setScanning] = useState(true);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const initializeScanner = async () => {
      if (!videoRef.current) return;

      try {
        const qrScanner = new QrScanner(
          videoRef.current,
          (result) => {
            setSuccess(true);
            setScanning(false);
            
            setTimeout(() => {
              try {
                // Si c'est une URL, rediriger dans la même page
                if (result.data.startsWith('http://') || result.data.startsWith('https://')) {
                  window.location.href = result.data;
                } else {
                  // Sinon, traiter comme texte ou rechercher en ligne
                  window.location.href = `https://www.google.com/search?q=${encodeURIComponent(result.data)}`;
                }
                onScanSuccess?.();
              } catch (e) {
                console.error('Erreur lors de la redirection:', e);
              }
            }, 1000);
          },
          {
            highlightScanRegion: true,
            highlightCodeOutline: true,
            preferredCamera: 'environment', // Caméra arrière par défaut
          }
        );

        qrScannerRef.current = qrScanner;
        await qrScanner.start();
        
      } catch (error) {
        console.error('Erreur d\'initialisation du scanner:', error);
        setError('Impossible d\'accéder à la caméra. Vérifiez les permissions.');
      }
    };

    initializeScanner();

    return () => {
      if (qrScannerRef.current) {
        qrScannerRef.current.stop();
        qrScannerRef.current.destroy();
      }
    };
  }, [onScanSuccess]);

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
              : 'Positionnez le QR Code dans le cadre'
            }
          </p>
        </div>

        {scanning && !success && (
          <div className="qr-scanner-container relative">
            <video 
              ref={videoRef}
              className="w-full h-64 object-cover rounded-2xl"
              style={{ transform: 'scaleX(-1)' }}
            />
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
            <p className="text-green-600 font-medium">QR Code scanné avec succès!</p>
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