import { useState } from 'react'
import { useApp } from '../context/AppContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar, Clock, TrendingUp, Download, Filter } from 'lucide-react'

export default function History() {
  const { sessions, presets } = useApp()
  const [filterDimension, setFilterDimension] = useState('Todas')
  const [filterPeriod, setFilterPeriod] = useState('Todas')

  // Filtros
  const dimensions = ['Todas', '3D', '4D', '5D', 'Personalizado']
  const periods = ['Todas', 'Hoje', 'Esta Semana', 'Este Mês']

  // Filtrar sessões
  const filteredSessions = sessions.filter(session => {
    const preset = presets.find(p => p.id === session.presetId)
    const sessionDate = new Date(session.startTime)
    const now = new Date()

    // Filtro por dimensão
    const dimensionMatch = filterDimension === 'Todas' || 
      (preset && preset.dimension === filterDimension) ||
      (filterDimension === 'Personalizado' && session.presetId.startsWith('custom'))

    // Filtro por período
    let periodMatch = true
    if (filterPeriod === 'Hoje') {
      periodMatch = sessionDate.toDateString() === now.toDateString()
    } else if (filterPeriod === 'Esta Semana') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      periodMatch = sessionDate >= weekAgo
    } else if (filterPeriod === 'Este Mês') {
      periodMatch = sessionDate.getMonth() === now.getMonth() && 
                   sessionDate.getFullYear() === now.getFullYear()
    }

    return dimensionMatch && periodMatch
  })

  // Estatísticas
  const totalSessions = filteredSessions.length
  const totalMinutes = Math.floor(filteredSessions.reduce((acc, s) => acc + (s.duration || 0), 0) / 60)
  const averageMoodImprovement = filteredSessions
    .filter(s => s.preMoodScore && s.postMoodScore)
    .reduce((acc, s) => acc + (s.postMoodScore - s.preMoodScore), 0) / 
    filteredSessions.filter(s => s.preMoodScore && s.postMoodScore).length || 0

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getDimensionColor = (dimension) => {
    switch (dimension) {
      case '3D': return 'bg-blue-100 text-blue-800'
      case '4D': return 'bg-purple-100 text-purple-800'
      case '5D': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const exportData = () => {
    const csvContent = [
      ['Data', 'Preset', 'Dimensão', 'Duração (min)', 'Humor Antes', 'Humor Depois', 'Notas'].join(','),
      ...filteredSessions.map(session => {
        const preset = presets.find(p => p.id === session.presetId)
        return [
          formatDate(session.startTime),
          preset?.name || 'Personalizado',
          preset?.dimension || 'Personalizado',
          Math.floor((session.duration || 0) / 60),
          session.preMoodScore || '',
          session.postMoodScore || '',
          `"${session.notes || ''}"`
        ].join(',')
      })
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `singulary-sessions-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="p-4 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-primary mb-2">
            Histórico de Sessões
          </h1>
          <p className="text-muted-foreground">
            Acompanhe sua evolução e padrões
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={exportData}>
          <Download size={16} className="mr-2" />
          Exportar
        </Button>
      </div>

      {/* Filtros */}
      <Card className="glass-card mb-6">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Filter size={16} />
            <span className="text-sm font-medium">Filtros</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-muted-foreground">Dimensão</label>
              <Select value={filterDimension} onValueChange={setFilterDimension}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {dimensions.map(dim => (
                    <SelectItem key={dim} value={dim}>{dim}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm text-muted-foreground">Período</label>
              <Select value={filterPeriod} onValueChange={setFilterPeriod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {periods.map(period => (
                    <SelectItem key={period} value={period}>{period}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Estatísticas */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card className="glass-card">
          <CardContent className="p-4 text-center">
            <Calendar size={24} className="mx-auto mb-2 text-primary" />
            <div className="text-xl font-bold text-primary">{totalSessions}</div>
            <div className="text-xs text-muted-foreground">Sessões</div>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardContent className="p-4 text-center">
            <Clock size={24} className="mx-auto mb-2 text-primary" />
            <div className="text-xl font-bold text-primary">{totalMinutes}</div>
            <div className="text-xs text-muted-foreground">Minutos</div>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardContent className="p-4 text-center">
            <TrendingUp size={24} className="mx-auto mb-2 text-primary" />
            <div className="text-xl font-bold text-primary">
              {averageMoodImprovement > 0 ? '+' : ''}{averageMoodImprovement.toFixed(1)}
            </div>
            <div className="text-xs text-muted-foreground">Humor Médio</div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Sessões */}
      <div className="space-y-4">
        {filteredSessions.length === 0 ? (
          <Card className="glass-card">
            <CardContent className="p-8 text-center">
              <Calendar size={48} className="mx-auto mb-4 text-muted-foreground" />
              <h3 className="font-semibold mb-2">Nenhuma sessão encontrada</h3>
              <p className="text-sm text-muted-foreground">
                Ajuste os filtros ou comece uma nova sessão
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredSessions.map(session => {
            const preset = presets.find(p => p.id === session.presetId)
            const moodChange = session.postMoodScore && session.preMoodScore ? 
              session.postMoodScore - session.preMoodScore : null

            return (
              <Card key={session.id} className="glass-card">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">
                          {preset?.name || 'Sessão Personalizada'}
                        </h3>
                        {preset && (
                          <Badge className={getDimensionColor(preset.dimension)}>
                            {preset.dimension}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(session.startTime)}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">
                        {formatDuration(session.duration || 0)}
                      </div>
                      {moodChange !== null && (
                        <div className={`text-sm ${
                          moodChange > 0 ? 'text-green-600' : 
                          moodChange < 0 ? 'text-red-600' : 'text-muted-foreground'
                        }`}>
                          {moodChange > 0 ? '+' : ''}{moodChange.toFixed(1)} humor
                        </div>
                      )}
                    </div>
                  </div>

                  {session.notes && (
                    <div className="border-t pt-3">
                      <p className="text-sm text-muted-foreground">
                        "{session.notes}"
                      </p>
                    </div>
                  )}

                  {preset && (
                    <div className="border-t pt-3 mt-3">
                      <div className="grid grid-cols-3 gap-4 text-xs text-muted-foreground">
                        <div>Base: {preset.baseFrequency}Hz</div>
                        <div>Batida: {preset.beatFrequency}Hz</div>
                        <div>Luz: {preset.lightFrequency}Hz</div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}

