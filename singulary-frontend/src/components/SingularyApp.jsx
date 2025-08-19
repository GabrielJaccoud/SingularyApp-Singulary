import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useApp } from '../context/AppContext';

// Componentes das telas
import Home from './Home';
import Explore from './Explore';
import Player from './Player';
import Journey from './Journey';
import History from './History';
import Profile from './Profile';
import BottomNavigation from './BottomNavigation';
import SplashScreen from './SplashScreen';

const SingularyApp = ({ user, onLogout }) => {
  const { currentView, loading } = useApp();

  // Mostrar loading se necessário
  if (loading) {
    return <SplashScreen />;
  }

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900">
        <div className="max-w-md mx-auto bg-black/20 min-h-screen relative backdrop-blur-sm">
          <Routes>
            <Route path="/" element={<Home user={user} />} />
            <Route path="/explore" element={<Explore user={user} />} />
            <Route path="/player/:presetId?" element={<Player user={user} />} />
            <Route path="/journey" element={<Journey user={user} />} />
            <Route path="/history" element={<History user={user} />} />
            <Route path="/profile" element={<Profile user={user} onLogout={onLogout} />} />
          </Routes>
          <BottomNavigation />
        </div>
      </div>
    </Router>
  );
};

export default SingularyApp;

