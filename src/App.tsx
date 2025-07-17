import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Analytics } from '@vercel/analytics/react';
import HomePage from './pages/HomePage';
import NavigationPage from './pages/NavigationPage';
import GenderSelectionPage from './pages/GenderSelectionPage';
import FindMyExamRoomPage from './pages/FindMyExamRoomPage';
import EnsadPage from './pages/EnsadPage';
import EnsetPage from './pages/EnsetPage';
import ConcoursEnset from './pages/ConcoursEnset';
import Header from './components/Header';
import './App.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100">
        <Header />
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="pt-10"
        >
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/navigate/:id" element={<NavigationPage />} />
            <Route path="/gender-selection/:type" element={<GenderSelectionPage />} />
            <Route path="/findmyexamroom/:idConcours" element={<FindMyExamRoomPage />} />
            <Route path="/concours-enset" element={<ConcoursEnset />} />
            <Route path="/ensad" element={<EnsadPage />} />
            <Route path="/ensad/:porte" element={<EnsadPage />} />
            <Route path="/enset" element={<EnsetPage />} />
            <Route path="/enset/:porte" element={<EnsetPage />} />
          </Routes>
        </motion.main>
        <Analytics />
      </div>
    </Router>
  );
}

export default App;