import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Analytics } from '@vercel/analytics/react';
import HomePage from './pages/HomePage';
import NavigationPage from './pages/NavigationPage';
import NavigationVideoPage from './pages/NavigationVideoPage';
import SensorVideoPage from './pages/SensorVideoPage';
import EnsadPage from './pages/EnsadPage';
import EnsetPage from './pages/EnsetPage';
import ConcoursEnset from './pages/ConcoursEnset';
import InscriptionEnset from './pages/InscriptionEnset';
import ToilettesPage from './pages/ToilettesPage';
import MosqueePage from './pages/MosqueePage';
import ExplorerPage from './pages/ExplorerPage';
import DestinationPage from './pages/DestinationPage';
import NotFoundPage from './pages/NotFoundPage';
import Header from './components/Header';
import './App.css';

const AppContent = () => {
  const location = useLocation();
  const isNotFoundPage = !['/', '/navigate', '/video-navigate', '/sensor-navigate', '/toilettes', '/mosquee', '/concours-enset', '/inscription-enset', '/ensad', '/enset', '/explorer', '/destination'].some(path => 
    location.pathname === path || location.pathname.startsWith(path + '/')
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100">
      {!isNotFoundPage && <Header />}
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={!isNotFoundPage ? "pt-10" : ""}
      >
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/navigate/:id" element={<NavigationPage />} />
          <Route path="/video-navigate/:id" element={<NavigationVideoPage />} />
          <Route path="/sensor-navigate/:id" element={<SensorVideoPage />} />
          <Route path="/toilettes/:pointDepart" element={<ToilettesPage />} />
          <Route path="/mosquee/:pointDepart" element={<MosqueePage />} />
          <Route path="/concours-enset" element={<ConcoursEnset />} />
          <Route path="/inscription-enset" element={<InscriptionEnset />} />
          <Route path="/explorer" element={<ExplorerPage />} />
          <Route path="/destination/:destination" element={<DestinationPage />} />
          <Route path="/ensad" element={<EnsadPage />} />
          <Route path="/ensad/:porte" element={<EnsadPage />} />
          <Route path="/enset" element={<EnsetPage />} />
          <Route path="/enset/:porte" element={<EnsetPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </motion.main>
      <Analytics />
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;