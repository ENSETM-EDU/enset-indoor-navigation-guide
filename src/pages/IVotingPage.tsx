import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, User, Vote, CheckCircle, CreditCard, Eye } from 'lucide-react';

interface UserInfo {
  nom: string;
  prenom: string;
  cin: string;
  fonction: string;
}

interface VoteChoice {
  conseil: string;
  categorie: string;
  candidat: string;
}

const IVotingPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<'scan' | 'info' | 'faceVerify' | 'councilSelect' | 'categorySelect' | 'candidateSelect' | 'complete'>('scan');
  const [isScanning, setIsScanning] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [selectedCouncil, setSelectedCouncil] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [voteChoices, setVoteChoices] = useState<VoteChoice[]>([]);
  const [userInfo] = useState<UserInfo>({
    nom: 'REBBANI',
    prenom: 'AHMED',
    cin: 'Z147954',
    fonction: 'Professeur d\'Enseignement Supérieur'
  });

  // Configuration des conseils et catégories
  const conseils = [
    { id: 'etablissement', label: 'Conseil d\'Établissement' },
    { id: 'universite', label: 'Conseil d\'Université' }
  ];

  const categories = [
    { id: 'MC', label: 'Maître de Conférences (MC)' },
    { id: 'MCH', label: 'Maître de Conférences Habilité (MCH)' },
    { id: 'PES', label: 'Professeur d\'Enseignement Supérieur (PES)' }
  ];

  const candidats = [
    'XXXXX',
    'YYYYY', 
    'ZZZZZZ'
  ];

  // Simulation du scan de carte CIN
  const startCardScan = () => {
    setIsScanning(true);
    setScanProgress(0);
    
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          setTimeout(() => setCurrentStep('info'), 500);
          return 100;
        }
        return prev + 2;
      });
    }, 50);
  };

  // Simulation de la vérification faciale
  const startFaceVerification = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setCurrentStep('councilSelect');
    }, 3000);
  };

  // Gestion de la sélection du conseil
  const handleCouncilSelection = (councilId: string) => {
    setSelectedCouncil(councilId);
    setCurrentStep('categorySelect');
  };

  // Gestion de la sélection de catégorie
  const handleCategorySelection = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setCurrentStep('candidateSelect');
  };

  // Gestion de la sélection de candidat
  const handleCandidateSelection = (candidat: string) => {
    const newChoice: VoteChoice = {
      conseil: selectedCouncil,
      categorie: selectedCategory,
      candidat: candidat
    };
    setVoteChoices([...voteChoices, newChoice]);
    setCurrentStep('complete');
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'scan':
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center bg-white rounded-2xl shadow-xl p-8 max-w-md mx-auto"
          >
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CreditCard className="h-12 w-12 text-blue-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Scanner votre Carte CIN</h3>
            <p className="text-gray-600 mb-6">Placez votre carte d'identité devant la caméra</p>
            
            {isScanning ? (
              <div className="space-y-4">
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <motion.div
                    className="bg-blue-600 h-3 rounded-full"
                    style={{ width: `${scanProgress}%` }}
                    transition={{ duration: 0.1 }}
                  />
                </div>
                <p className="text-sm text-blue-600">Scan en cours... {scanProgress}%</p>
                <div className="flex justify-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full"
                  />
                </div>
              </div>
            ) : (
              <button
                onClick={startCardScan}
                className="w-full bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors"
              >
                Commencer le Scan
              </button>
            )}
          </motion.div>
        );

      case 'info':
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-auto"
          >
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">Informations Vérifiées</h3>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between">
                <span className="font-semibold text-gray-700">Nom:</span>
                <span className="text-gray-900">{userInfo.nom}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-gray-700">Prénom:</span>
                <span className="text-gray-900">{userInfo.prenom}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-gray-700">CIN:</span>
                <span className="text-gray-900">{userInfo.cin}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-gray-700">Statut:</span>
                <span className="text-gray-900">{userInfo.fonction}</span>
              </div>
            </div>
            
            <button
              onClick={() => setCurrentStep('faceVerify')}
              className="w-full bg-green-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-green-700 transition-colors"
            >
              Continuer vers la Vérification Faciale
            </button>
          </motion.div>
        );

      case 'faceVerify':
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center bg-white rounded-2xl shadow-xl p-8 max-w-md mx-auto"
          >
            <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Eye className="h-12 w-12 text-purple-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Vérification Faciale</h3>
            <p className="text-gray-600 mb-6">Regardez directement la caméra pour la vérification</p>
            
            {isVerifying ? (
              <div className="space-y-4">
                <div className="flex justify-center">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-32 h-32 border-4 border-purple-600 rounded-full flex items-center justify-center"
                  >
                    <User className="h-16 w-16 text-purple-600" />
                  </motion.div>
                </div>
                <p className="text-sm text-purple-600">Vérification en cours...</p>
                <div className="flex justify-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full"
                  />
                </div>
              </div>
            ) : (
              <button
                onClick={startFaceVerification}
                className="w-full bg-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-purple-700 transition-colors"
              >
                Commencer la Vérification
              </button>
            )}
          </motion.div>
        );

      case 'councilSelect':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-auto"
          >
            <div className="text-center mb-8">
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Vote className="h-12 w-12 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Sélection du Conseil</h3>
              <p className="text-gray-600">Choisissez le conseil pour lequel vous souhaitez voter</p>
            </div>

            <div className="grid grid-cols-1 gap-4 mb-8">
              {conseils.map((conseil) => (
                <motion.button
                  key={conseil.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleCouncilSelection(conseil.id)}
                  className="p-6 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all duration-200"
                >
                  <div className="text-lg font-semibold text-gray-900">{conseil.label}</div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        );

      case 'categorySelect':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-auto"
          >
            <div className="text-center mb-8">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <User className="h-12 w-12 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Sélection de la Catégorie</h3>
              <p className="text-gray-600">Choisissez votre catégorie professionnelle</p>
            </div>

            <div className="grid grid-cols-1 gap-4 mb-8">
              {categories.map((categorie) => (
                <motion.button
                  key={categorie.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleCategorySelection(categorie.id)}
                  className="p-6 border-2 border-gray-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all duration-200"
                >
                  <div className="text-lg font-semibold text-gray-900">{categorie.label}</div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        );

      case 'candidateSelect':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-auto"
          >
            <div className="text-center mb-8">
              <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Vote className="h-12 w-12 text-orange-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Sélection du Candidat</h3>
              <p className="text-gray-600">Choisissez votre candidat préféré</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {candidats.map((candidat) => (
                <motion.button
                  key={candidat}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleCandidateSelection(candidat)}
                  className="p-6 border-2 border-gray-200 rounded-xl hover:border-orange-500 hover:bg-orange-50 transition-all duration-200"
                >
                  <div className="text-lg font-semibold text-gray-900">{candidat}</div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        );

      case 'complete':
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-auto"
          >
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Vote className="h-12 w-12 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">Vote Enregistré!</h2>
            <p className="text-gray-600 mb-6 text-center">Votre vote a été bien enregistré avec succès.</p>
            
            {voteChoices.length > 0 && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2">Résumé de votre vote:</h3>
                {voteChoices.map((choice, index) => (
                  <div key={index} className="text-sm text-gray-600 mb-1">
                    <span className="font-medium">
                      {conseils.find(c => c.id === choice.conseil)?.label}
                    </span> - 
                    <span className="font-medium">
                      {categories.find(c => c.id === choice.categorie)?.label}
                    </span>
                    <br />
                    <span className="text-blue-600 font-semibold">{choice.candidat}</span>
                  </div>
                ))}
              </div>
            )}
            
            <button
              onClick={() => navigate('/services')}
              className="w-full bg-green-600 text-white px-8 py-3 rounded-xl font-medium hover:bg-green-700 transition-colors"
            >
              Retour aux Services
            </button>
          </motion.div>
        );

      default:
        return null;
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 'scan':
        return 'Scanner votre Carte d\'Identité';
      case 'info':
        return 'Vérification des Informations';
      case 'faceVerify':
        return 'Vérification Faciale';
      case 'councilSelect':
        return 'Sélection du Conseil';
      case 'categorySelect':
        return 'Sélection de la Catégorie';
      case 'candidateSelect':
        return 'Sélection du Candidat';
      case 'complete':
        return 'Vote Terminé';
      default:
        return '';
    }
  };

  const getStepIcon = () => {
    switch (currentStep) {
      case 'scan':
        return <Camera className="h-6 w-6" />;
      case 'info':
        return <CheckCircle className="h-6 w-6" />;
      case 'faceVerify':
        return <User className="h-6 w-6" />;
      case 'councilSelect':
        return <Vote className="h-6 w-6" />;
      case 'categorySelect':
        return <User className="h-6 w-6" />;
      case 'candidateSelect':
        return <Vote className="h-6 w-6" />;
      case 'complete':
        return <Vote className="h-6 w-6" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto w-full"
      >
        {/* Back button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          onClick={() => navigate('/services')}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-8 transition-colors duration-200"
        >
          <ArrowLeft size={20} />
          <span className="font-poppins">Retour aux services</span>
        </motion.button>

        {/* Header */}
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center space-x-3 mb-4">
            {getStepIcon()}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 font-poppins">
              <span className="gradient-bg bg-clip-text text-transparent">i-Voting</span>
            </h1>
          </div>
          <h2 className="text-xl md:text-2xl text-gray-600 font-poppins">
            {getStepTitle()}
          </h2>
        </motion.div>

        {/* Progress indicators */}
        {currentStep !== 'complete' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex justify-center mb-8"
          >
            <div className="flex space-x-2">
              {['scan', 'info', 'faceVerify', 'councilSelect', 'categorySelect', 'candidateSelect'].map((step, index) => (
                <div
                  key={step}
                  className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                    currentStep === step
                      ? 'bg-blue-600'
                      : ['scan', 'info', 'faceVerify', 'councilSelect', 'categorySelect', 'candidateSelect'].indexOf(currentStep) > index
                      ? 'bg-green-600'
                      : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* Step content */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex-1"
        >
          {renderStep()}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default IVotingPage;
