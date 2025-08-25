import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Camera, CheckCircle, XCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { checkCameraSupport, checkCameraPermission, getCameraDevices } from '../utils/cameraUtils';

interface DiagnosticResult {
  name: string;
  status: 'success' | 'error' | 'warning';
  message: string;
}

const CameraDiagnostic: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<DiagnosticResult[]>([]);
  const [currentTest, setCurrentTest] = useState<string>('');

  const runDiagnostics = async () => {
    setIsRunning(true);
    setResults([]);
    
    const diagnosticResults: DiagnosticResult[] = [];
    
    // Test 1: Browser support
    setCurrentTest('Vérification du support navigateur...');
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const isSupported = checkCameraSupport();
    diagnosticResults.push({
      name: 'Support Navigateur',
      status: isSupported ? 'success' : 'error',
      message: isSupported 
        ? 'Votre navigateur supporte l\'accès à la caméra' 
        : 'Votre navigateur ne supporte pas l\'accès à la caméra'
    });
    setResults([...diagnosticResults]);

    if (!isSupported) {
      setIsRunning(false);
      setCurrentTest('');
      return;
    }

    // Test 2: Camera permissions
    setCurrentTest('Vérification des permissions...');
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
      const permissionStatus = await checkCameraPermission();
      diagnosticResults.push({
        name: 'Permissions Caméra',
        status: permissionStatus.hasPermission ? 'success' : 'error',
        message: permissionStatus.hasPermission 
          ? 'Permissions accordées' 
          : permissionStatus.error || 'Permissions refusées'
      });
    } catch (error) {
      diagnosticResults.push({
        name: 'Permissions Caméra',
        status: 'error',
        message: 'Erreur lors de la vérification des permissions'
      });
    }
    setResults([...diagnosticResults]);

    // Test 3: Available cameras
    setCurrentTest('Détection des caméras...');
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
      const devices = await getCameraDevices();
      diagnosticResults.push({
        name: 'Caméras Disponibles',
        status: devices.length > 0 ? 'success' : 'warning',
        message: devices.length > 0 
          ? `${devices.length} caméra(s) détectée(s)` 
          : 'Aucune caméra détectée'
      });
    } catch (error) {
      diagnosticResults.push({
        name: 'Caméras Disponibles',
        status: 'error',
        message: 'Erreur lors de la détection des caméras'
      });
    }
    setResults([...diagnosticResults]);

    // Test 4: HTTPS check
    setCurrentTest('Vérification HTTPS...');
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const isHTTPS = window.location.protocol === 'https:' || window.location.hostname === 'localhost';
    diagnosticResults.push({
      name: 'Connexion Sécurisée',
      status: isHTTPS ? 'success' : 'warning',
      message: isHTTPS 
        ? 'Connexion sécurisée (HTTPS)' 
        : 'Connexion non sécurisée - utilisez HTTPS pour de meilleures performances'
    });

    setResults([...diagnosticResults]);
    setIsRunning(false);
    setCurrentTest('');
  };

  useEffect(() => {
    runDiagnostics();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full max-h-[80vh] overflow-y-auto"
      >
        <div className="text-center mb-6">
          <Camera className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Diagnostic Caméra</h2>
          <p className="text-gray-600">Vérification de la configuration de votre caméra</p>
        </div>

        {isRunning && (
          <div className="text-center mb-6">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <RefreshCw className="h-6 w-6 text-blue-600 animate-spin" />
              <span className="text-blue-600 font-medium">En cours...</span>
            </div>
            <p className="text-gray-600 text-sm">{currentTest}</p>
          </div>
        )}

        <div className="space-y-4 mb-6">
          {results.map((result, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-lg border ${getStatusColor(result.status)}`}
            >
              <div className="flex items-center space-x-3">
                {getStatusIcon(result.status)}
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{result.name}</h3>
                  <p className="text-sm text-gray-600">{result.message}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {!isRunning && results.length > 0 && (
          <div className="space-y-4">
            <div className="flex space-x-3">
              <button
                onClick={runDiagnostics}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
              >
                Relancer le test
              </button>
              
              <button
                onClick={onClose}
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
              >
                Fermer
              </button>
            </div>

            {results.some(r => r.status === 'error') && (
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Problèmes détectés ?</strong> Consultez notre guide de dépannage pour résoudre ces problèmes.
                </p>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default CameraDiagnostic;
