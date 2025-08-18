import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Vote, Users, Award } from 'lucide-react';

interface UserInfo {
  nom: string;
  prenom: string;
  cin: string;
  fonction: string;
}

interface VotingInterfaceProps {
  userInfo: UserInfo | null;
  onVoteComplete: () => void;
}

type VoteCategory = 'conseil_etablissement' | 'conseil_universite';
type VoteSubCategory = 'MC' | 'MCH' | 'PES';

interface Candidate {
  id: string;
  nom: string;
  prenom: string;
  fonction: string;
}

const VotingInterface: React.FC<VotingInterfaceProps> = ({ userInfo, onVoteComplete }) => {
  const [selectedCategory, setSelectedCategory] = useState<VoteCategory | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<VoteSubCategory | null>(null);
  const [selectedCandidate, setSelectedCandidate] = useState<string | null>(null);
  const [votes, setVotes] = useState<Record<string, string>>({});
  const [showConfirmation, setShowConfirmation] = useState(false);

  const candidates: Candidate[] = [
    { id: '1', nom: 'REBBANI', prenom: 'Ahmed', fonction: 'Professeur' },
    { id: '2', nom: 'YOUSSEFI', prenom: 'Mohammed', fonction: 'Maître de Conférences' },
    { id: '3', nom: 'QBADOU', prenom: 'Mohammed', fonction: 'Professeur' },
    { id: '4', nom: 'BOUSSELHAM', prenom: 'Abdessalam', fonction: 'Maître de Conférences' },
    { id: '5', nom: 'DAIF', prenom: 'Azziz', fonction: 'Professeur' },
    { id: '6', nom: 'BOUATTAN', prenom: 'Omar', fonction: 'Maître de Conférences Habilité' },
    { id: '7', nom: 'KHIYAT', prenom: 'Azzedine', fonction: 'Professeur' },
    { id: '8', nom: 'KHALIFA', prenom: 'Menssouri', fonction: 'Maître de Conférences' },
  ];

  const categories = [
    {
      id: 'conseil_etablissement' as VoteCategory,
      title: 'Conseil d\'Établissement',
      description: 'Élection des représentants au conseil d\'établissement',
      icon: Users
    },
    {
      id: 'conseil_universite' as VoteCategory,
      title: 'Conseil d\'Université',
      description: 'Élection des représentants au conseil d\'université',
      icon: Award
    }
  ];

  const subCategories = [
    { id: 'MC' as VoteSubCategory, title: 'Maître de Conférences (MC)', description: 'Enseignants-chercheurs MC' },
    { id: 'MCH' as VoteSubCategory, title: 'Maître de Conférences Habilité (MCH)', description: 'Enseignants-chercheurs MCH' },
    { id: 'PES' as VoteSubCategory, title: 'Professeur d\'Enseignement Supérieur (PES)', description: 'Professeurs PES' }
  ];

  const handleVoteSubmit = () => {
    if (selectedCandidate && selectedCategory && selectedSubCategory) {
      const voteKey = `${selectedCategory}_${selectedSubCategory}`;
      const newVotes = { ...votes, [voteKey]: selectedCandidate };
      setVotes(newVotes);
      setShowConfirmation(true);
      
      setTimeout(() => {
        onVoteComplete();
      }, 2000);
    }
  };

  const getFilteredCandidates = () => {
    if (!selectedSubCategory) return candidates;
    
    return candidates.filter(candidate => {
      if (selectedSubCategory === 'MC') {
        return candidate.fonction === 'Maître de Conférences';
      } else if (selectedSubCategory === 'MCH') {
        return candidate.fonction === 'Maître de Conférences Habilité';
      } else if (selectedSubCategory === 'PES') {
        return candidate.fonction === 'Professeur';
      }
      return true;
    });
  };

  if (showConfirmation) {
    const selectedCandidateInfo = candidates.find(c => c.id === selectedCandidate);
    
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center bg-white rounded-2xl shadow-xl p-8"
      >
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Vote className="h-10 w-10 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Vote Confirmé!</h2>
        
        {selectedCandidateInfo && (
          <div className="bg-green-50 rounded-lg p-4 mb-6">
            <p className="text-green-800 font-medium mb-2">Votre vote pour:</p>
            <p className="text-green-900 font-bold">
              {selectedCandidateInfo.prenom} {selectedCandidateInfo.nom}
            </p>
            <p className="text-green-700 text-sm">
              {categories.find(c => c.id === selectedCategory)?.title} - {subCategories.find(s => s.id === selectedSubCategory)?.title}
            </p>
          </div>
        )}
        
        <p className="text-gray-600">Enregistrement en cours...</p>
      </motion.div>
    );
  }

  // Category selection
  if (!selectedCategory) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-xl p-8"
      >
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Vote className="h-10 w-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Choisir une Catégorie</h2>
          {userInfo && (
            <p className="text-gray-600">
              Bonjour {userInfo.prenom} {userInfo.nom}, veuillez sélectionner la catégorie de vote
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <motion.button
                key={category.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedCategory(category.id)}
                className="p-6 border-2 border-gray-200 rounded-xl hover:border-green-500 transition-colors duration-200 text-left"
              >
                <IconComponent className="h-8 w-8 text-green-600 mb-4" />
                <h3 className="font-bold text-gray-900 mb-2">{category.title}</h3>
                <p className="text-sm text-gray-600">{category.description}</p>
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    );
  }

  // Sub-category selection
  if (!selectedSubCategory) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-xl p-8"
      >
        <div className="text-center mb-8">
          <button
            onClick={() => setSelectedCategory(null)}
            className="text-sm text-gray-500 hover:text-gray-700 mb-4"
          >
            ← Retour aux catégories
          </button>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Choisir une Sous-Catégorie</h2>
          <p className="text-gray-600">
            {categories.find(c => c.id === selectedCategory)?.title}
          </p>
        </div>

        <div className="space-y-4">
          {subCategories.map((subCategory) => (
            <motion.button
              key={subCategory.id}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => setSelectedSubCategory(subCategory.id)}
              className="w-full p-4 border-2 border-gray-200 rounded-xl hover:border-green-500 transition-colors duration-200 text-left"
            >
              <h3 className="font-bold text-gray-900 mb-1">{subCategory.title}</h3>
              <p className="text-sm text-gray-600">{subCategory.description}</p>
            </motion.button>
          ))}
        </div>
      </motion.div>
    );
  }

  // Candidate selection
  const filteredCandidates = getFilteredCandidates();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-2xl shadow-xl p-8"
    >
      <div className="text-center mb-8">
        <button
          onClick={() => setSelectedSubCategory(null)}
          className="text-sm text-gray-500 hover:text-gray-700 mb-4"
        >
          ← Retour aux sous-catégories
        </button>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Choisir un Candidat</h2>
        <p className="text-gray-600">
          {categories.find(c => c.id === selectedCategory)?.title} - {subCategories.find(s => s.id === selectedSubCategory)?.title}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {filteredCandidates.map((candidate) => (
          <motion.button
            key={candidate.id}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => setSelectedCandidate(candidate.id)}
            className={`p-4 border-2 rounded-xl transition-all duration-200 text-left ${
              selectedCandidate === candidate.id
                ? 'border-green-500 bg-green-50'
                : 'border-gray-200 hover:border-green-300'
            }`}
          >
            <h3 className="font-bold text-gray-900">
              {candidate.prenom} {candidate.nom}
            </h3>
            <p className="text-sm text-gray-600">{candidate.fonction}</p>
          </motion.button>
        ))}
      </div>

      {selectedCandidate && (
        <div className="text-center">
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleVoteSubmit}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-medium transition-colors duration-200"
          >
            Confirmer mon Vote
          </motion.button>
        </div>
      )}
    </motion.div>
  );
};

export default VotingInterface;
