import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { CheckCircle, Circle, Star, Trophy, Target } from 'lucide-react'

export default function Journey() {
  const { userProgress, sessions, presets } = useApp()
  const [selectedDimension, setSelectedDimension] = useState('3D')

  // Missões diárias
  const dailyMissions = [
    {
      id: 'daily-session',
      title: 'Sessão Diária',
      description: 'Complete uma sessão de pelo menos 10 minutos',
      target: 1,
      current: sessions.filter(s => {
        const today = new Date().toDateString()
        const sessionDate = new Date(s.startTime).toDateString()
        return today === sessionDate && (s.duration || 0) >= 600
      }).length,
      reward: '10 pontos de experiência'
    },
    {
      id: 'try-new-frequency',
      title: 'Explorar Nova Frequência',
      description: 'Experimente um preset que você nunca usou',
      target: 1,
      current: 0, // Seria calculado baseado no histórico
      reward: 'Desbloqueio de insight'
    },
    {
      id: 'mindful-session',
      title: 'Sessão Consciente',
      description: 'Complete uma sessão com avaliação pré e pós',
      target: 1,
      current: sessions.filter(s => {
        const today = new Date().toDateString()
        const sessionDate = new Date(s.startTime).toDateString()
        return today === sessionDate && s.preMoodScore && s.postMoodScore
      }).length,
      reward: 'Análise de humor'
    }
  ]

  // Progresso por dimensão
  const dimensionProgress = {
    '3D': {
      name: 'Dimensão Física',
      description: 'Foco, energia e relaxamento',
      unlocked: true,
      progress: 75,
      sessions: sessions.filter(s => {
        const preset = presets.find(p => p.id === s.presetId)
        return preset?.dimension === '3D'
      }).length,
      nextUnlock: 'Desbloqueie 4D com 20 sessões 3D'
    },
    '4D': {
      name: 'Dimensão Astral',
      description: 'Meditação profunda e sonho lúcido',
      unlocked: userProgress.dimensionsUnlocked.includes('4D'),
      progress: 30,
      sessions: sessions.filter(s => {
        const preset = presets.find(p => p.id === s.presetId)
        return preset?.dimension === '4D'
      }).length,
      nextUnlock: 'Desbloqueie 5D com 15 sessões 4D'
    },
    '5D': {
      name: 'Dimensão Espiritual',
      description: 'Amor incondicional e conexão superior',
      unlocked: userProgress.dimensionsUnlocked.includes('5D'),
      progress: 10,
      sessions: sessions.filter(s => {
        const preset = presets.find(p => p.id === s.presetId)
        return preset?.dimension === '5D'
      }).length,
      nextUnlock: 'Dimensão máxima alcançada'
    }
  }

  // Conquistas
  const achievements = [
    {
      id: 'first-session',
      title: 'Primeira Jornada',
      description: 'Complete sua primeira sessão',
      unlocked: sessions.length > 0,
      icon: Star
    },
    {
      id: 'week-streak',
      title: 'Dedicação Semanal',
      description: 'Complete sessões por 7 dias consecutivos',
      unlocked: userProgress.currentStreak >= 7,
      icon: Trophy
    },
    {
      id: 'dimension-explorer',
      title: 'Explorador Dimensional',
      description: 'Experimente todas as dimensões',
      unlocked: userProgress.dimensionsUnlocked.length >= 3,
      icon: Target
    }
  ]

  return (
    <div className="p-4 pb-20">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-primary mb-2">
          Sua Jornada Espiritual
        </h1>
        <p className="text-muted-foreground">
          Acompanhe seu progresso e desbloqueie novas dimensões
        </p>
      </div>

      {/* Missões Diárias */}
      <Card className="glass-card mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target size={20} />
            Missões de Hoje
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {dailyMissions.map(mission => {
            const isCompleted = mission.current >= mission.target
            return (
              <div key={mission.id} className="flex items-start gap-3">
                {isCompleted ? (
                  <CheckCircle size={20} className="text-green-500 mt-1" />
                ) : (
                  <Circle size={20} className="text-muted-foreground mt-1" />
                )}
                <div className="flex-1">
                  <h4 className="font-medium">{mission.title}</h4>
                  <p className="text-sm text-muted-foreground mb-1">
                    {mission.description}
                  </p>
                  <div className="flex items-center gap-2">
                    <Progress 
                      value={(mission.current / mission.target) * 100} 
                      className="flex-1 h-2"
                    />
                    <span className="text-xs text-muted-foreground">
                      {mission.current}/{mission.target}
                    </span>
                  </div>
                  <p className="text-xs text-accent-foreground mt-1">
                    Recompensa: {mission.reward}
                  </p>
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* Progresso Dimensional */}
      <Card className="glass-card mb-6">
        <CardHeader>
          <CardTitle>Zonas Dimensionais</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            {Object.keys(dimensionProgress).map(dim => (
              <Button
                key={dim}
                variant={selectedDimension === dim ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedDimension(dim)}
                disabled={!dimensionProgress[dim].unlocked}
              >
                {dim}
              </Button>
            ))}
          </div>

          {selectedDimension && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg">
                  {dimensionProgress[selectedDimension].name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {dimensionProgress[selectedDimension].description}
                </p>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm">Progresso</span>
                  <span className="text-sm font-medium">
                    {dimensionProgress[selectedDimension].progress}%
                  </span>
                </div>
                <Progress 
                  value={dimensionProgress[selectedDimension].progress} 
                  className="h-3"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-xl font-bold text-primary">
                    {dimensionProgress[selectedDimension].sessions}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Sessões Completadas
                  </div>
                </div>
                <div>
                  <div className="text-xl font-bold text-primary">
                    {dimensionProgress[selectedDimension].unlocked ? 'Desbloqueada' : 'Bloqueada'}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Status
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <p className="text-sm text-muted-foreground">
                  {dimensionProgress[selectedDimension].nextUnlock}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Conquistas */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy size={20} />
            Conquistas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {achievements.map(achievement => {
              const Icon = achievement.icon
              return (
                <div 
                  key={achievement.id}
                  className={`flex items-center gap-3 p-3 rounded-lg border ${
                    achievement.unlocked 
                      ? 'bg-accent/10 border-accent' 
                      : 'bg-muted/10 border-muted'
                  }`}
                >
                  <Icon 
                    size={24} 
                    className={achievement.unlocked ? 'text-accent' : 'text-muted-foreground'} 
                  />
                  <div className="flex-1">
                    <h4 className="font-medium">{achievement.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {achievement.description}
                    </p>
                  </div>
                  {achievement.unlocked && (
                    <Badge variant="secondary">Conquistado</Badge>
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

