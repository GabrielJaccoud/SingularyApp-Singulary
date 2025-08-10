import { useLocation, useNavigate } from 'react-router-dom'
import { Home, Compass, Play, Map, History, User } from 'lucide-react'

export default function BottomNavigation() {
  const location = useLocation()
  const navigate = useNavigate()

  const navItems = [
    { path: '/', icon: Home, label: 'Início' },
    { path: '/explore', icon: Compass, label: 'Explorar' },
    { path: '/player', icon: Play, label: 'Player' },
    { path: '/journey', icon: Map, label: 'Jornada' },
    { path: '/history', icon: History, label: 'Histórico' },
    { path: '/profile', icon: User, label: 'Perfil' }
  ]

  return (
    <nav className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bottom-nav border-t">
      <div className="flex justify-around items-center py-2 px-4">
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path || 
            (path === '/player' && location.pathname.startsWith('/player'))
          
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
                isActive 
                  ? 'text-primary bg-primary/10' 
                  : 'text-muted-foreground hover:text-primary'
              }`}
            >
              <Icon size={20} />
              <span className="text-xs mt-1">{label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}

