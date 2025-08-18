import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, User, Vote } from 'lucide-react';
import IDCardScanner from '../components/IDCardScanner';
import FaceVerification from '../components/FaceVerification';
import VotingInterface from '../components/VotingInterface';

interface UserInfo {
  nom: string;
  prenom: string;
  cin: string;
  fonction: string;
}

const IVotingPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<'scan' | 'verify' | 'vote' | 'complete'>('scan');
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  const handleIDScanned = (info: UserInfo) => {
    setUserInfo(info);
    setCurrentStep('verify');
  };

  const handleFaceVerified = () => {
    setCurrentStep('vote');
  };

  const handleVoteComplete = () => {
    setCurrentStep('complete');
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'scan':
        return <IDCardScanner onScanComplete={handleIDScanned} />;
      case 'verify':
        return <FaceVerification userInfo={userInfo} onVerificationComplete={handleFaceVerified} />;
      case 'vote':
        return <VotingInterface userInfo={userInfo} onVoteComplete={handleVoteComplete} />;
      case 'complete':
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center bg-white rounded-2xl shadow-xl p-8"
          >
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Vote className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Vote Enregistré!</h2>
            <p className="text-gray-600 mb-8">Votre vote a été bien enregistré avec succès.</p>
            <button
              onClick={() => navigate('/services')}
              className="button-primary text-white px-8 py-3 rounded-xl font-medium"
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
      case 'verify':
        return 'Vérification Faciale';
      case 'vote':
        return 'Interface de Vote';
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
      case 'verify':
        return <User className="h-6 w-6" />;
      case 'vote':
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
            <div className="flex space-x-4">
              {['scan', 'verify', 'vote'].map((step, index) => (
                <div
                  key={step}
                  className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                    currentStep === step
                      ? 'bg-blue-600'
                      : ['scan', 'verify', 'vote'].indexOf(currentStep) > index
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
