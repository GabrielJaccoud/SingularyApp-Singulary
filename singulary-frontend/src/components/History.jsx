import React, { useState, useEffect } from 'react';
import { 
  Calendar, Clock, TrendingUp, Download, Filter, BarChart3, 
  Zap, Heart, Sparkles, Brain, ChevronDown, ChevronUp 
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const History = ({ user }) => {
  const { sessions, presets, loadSessions } = useApp();
  const [filterDimension, setFilterDimension] = useState('Todas');
  const [filterPeriod, setFilterPeriod] = useState('Todas');
  const [expandedSession, setExpandedSession] = useState(null);
  const [showStats, setShowStats] = useState(true);

  useEffect(() => {
    if (sessions.length === 0) {
      loadSessions();
    }
  }, []);

  // Filtros
  const dimensions = ['Todas', '3D', '4D', '5D', 'Personalizado'];
  const periods = ['Todas', 'Hoje', 'Esta Semana', 'Este Mês', 'Últimos 3 Meses'];

  // Filtrar sessões
  const filteredSessions = sessions.filter(session => {
    const preset = presets.find(p => p.id === session.preset_id);
    const sessionDate = new Date(session.start_time);
    const now = new Date();

    // Filtro por dimensão
    const dimensionMatch = filterDimension === 'Todas' || 
      (preset && preset.dimension === filterDimension) ||
      (filterDimension === 'Personalizado' && (!preset || preset.is_custom));

    // Filtro por período
    let periodMatch = true;
    if (filterPeriod === 'Hoje') {
      periodMatch = sessionDate.toDateString() === now.toDateString();
    } else if (filterPeriod === 'Esta Semana') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      periodMatch = sessionDate >= weekAgo;
    } else if (filterPeriod === 'Este Mês') {
      periodMatch = sessionDate.getMonth() === now.getMonth() && 
                   sessionDate.getFullYear() === now.getFullYear();
    } else if (filterPeriod === 'Últimos 3 Meses') {
      const threeMonthsAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      periodMatch = sessionDate >= threeMonthsAgo;
    }

    return dimensionMatch && periodMatch;
  });

  // Estatísticas
  const totalSessions = filteredSessions.length;
  const totalMinutes = Math.floor(filteredSessions.reduce((acc, s) => acc + (s.duration || 0), 0) / 60);
  const averageMoodImprovement = filteredSessions
    .filter(s => s.pre_mood_score && s.post_mood_score)
    .reduce((acc, s) => acc + (s.post_mood_score - s.pre_mood_score), 0) / 
    filteredSessions.filter(s => s.pre_mood_score && s.post_mood_score).length || 0;

  const averageSessionLength = totalSessions > 0 ? 
    Math.floor(filteredSessions.reduce((acc, s) => acc + (s.duration || 0), 0) / totalSessions / 60) : 0;

  // Estatísticas por dimensão
  const dimensionStats = dimensions.slice(1).map(dim => {
    const dimSessions = filteredSessions.filter(s => {
      const preset = presets.find(p => p.id === s.preset_id);
      return (preset && preset.dimension === dim) || 
             (dim === 'Personalizado' && (!preset || preset.is_custom));
    });
    return {
      dimension: dim,
      count: dimSessions.length,
      totalTime: Math.floor(dimSessions.reduce((acc, s) => acc + (s.duration || 0), 0) / 60)
    };
  });

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDimensionIcon = (dimension) => {
    switch (dimension) {
      case '3D': return <Zap className="w-4 h-4" />;
      case '4D': return <Heart className="w-4 h-4" />;
      case '5D': return <Sparkles className="w-4 h-4" />;
      default: return <Brain className="w-4 h-4" />;
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

  const exportData = () => {
    const csvContent = [
      ['Data', 'Preset', 'Dimensão', 'Duração (min)', 'Humor Antes', 'Humor Depois', 'Notas'].join(','),
      ...filteredSessions.map(session => {
        const preset = presets.find(p => p.id === session.preset_id);
        return [
          formatDate(session.start_time),
          preset?.name || 'Personalizado',
          preset?.dimension || 'Personalizado',
          Math.floor((session.duration || 0) / 60),
          session.pre_mood_score || '',
          session.post_mood_score || '',
          `"${session.notes || ''}"`
        ].join(',');
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `singulary-sessions-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 pb-20">
      <div className="max-w-md mx-auto p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-yellow-300 mb-2">
              Histórico
            </h1>
            <p className="text-purple-200 text-sm">
              Acompanhe sua evolução e padrões
            </p>
          </div>
          <button
            onClick={exportData}
            className="bg-white/10 backdrop-blur-md p-2 rounded-lg border border-white/20 hover:bg-white/20 transition-all duration-200"
          >
            <Download className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Filtros */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 mb-6">
          <div className="flex items-center space-x-2 mb-4">
            <Filter className="w-5 h-5 text-purple-300" />
            <span className="text-white font-semibold">Filtros</span>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-purple-300 text-sm block mb-2">Dimensão</label>
              <select
                value={filterDimension}
                onChange={(e) => setFilterDimension(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
              >
                {dimensions.map(dim => (
                  <option key={dim} value={dim} className="bg-purple-900 text-white">
                    {dim}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-purple-300 text-sm block mb-2">Período</label>
              <select
                value={filterPeriod}
                onChange={(e) => setFilterPeriod(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
              >
                {periods.map(period => (
                  <option key={period} value={period} className="bg-purple-900 text-white">
                    {period}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Estatísticas Principais */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 text-center">
            <Calendar className="w-8 h-8 mx-auto mb-2 text-purple-300" />
            <div className="text-2xl font-bold text-white">{totalSessions}</div>
            <div className="text-xs text-purple-300">Sessões</div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 text-center">
            <Clock className="w-8 h-8 mx-auto mb-2 text-purple-300" />
            <div className="text-2xl font-bold text-white">{totalMinutes}</div>
            <div className="text-xs text-purple-300">Minutos</div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 text-center">
            <TrendingUp className="w-8 h-8 mx-auto mb-2 text-purple-300" />
            <div className="text-2xl font-bold text-white">
              {averageMoodImprovement > 0 ? '+' : ''}{averageMoodImprovement.toFixed(1)}
            </div>
            <div className="text-xs text-purple-300">Humor Médio</div>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 text-center">
            <BarChart3 className="w-8 h-8 mx-auto mb-2 text-purple-300" />
            <div className="text-2xl font-bold text-white">{averageSessionLength}</div>
            <div className="text-xs text-purple-300">Min/Sessão</div>
          </div>
        </div>

        {/* Estatísticas por Dimensão */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">Estatísticas por Dimensão</h3>
            <button
              onClick={() => setShowStats(!showStats)}
              className="text-purple-300 hover:text-white transition-colors"
            >
              {showStats ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
          </div>
          
          {showStats && (
            <div className="space-y-3">
              {dimensionStats.map(stat => (
                <div key={stat.dimension} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={`w-6 h-6 rounded-full bg-gradient-to-r ${getDimensionColor(stat.dimension)} flex items-center justify-center`}>
                      {getDimensionIcon(stat.dimension)}
                    </div>
                    <span className="text-white text-sm">{stat.dimension}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-white text-sm font-medium">{stat.count} sessões</div>
                    <div className="text-purple-300 text-xs">{stat.totalTime}min total</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Lista de Sessões */}
        <div className="space-y-4">
          {filteredSessions.length === 0 ? (
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 border border-white/20 text-center">
              <Calendar className="w-16 h-16 mx-auto mb-4 text-purple-300" />
              <h3 className="text-white font-semibold mb-2">Nenhuma sessão encontrada</h3>
              <p className="text-purple-200 text-sm">
                Ajuste os filtros ou comece uma nova sessão
              </p>
            </div>
          ) : (
            filteredSessions.map(session => {
              const preset = presets.find(p => p.id === session.preset_id);
              const moodChange = session.post_mood_score && session.pre_mood_score ? 
                session.post_mood_score - session.pre_mood_score : null;
              const isExpanded = expandedSession === session.id;

              return (
                <div key={session.id} className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 overflow-hidden">
                  <div 
                    className="p-4 cursor-pointer hover:bg-white/5 transition-all duration-200"
                    onClick={() => setExpandedSession(isExpanded ? null : session.id)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          {preset && (
                            <div className={`w-5 h-5 rounded-full bg-gradient-to-r ${getDimensionColor(preset.dimension)} flex items-center justify-center`}>
                              {getDimensionIcon(preset.dimension)}
                            </div>
                          )}
                          <h3 className="text-white font-semibold">
                            {preset?.name || 'Sessão Personalizada'}
                          </h3>
                          {preset && (
                            <span className={`px-2 py-1 rounded-full bg-gradient-to-r ${getDimensionColor(preset.dimension)} text-white text-xs font-medium`}>
                              {preset.dimension}
                            </span>
                          )}
                        </div>
                        <p className="text-purple-200 text-sm">
                          {formatDate(session.start_time)}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-white font-medium">
                          {formatDuration(session.duration || 0)}
                        </div>
                        {moodChange !== null && (
                          <div className={`text-sm ${
                            moodChange > 0 ? 'text-green-400' : 
                            moodChange < 0 ? 'text-red-400' : 'text-purple-300'
                          }`}>
                            {moodChange > 0 ? '+' : ''}{moodChange.toFixed(1)} humor
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-xs text-purple-300">
                        {session.pre_mood_score && (
                          <span>Antes: {session.pre_mood_score}/10</span>
                        )}
                        {session.post_mood_score && (
                          <span>Depois: {session.post_mood_score}/10</span>
                        )}
                      </div>
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-purple-300" /> : <ChevronDown className="w-4 h-4 text-purple-300" />}
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="border-t border-white/20 p-4 bg-white/5">
                      {session.notes && (
                        <div className="mb-4">
                          <h4 className="text-purple-300 text-sm font-medium mb-2">Notas da Sessão</h4>
                          <p className="text-white text-sm bg-white/10 rounded-lg p-3">
                            "{session.notes}"
                          </p>
                        </div>
                      )}

                      {preset && (
                        <div>
                          <h4 className="text-purple-300 text-sm font-medium mb-2">Configurações Técnicas</h4>
                          <div className="grid grid-cols-3 gap-4 text-xs">
                            <div className="text-center">
                              <div className="text-purple-400">Base</div>
                              <div className="text-white font-medium">{preset.base_frequency}Hz</div>
                            </div>
                            <div className="text-center">
                              <div className="text-purple-400">Beat</div>
                              <div className="text-white font-medium">{preset.beat_frequency}Hz</div>
                            </div>
                            <div className="text-center">
                              <div className="text-purple-400">Luz</div>
                              <div className="text-white font-medium">{preset.light_frequency}Hz</div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Resumo Final */}
        {totalSessions > 0 && (
          <div className="mt-8 bg-gradient-to-r from-purple-600/20 to-yellow-500/20 backdrop-blur-md rounded-xl p-4 border border-white/20">
            <h3 className="text-white font-semibold mb-2">Resumo do Período</h3>
            <p className="text-purple-200 text-sm">
              Você completou <strong>{totalSessions}</strong> sessões, totalizando <strong>{totalMinutes}</strong> minutos 
              de terapia sonora. {averageMoodImprovement > 0 && (
                <>Seu humor melhorou em média <strong>{averageMoodImprovement.toFixed(1)}</strong> pontos por sessão.</>
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default History;

