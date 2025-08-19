import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Play, Pause, Square, Volume2, Lightbulb, AlertTriangle, ArrowLeft, 
  Heart, Brain, Zap, Sparkles, Settings, Save, Timer, Activity 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import AudioEngine from '../utils/AudioEngine';
import StrobeVisualizer from './StrobeVisualizer';

const Player = ({ user }) => {
  const { presetId } = useParams();
  const navigate = useNavigate();
  const { 
    presets, 
    currentPreset, 
    currentSession,
    isPlaying,
    startSession,
    stopSession,
    createPreset,
    updateSession
  } = useApp();

  const [selectedPreset, setSelectedPreset] = useState(null);
  const [customSettings, setCustomSettings] = useState({
    name: '',
    base_frequency: 528,
    beat_frequency: 40,
    light_frequency: 10,
    duration: 20,
    category: 'Personalizado',
    dimension: 'Personalizado'
  });
  const [sessionTime, setSessionTime] = useState(0);
  const [showPhotosensitiveWarning, setShowPhotosensitiveWarning] = useState(true);
  const [enableStrobe, setEnableStrobe] = useState(false);
  const [preMoodScore, setPreMoodScore] = useState(5);
  const [postMoodScore, setPostMoodScore] = useState(5);
  const [sessionNotes, setSessionNotes] = useState('');
  const [showEndSessionDialog, setShowEndSessionDialog] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [showCustomControls, setShowCustomControls] = useState(false);
  const [analyserData, setAnalyserData] = useState(null);

  const audioEngineRef = useRef(null);
  const timerRef = useRef(null);
  const animationRef = useRef(null);

  // Inicializar preset
  useEffect(() => {
    if (presetId && presetId !== 'custom') {
      const preset = presets.find(p => p.id === parseInt(presetId));
      if (preset) {
        setSelectedPreset(preset);
        setCustomSettings({
          ...customSettings,
          base_frequency: preset.base_frequency,
          beat_frequency: preset.beat_frequency,
          light_frequency: preset.light_frequency,
          duration: preset.duration
        });
      }
    } else if (presetId === 'custom') {
      setSelectedPreset(null);
      setShowCustomControls(true);
    }
  }, [presetId, presets]);

  // Timer da sessão
  useEffect(() => {
    if (isPlaying && currentSession) {
      timerRef.current = setInterval(() => {
        setSessionTime(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPlaying, currentSession]);

  // Inicializar AudioEngine
  useEffect(() => {
    audioEngineRef.current = new AudioEngine();
    
    return () => {
      if (audioEngineRef.current) {
        audioEngineRef.current.dispose();
      }
    };
  }, []);

  // Animação do analisador
  useEffect(() => {
    if (isPlaying && audioEngineRef.current) {
      const updateAnalyser = () => {
        const data = audioEngineRef.current.getAnalyserData();
        setAnalyserData(data);
        animationRef.current = requestAnimationFrame(updateAnalyser);
      };
      updateAnalyser();
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying]);

  const handlePlay = async () => {
    if (!audioEngineRef.current) return;

    const settings = selectedPreset || customSettings;

    try {
      if (!isPlaying) {
        // Iniciar sessão
        const sessionInfo = await audioEngineRef.current.start(settings);
        await startSession(settings);
        setSessionTime(0);
      } else {
        // Pausar
        await audioEngineRef.current.pause();
      }
    } catch (error) {
      console.error('Erro ao controlar áudio:', error);
      alert('Erro ao controlar o áudio. Verifique se o navegador permite reprodução de áudio.');
    }
  };

  const handleStop = async () => {
    if (audioEngineRef.current) {
      await audioEngineRef.current.stop();
    }
    
    if (currentSession) {
      setShowEndSessionDialog(true);
    }
  };

  const handleEndSession = async () => {
    try {
      await stopSession();
      setShowEndSessionDialog(false);
      setSessionTime(0);
      setSessionNotes('');
      setPostMoodScore(5);
    } catch (error) {
      console.error('Erro ao finalizar sessão:', error);
    }
  };

  const handleVolumeChange = (newVolume) => {
    setVolume(newVolume);
    if (audioEngineRef.current) {
      audioEngineRef.current.setVolume(newVolume);
    }
  };

  const handleFrequencyChange = (type, value) => {
    const newSettings = { ...customSettings, [type]: value };
    setCustomSettings(newSettings);
    
    if (isPlaying && audioEngineRef.current) {
      audioEngineRef.current.updateFrequencies(
        newSettings.base_frequency,
        newSettings.beat_frequency
      );
    }
  };

  const handleSaveCustomPreset = async () => {
    if (!customSettings.name.trim()) {
      alert('Por favor, digite um nome para o preset');
      return;
    }

    try {
      await createPreset(customSettings);
      alert('Preset personalizado salvo com sucesso!');
      setCustomSettings({ ...customSettings, name: '' });
    } catch (error) {
      console.error('Erro ao salvar preset:', error);
      alert('Erro ao salvar preset');
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getDimensionIcon = (dimension) => {
    switch (dimension) {
      case '3D': return <Zap className="w-5 h-5" />;
      case '4D': return <Heart className="w-5 h-5" />;
      case '5D': return <Sparkles className="w-5 h-5" />;
      default: return <Brain className="w-5 h-5" />;
    }
  };

  const getDimensionColor = (dimension) => {
    switch (dimension) {
      case '3D': return 'from-blue-500 to-cyan-500';
      case '4D': return 'from-purple-500 to-pink-500';
      case '5D': return 'from-yellow-400 to-orange-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const dismissPhotosensitiveWarning = () => {
    setShowPhotosensitiveWarning(false);
    setEnableStrobe(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 pb-20">
      <div className="max-w-md mx-auto p-4">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="bg-white/10 backdrop-blur-md p-2 rounded-full border border-white/20 hover:bg-white/20 transition-all duration-200"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              {selectedPreset && (
                <div className={`w-6 h-6 rounded-full bg-gradient-to-r ${getDimensionColor(selectedPreset.dimension)} flex items-center justify-center`}>
                  {getDimensionIcon(selectedPreset.dimension)}
                </div>
              )}
              <h1 className="text-xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-yellow-300">
                {selectedPreset ? selectedPreset.name : 'Sessão Personalizada'}
              </h1>
            </div>
            <p className="text-purple-200 text-sm">
              {selectedPreset ? selectedPreset.description : 'Configure suas frequências'}
            </p>
          </div>
        </div>

        {/* Aviso Fotossensível */}
        {showPhotosensitiveWarning && (
          <div className="bg-yellow-500/20 backdrop-blur-md border border-yellow-400/30 rounded-xl p-4 mb-6">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-yellow-300 font-semibold mb-2">Aviso Importante</h3>
                <p className="text-yellow-200 text-sm mb-4">
                  Este aplicativo utiliza luzes estroboscópicas que podem causar convulsões em pessoas 
                  com epilepsia fotossensível. Se você tem histórico de epilepsia ou sensibilidade à luz, 
                  não use a visualização estroboscópica.
                </p>
                <div className="flex space-x-2">
                  <button
                    onClick={dismissPhotosensitiveWarning}
                    className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Entendi, continuar
                  </button>
                  <button
                    onClick={() => setShowPhotosensitiveWarning(false)}
                    className="bg-white/10 hover:bg-white/20 text-yellow-200 px-4 py-2 rounded-lg text-sm border border-yellow-400/30 transition-colors"
                  >
                    Usar apenas áudio
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Visualização Estroboscópica */}
        {enableStrobe && (
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 mb-6">
            <StrobeVisualizer 
              frequency={customSettings.light_frequency}
              isActive={isPlaying}
            />
          </div>
        )}

        {/* Visualização de Áudio */}
        {analyserData && (
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 mb-6">
            <h3 className="text-white font-semibold mb-3 flex items-center space-x-2">
              <Activity className="w-5 h-5" />
              <span>Visualização de Áudio</span>
            </h3>
            <div className="h-20 flex items-end space-x-1">
              {Array.from(analyserData).slice(0, 32).map((value, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-t from-purple-500 to-yellow-400 rounded-t"
                  style={{
                    height: `${(value / 255) * 100}%`,
                    width: '8px',
                    minHeight: '2px'
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Controles Principais */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 mb-6">
          {/* Timer da Sessão */}
          {currentSession && (
            <div className="text-center mb-6">
              <div className="text-3xl font-mono text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-yellow-300 mb-2">
                {formatTime(sessionTime)}
              </div>
              <p className="text-purple-200 text-sm">Tempo de sessão</p>
            </div>
          )}

          {/* Informações do Preset */}
          <div className="grid grid-cols-3 gap-4 mb-6 text-center">
            <div>
              <p className="text-purple-400 text-xs">Base</p>
              <p className="text-white font-semibold">{customSettings.base_frequency}Hz</p>
            </div>
            <div>
              <p className="text-purple-400 text-xs">Beat</p>
              <p className="text-white font-semibold">{customSettings.beat_frequency}Hz</p>
            </div>
            <div>
              <p className="text-purple-400 text-xs">Luz</p>
              <p className="text-white font-semibold">{customSettings.light_frequency}Hz</p>
            </div>
          </div>

          {/* Controles de Volume */}
          <div className="mb-6">
            <div className="flex items-center space-x-3 mb-2">
              <Volume2 className="w-5 h-5 text-purple-300" />
              <span className="text-white text-sm">Volume</span>
              <span className="text-purple-300 text-sm">{Math.round(volume * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
              className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>

          {/* Botões de Controle */}
          <div className="flex space-x-3">
            <button
              onClick={handlePlay}
              className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white py-3 px-6 rounded-lg flex items-center justify-center space-x-2 transition-all duration-200 hover:scale-105"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              <span>{isPlaying ? 'Pausar' : 'Iniciar'}</span>
            </button>
            <button
              onClick={handleStop}
              className="bg-white/10 hover:bg-white/20 text-white py-3 px-6 rounded-lg flex items-center justify-center border border-white/20 transition-all duration-200"
            >
              <Square className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShowCustomControls(!showCustomControls)}
              className="bg-white/10 hover:bg-white/20 text-white py-3 px-6 rounded-lg flex items-center justify-center border border-white/20 transition-all duration-200"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Controles Personalizados */}
        {showCustomControls && (
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 mb-6">
            <h3 className="text-white font-semibold mb-4 flex items-center space-x-2">
              <Settings className="w-5 h-5" />
              <span>Controles Avançados</span>
            </h3>

            {/* Frequência Base */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <label className="text-purple-300 text-sm">Frequência Base</label>
                <span className="text-white text-sm">{customSettings.base_frequency}Hz</span>
              </div>
              <input
                type="range"
                min="100"
                max="1000"
                step="1"
                value={customSettings.base_frequency}
                onChange={(e) => handleFrequencyChange('base_frequency', parseInt(e.target.value))}
                className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>

            {/* Frequência de Batida */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <label className="text-purple-300 text-sm">Frequência de Batida</label>
                <span className="text-white text-sm">{customSettings.beat_frequency}Hz</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="100"
                step="0.1"
                value={customSettings.beat_frequency}
                onChange={(e) => handleFrequencyChange('beat_frequency', parseFloat(e.target.value))}
                className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>

            {/* Frequência de Luz */}
            {enableStrobe && (
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-purple-300 text-sm">Frequência de Luz</label>
                  <span className="text-white text-sm">{customSettings.light_frequency}Hz</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="30"
                  step="0.1"
                  value={customSettings.light_frequency}
                  onChange={(e) => handleFrequencyChange('light_frequency', parseFloat(e.target.value))}
                  className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>
            )}

            {/* Salvar Preset Personalizado */}
            {!selectedPreset && (
              <div className="border-t border-white/20 pt-4">
                <input
                  type="text"
                  placeholder="Nome do preset personalizado"
                  value={customSettings.name}
                  onChange={(e) => setCustomSettings({ ...customSettings, name: e.target.value })}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 mb-3"
                />
                <button
                  onClick={handleSaveCustomPreset}
                  className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black py-2 px-4 rounded-lg flex items-center justify-center space-x-2 transition-all duration-200 font-medium"
                >
                  <Save className="w-4 h-4" />
                  <span>Salvar Preset</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Avaliação Pré-Sessão */}
        {!currentSession && (
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
            <h3 className="text-white font-semibold mb-4">Como você se sente agora?</h3>
            <div className="mb-3">
              <div className="flex justify-between items-center mb-2">
                <label className="text-purple-300 text-sm">Humor atual</label>
                <span className="text-white text-sm">{preMoodScore}/10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                step="1"
                value={preMoodScore}
                onChange={(e) => setPreMoodScore(parseInt(e.target.value))}
                className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>
            <div className="flex justify-between text-xs text-purple-300">
              <span>Muito mal</span>
              <span>Excelente</span>
            </div>
          </div>
        )}
      </div>

      {/* Dialog de Fim de Sessão */}
      {showEndSessionDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 w-full max-w-md">
            <h3 className="text-white font-semibold mb-4">Finalizar Sessão</h3>
            
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <label className="text-purple-300 text-sm">Como você se sente agora?</label>
                <span className="text-white text-sm">{postMoodScore}/10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                step="1"
                value={postMoodScore}
                onChange={(e) => setPostMoodScore(parseInt(e.target.value))}
                className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>
            
            <div className="mb-6">
              <label className="text-purple-300 text-sm block mb-2">Notas da sessão (opcional)</label>
              <textarea
                value={sessionNotes}
                onChange={(e) => setSessionNotes(e.target.value)}
                placeholder="Como foi sua experiência?"
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none"
                rows="3"
              />
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleEndSession}
                className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white py-2 px-4 rounded-lg transition-all duration-200"
              >
                Finalizar
              </button>
              <button
                onClick={() => setShowEndSessionDialog(false)}
                className="bg-white/10 hover:bg-white/20 text-white py-2 px-4 rounded-lg border border-white/20 transition-all duration-200"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Player;

