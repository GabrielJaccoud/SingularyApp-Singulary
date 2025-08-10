import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Slider } from '@/components/ui/slider'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Play, Pause, Square, Volume2, Lightbulb, AlertTriangle, ArrowLeft } from 'lucide-react'
import AudioEngine from '../utils/AudioEngine'
import StrobeVisualizer from './StrobeVisualizer'

export default function Player() {
  const { presetId } = useParams()
  const navigate = useNavigate()
  const { 
    presets, 
    currentPreset, 
    setCurrentPreset, 
    isPlaying, 
    setPlaying,
    startSession,
    endSession,
    currentSession,
    addCustomPreset
  } = useApp()

  const [selectedPreset, setSelectedPreset] = useState(null)
  const [customSettings, setCustomSettings] = useState({
    name: '',
    baseFrequency: 528,
    beatFrequency: 40,
    lightFrequency: 10,
    duration: 20,
    category: 'Personalizado'
  })
  const [sessionTime, setSessionTime] = useState(0)
  const [showPhotosensitiveWarning, setShowPhotosensitiveWarning] = useState(true)
  const [enableStrobe, setEnableStrobe] = useState(false)
  const [preMoodScore, setPreMoodScore] = useState(5)
  const [postMoodScore, setPostMoodScore] = useState(5)
  const [sessionNotes, setSessionNotes] = useState('')
  const [showEndSessionDialog, setShowEndSessionDialog] = useState(false)

  const audioEngineRef = useRef(null)
  const timerRef = useRef(null)

  // Inicializar preset
  useEffect(() => {
    if (presetId && presetId !== 'custom') {
      const preset = presets.find(p => p.id === presetId)
      if (preset) {
        setSelectedPreset(preset)
        setCurrentPreset(preset)
        setCustomSettings({
          ...customSettings,
          baseFrequency: preset.baseFrequency,
          beatFrequency: preset.beatFrequency,
          lightFrequency: preset.lightFrequency,
          duration: preset.duration
        })
      }
    } else if (presetId === 'custom') {
      setSelectedPreset(null)
    }
  }, [presetId, presets])

  // Timer da sessão
  useEffect(() => {
    if (isPlaying && currentSession) {
      timerRef.current = setInterval(() => {
        setSessionTime(prev => prev + 1)
      }, 1000)
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [isPlaying, currentSession])

  // Inicializar AudioEngine
  useEffect(() => {
    audioEngineRef.current = new AudioEngine()
    
    return () => {
      if (audioEngineRef.current) {
        audioEngineRef.current.stop()
      }
    }
  }, [])

  const handlePlay = async () => {
    if (!audioEngineRef.current) return

    const settings = selectedPreset || customSettings

    try {
      if (!isPlaying) {
        // Iniciar sessão
        await audioEngineRef.current.start(
          settings.baseFrequency,
          settings.beatFrequency
        )
        
        startSession(selectedPreset?.id || 'custom', preMoodScore)
        setPlaying(true)
        setSessionTime(0)
      } else {
        // Pausar
        audioEngineRef.current.pause()
        setPlaying(false)
      }
    } catch (error) {
      console.error('Erro ao iniciar áudio:', error)
      alert('Erro ao iniciar o áudio. Verifique se o navegador permite reprodução de áudio.')
    }
  }

  const handleStop = () => {
    if (audioEngineRef.current) {
      audioEngineRef.current.stop()
    }
    setPlaying(false)
    
    if (currentSession) {
      setShowEndSessionDialog(true)
    }
  }

  const handleEndSession = () => {
    endSession(postMoodScore, sessionNotes)
    setShowEndSessionDialog(false)
    setSessionTime(0)
    setSessionNotes('')
    setPostMoodScore(5)
  }

  const handleSaveCustomPreset = () => {
    if (!customSettings.name.trim()) {
      alert('Por favor, digite um nome para o preset')
      return
    }

    addCustomPreset(customSettings)
    alert('Preset personalizado salvo com sucesso!')
    setCustomSettings({
      ...customSettings,
      name: ''
    })
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const dismissPhotosensitiveWarning = () => {
    setShowPhotosensitiveWarning(false)
    setEnableStrobe(true)
  }

  return (
    <div className="p-4 pb-20">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
        </Button>
        <div>
          <h1 className="text-xl font-bold text-primary">
            {selectedPreset ? selectedPreset.name : 'Sessão Personalizada'}
          </h1>
          <p className="text-sm text-muted-foreground">
            {selectedPreset ? selectedPreset.description : 'Configure suas frequências'}
          </p>
        </div>
      </div>

      {/* Aviso Fotossensível */}
      {showPhotosensitiveWarning && (
        <Alert className="mb-6 border-yellow-200 bg-yellow-50">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            <strong>Aviso:</strong> Este aplicativo utiliza luzes estroboscópicas que podem causar 
            convulsões em pessoas com epilepsia fotossensível. Se você tem histórico de epilepsia 
            ou sensibilidade à luz, não use a visualização estroboscópica.
            <div className="flex gap-2 mt-3">
              <Button size="sm" onClick={dismissPhotosensitiveWarning}>
                Entendi, continuar
              </Button>
              <Button size="sm" variant="outline" onClick={() => setShowPhotosensitiveWarning(false)}>
                Usar apenas áudio
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Visualização Estroboscópica */}
      {enableStrobe && (
        <Card className="glass-card mb-6">
          <CardContent className="p-4">
            <StrobeVisualizer 
              frequency={customSettings.lightFrequency}
              isActive={isPlaying}
            />
          </CardContent>
        </Card>
      )}

      {/* Controles do Player */}
      <Card className="glass-card mb-6">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Controles de Áudio</span>
            {currentSession && (
              <div className="session-timer text-lg">
                {formatTime(sessionTime)}
              </div>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Seletor de Preset */}
          {!selectedPreset && (
            <div>
              <Label>Preset Base</Label>
              <Select onValueChange={(value) => {
                const preset = presets.find(p => p.id === value)
                if (preset) {
                  setCustomSettings({
                    ...customSettings,
                    baseFrequency: preset.baseFrequency,
                    beatFrequency: preset.beatFrequency,
                    lightFrequency: preset.lightFrequency,
                    duration: preset.duration
                  })
                }
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Escolha um preset como base" />
                </SelectTrigger>
                <SelectContent>
                  {presets.map(preset => (
                    <SelectItem key={preset.id} value={preset.id}>
                      {preset.name} ({preset.dimension})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Frequência Base */}
          <div>
            <Label>Frequência Base: {customSettings.baseFrequency}Hz</Label>
            <Slider
              value={[customSettings.baseFrequency]}
              onValueChange={([value]) => setCustomSettings({...customSettings, baseFrequency: value})}
              min={100}
              max={1000}
              step={1}
              className="mt-2"
            />
          </div>

          {/* Frequência de Batida */}
          <div>
            <Label>Frequência de Batida: {customSettings.beatFrequency}Hz</Label>
            <Slider
              value={[customSettings.beatFrequency]}
              onValueChange={([value]) => setCustomSettings({...customSettings, beatFrequency: value})}
              min={1}
              max={100}
              step={0.1}
              className="mt-2"
            />
          </div>

          {/* Frequência de Luz */}
          {enableStrobe && (
            <div>
              <Label>Frequência de Luz: {customSettings.lightFrequency}Hz</Label>
              <Slider
                value={[customSettings.lightFrequency]}
                onValueChange={([value]) => setCustomSettings({...customSettings, lightFrequency: value})}
                min={1}
                max={30}
                step={0.1}
                className="mt-2"
              />
            </div>
          )}

          {/* Controles de Reprodução */}
          <div className="flex gap-2 pt-4">
            <Button onClick={handlePlay} className="flex-1">
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
              {isPlaying ? 'Pausar' : 'Iniciar'}
            </Button>
            <Button variant="outline" onClick={handleStop}>
              <Square size={20} />
              Parar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Configurações Personalizadas */}
      {!selectedPreset && (
        <Card className="glass-card mb-6">
          <CardHeader>
            <CardTitle>Salvar Preset Personalizado</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Nome do Preset</Label>
              <Input
                value={customSettings.name}
                onChange={(e) => setCustomSettings({...customSettings, name: e.target.value})}
                placeholder="Ex: Minha Frequência Especial"
              />
            </div>
            <Button onClick={handleSaveCustomPreset} className="w-full">
              Salvar Preset
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Avaliação Pré-Sessão */}
      {!currentSession && (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Como você se sente agora?</CardTitle>
          </CardHeader>
          <CardContent>
            <Label>Humor atual (1-10)</Label>
            <Slider
              value={[preMoodScore]}
              onValueChange={([value]) => setPreMoodScore(value)}
              min={1}
              max={10}
              step={1}
              className="mt-2"
            />
            <div className="text-center mt-2 text-sm text-muted-foreground">
              {preMoodScore}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dialog de Fim de Sessão */}
      {showEndSessionDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Finalizar Sessão</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Como você se sente agora? (1-10)</Label>
                <Slider
                  value={[postMoodScore]}
                  onValueChange={([value]) => setPostMoodScore(value)}
                  min={1}
                  max={10}
                  step={1}
                  className="mt-2"
                />
                <div className="text-center mt-2 text-sm text-muted-foreground">
                  {postMoodScore}
                </div>
              </div>
              
              <div>
                <Label>Notas da sessão (opcional)</Label>
                <Input
                  value={sessionNotes}
                  onChange={(e) => setSessionNotes(e.target.value)}
                  placeholder="Como foi sua experiência?"
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={handleEndSession} className="flex-1">
                  Finalizar
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowEndSessionDialog(false)}
                >
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

