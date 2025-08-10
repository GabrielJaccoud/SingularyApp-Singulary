import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'

// Componentes das telas
import Home from './components/Home'
import Explore from './components/Explore'
import Player from './components/Player'
import Journey from './components/Journey'
import History from './components/History'
import Profile from './components/Profile'
import BottomNavigation from './components/BottomNavigation'
import SplashScreen from './components/SplashScreen'

// Context para gerenciar estado global
import { AppProvider } from './context/AppContext'

function App() {
  const [showSplash, setShowSplash] = useState(true)

  useEffect(() => {
    // Mostrar splash screen por 3 segundos
    const timer = setTimeout(() => {
      setShowSplash(false)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  if (showSplash) {
    return <SplashScreen />
  }

  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen singulary-gradient">
          <div className="max-w-md mx-auto bg-background/50 min-h-screen relative">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/player/:presetId?" element={<Player />} />
              <Route path="/journey" element={<Journey />} />
              <Route path="/history" element={<History />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
            <BottomNavigation />
          </div>
        </div>
      </Router>
    </AppProvider>
  )
}

export default App

