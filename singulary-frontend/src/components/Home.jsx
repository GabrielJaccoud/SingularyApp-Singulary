import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Play, Compass, TrendingUp, Clock } from 'lucide-react'
import logoSingulary from '../assets/LogoSingularyemTonsGradientes.png'

export default function Home() {
  const navigate = useNavigate()
  const { userProgress, sessions, presets } = useApp()

  const todaysSessions = sessions.filter(session => {
    const today = new Date().toDateString()
    const sessionDate = new Date(session.startTime).toDateString()
    return today === sessionDate
  })

  const recommendedPreset = presets.find(p => p.id === '3d-focus') || presets[0]

  return (
    <div className="p-4 pb-20">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="logo-container">
          <img 
            src={logoSingulary} 
            alt="Singulary" 
            className="w-12 h-12 object-contain"
          />
        </div>
        <div>
          <h1 className="text-xl font-bold text-primary">
            Bem-vindo ao Singulary
          </h1>
          <p className="text-sm text-muted-foreground">
            Seu Ressonador Quântico Pessoal
          </p>
        </div>
      </div>

      {/* Jornada de Hoje */}
      <Card className="glass-card mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp size={20} />
            Sua Jornada de Hoje
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {todaysSessions.length}
              </div>
              <div className="text-sm text-muted-foreground">
                Sessões Hoje
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {Math.floor(todaysSessions.reduce((acc, s) => acc + (s.duration || 0), 0) / 60)}
              </div>
              <div className="text-sm text-muted-foreground">
                Minutos
              </div>
            </div>
          </div>
          
          {recommendedPreset && (
            <div className="border-t pt-4">
              <p className="text-sm text-muted-foreground mb-2">
                Recomendado para você:
              </p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{recommendedPreset.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {recommendedPreset.description}
                  </p>
                </div>
                <Button 
                  size="sm"
                  onClick={() => navigate(`/player/${recommendedPreset.id}`)}
                >
                  <Play size={16} className="mr-1" />
                  Iniciar
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Grid de Navegação */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card 
          className="glass-card dimension-card cursor-pointer"
          onClick={() => navigate('/explore')}
        >
          <CardContent className="p-4 text-center">
            <Compass size={32} className="mx-auto mb-2 text-primary" />
            <h3 className="font-semibold">Explorar Dimensões</h3>
            <p className="text-sm text-muted-foreground">
              Descubra frequências
            </p>
          </CardContent>
        </Card>

        <Card 
          className="glass-card dimension-card cursor-pointer"
          onClick={() => navigate('/player')}
        >
          <CardContent className="p-4 text-center">
            <Play size={32} className="mx-auto mb-2 text-primary" />
            <h3 className="font-semibold">Sessão Rápida</h3>
            <p className="text-sm text-muted-foreground">
              Comece agora
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Progresso Geral */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock size={20} />
            Seu Progresso
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-xl font-bold text-primary">
                {userProgress.totalSessions}
              </div>
              <div className="text-xs text-muted-foreground">
                Total de Sessões
              </div>
            </div>
            <div>
              <div className="text-xl font-bold text-primary">
                {userProgress.totalMinutes}
              </div>
              <div className="text-xs text-muted-foreground">
                Minutos Totais
              </div>
            </div>
            <div>
              <div className="text-xl font-bold text-primary">
                {userProgress.dimensionsUnlocked.length}
              </div>
              <div className="text-xs text-muted-foreground">
                Dimensões
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

