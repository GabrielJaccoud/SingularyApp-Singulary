import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Play, Compass, TrendingUp, Clock, Zap, Heart, Sparkles, Brain,
  Calendar, BarChart3, Star, ChevronRight 
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const Home = ({ user }) => {
  const navigate = useNavigate();
  const { sessions, presets, loadSessions, loadPresets } = useApp();
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    // Carregar dados se necessário
    if (sessions.length === 0) loadSessions();
    if (presets.length === 0) loadPresets();

    // Definir saudação baseada no horário
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Bom dia');
    else if (hour < 18) setGreeting('Boa tarde');
    else setGreeting('Boa noite');
  }, []);

  // Sessões de hoje
  const todaysSessions = sessions.filter(session => {
    const today = new Date().toDateString();
    const sessionDate = new Date(session.start_time).toDateString();
    return today === sessionDate;
  });

  // Estatísticas gerais
  const totalSessions = sessions.length;
  const totalMinutes = Math.floor(sessions.reduce((acc, s) => acc + (s.duration || 0), 0) / 60);
  const todayMinutes = Math.floor(todaysSessions.reduce((acc, s) => acc + (s.duration || 0), 0) / 60);

  // Preset recomendado (baseado em uso recente ou padrão)
  const getRecommendedPreset = () => {
    if (sessions.length > 0) {
      // Encontrar o preset mais usado
      const presetUsage = {};
      sessions.forEach(session => {
        presetUsage[session.preset_id] = (presetUsage[session.preset_id] || 0) + 1;
      });
      const mostUsedPresetId = Object.keys(presetUsage).reduce((a, b) => 
        presetUsage[a] > presetUsage[b] ? a : b
      );
      return presets.find(p => p.id === parseInt(mostUsedPresetId));
    }
    // Preset padrão para novos usuários
    return presets.find(p => p.dimension === '3D' && p.category === 'Foco') || presets[0];
  };

  const recommendedPreset = getRecommendedPreset();

  // Dimensões desbloqueadas (baseado em sessões realizadas)
  const unlockedDimensions = [...new Set(
    sessions.map(s => {
      const preset = presets.find(p => p.id === s.preset_id);
      return preset?.dimension;
    }).filter(Boolean)
  )];

  const getDimensionIcon = (dimension) => {
    switch (dimension) {
      case '3D': return <Zap className="w-6 h-6" />;
      case '4D': return <Heart className="w-6 h-6" />;
      case '5D': return <Sparkles className="w-6 h-6" />;
      default: return <Brain className="w-6 h-6" />;
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

  const quickActions = [
    {
      title: 'Explorar Dimensões',
      description: 'Descubra novas frequências',
      icon: <Compass className="w-8 h-8" />,
      action: () => navigate('/explore'),
      gradient: 'from-purple-500 to-blue-500'
    },
    {
      title: 'Sessão Rápida',
      description: 'Comece agora mesmo',
      icon: <Play className="w-8 h-8" />,
      action: () => navigate('/player'),
      gradient: 'from-green-500 to-teal-500'
    },
    {
      title: 'Meu Histórico',
      description: 'Veja seu progresso',
      icon: <BarChart3 className="w-8 h-8" />,
      action: () => navigate('/history'),
      gradient: 'from-yellow-500 to-orange-500'
    },
    {
      title: 'Jornada Pessoal',
      description: 'Sua evolução',
      icon: <TrendingUp className="w-8 h-8" />,
      action: () => navigate('/journey'),
      gradient: 'from-pink-500 to-purple-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 pb-20">
      <div className="max-w-md mx-auto p-4">
        {/* Header com Logo e Saudação */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-purple-400 to-yellow-400 rounded-full flex items-center justify-center">
            <div className="w-16 h-16 bg-purple-900 rounded-full flex items-center justify-center">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-300 to-yellow-300 rounded-full"></div>
            </div>
          </div>
          <h1 className="text-2xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-yellow-300 mb-2">
            {greeting}, {user?.name || 'Explorador'}
          </h1>
          <p className="text-purple-200 text-sm">
            Bem-vindo ao seu Ressonador Quântico Pessoal
          </p>
        </div>

        {/* Estatísticas de Hoje */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 mb-6">
          <h2 className="text-white font-semibold mb-4 flex items-center space-x-2">
            <Calendar className="w-5 h-5" />
            <span>Sua Jornada de Hoje</span>
          </h2>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-yellow-300">
                {todaysSessions.length}
              </div>
              <div className="text-purple-200 text-sm">Sessões</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-yellow-300">
                {todayMinutes}
              </div>
              <div className="text-purple-200 text-sm">Minutos</div>
            </div>
          </div>

          {/* Preset Recomendado */}
          {recommendedPreset && (
            <div className="border-t border-white/20 pt-4">
              <p className="text-purple-300 text-sm mb-3">Recomendado para você:</p>
              <div 
                className="bg-white/10 rounded-lg p-3 cursor-pointer hover:bg-white/15 transition-all duration-200"
                onClick={() => navigate(`/player/${recommendedPreset.id}`)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${getDimensionColor(recommendedPreset.dimension)} flex items-center justify-center`}>
                      {getDimensionIcon(recommendedPreset.dimension)}
                    </div>
                    <div>
                      <p className="text-white font-medium">{recommendedPreset.name}</p>
                      <p className="text-purple-200 text-sm">{recommendedPreset.dimension} • {recommendedPreset.category}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-purple-300" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Ações Rápidas */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {quickActions.map((action, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 cursor-pointer hover:bg-white/15 transition-all duration-200 hover:scale-105"
              onClick={action.action}
            >
              <div className={`w-12 h-12 mx-auto mb-3 bg-gradient-to-r ${action.gradient} rounded-full flex items-center justify-center text-white`}>
                {action.icon}
              </div>
              <h3 className="text-white font-semibold text-center text-sm mb-1">
                {action.title}
              </h3>
              <p className="text-purple-200 text-xs text-center">
                {action.description}
              </p>
            </div>
          ))}
        </div>

        {/* Progresso Geral */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 mb-6">
          <h2 className="text-white font-semibold mb-4 flex items-center space-x-2">
            <TrendingUp className="w-5 h-5" />
            <span>Seu Progresso</span>
          </h2>
          
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-yellow-300">
                {totalSessions}
              </div>
              <div className="text-purple-200 text-xs">Total Sessões</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-yellow-300">
                {totalMinutes}
              </div>
              <div className="text-purple-200 text-xs">Total Minutos</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-yellow-300">
                {unlockedDimensions.length}
              </div>
              <div className="text-purple-200 text-xs">Dimensões</div>
            </div>
          </div>
        </div>

        {/* Dimensões Desbloqueadas */}
        {unlockedDimensions.length > 0 && (
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 mb-6">
            <h2 className="text-white font-semibold mb-4 flex items-center space-x-2">
              <Star className="w-5 h-5" />
              <span>Dimensões Desbloqueadas</span>
            </h2>
            
            <div className="flex space-x-3 overflow-x-auto">
              {unlockedDimensions.map(dimension => (
                <div
                  key={dimension}
                  className={`flex-shrink-0 w-16 h-16 bg-gradient-to-r ${getDimensionColor(dimension)} rounded-full flex items-center justify-center text-white`}
                >
                  {getDimensionIcon(dimension)}
                </div>
              ))}
            </div>
            
            <p className="text-purple-200 text-sm mt-3">
              Continue explorando para desbloquear mais dimensões!
            </p>
          </div>
        )}

        {/* Mensagem Motivacional */}
        <div className="bg-gradient-to-r from-purple-600/20 to-yellow-500/20 backdrop-blur-md rounded-xl p-4 border border-white/20">
          <div className="text-center">
            <h3 className="text-white font-semibold mb-2">
              {totalSessions === 0 ? '🌟 Comece sua jornada!' : '✨ Continue evoluindo!'}
            </h3>
            <p className="text-purple-200 text-sm">
              {totalSessions === 0 
                ? 'Descubra o poder das frequências binaurais e transforme sua consciência.'
                : `Você já percorreu ${totalMinutes} minutos de evolução. Que tal explorar uma nova dimensão?`
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

