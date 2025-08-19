import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, Play, Star, Clock, Zap, Heart, Brain, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

const Explore = ({ user }) => {
  const { presets, loadPresets, presetsLoading, startSession, setCurrentView } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDimension, setSelectedDimension] = useState('Todas');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    if (presets.length === 0) {
      loadPresets();
    }
  }, []);

  // Filtrar presets
  const filteredPresets = presets.filter(preset => {
    const matchesSearch = preset.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         preset.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDimension = selectedDimension === 'Todas' || preset.dimension === selectedDimension;
    const matchesCategory = selectedCategory === 'Todas' || preset.category === selectedCategory;
    
    return matchesSearch && matchesDimension && matchesCategory;
  });

  // Obter dimensões e categorias únicas
  const dimensions = ['Todas', ...new Set(presets.map(p => p.dimension))];
  const categories = ['Todas', ...new Set(presets.map(p => p.category))];

  const handlePlayPreset = async (preset) => {
    try {
      await startSession(preset);
      setCurrentView('player');
    } catch (error) {
      console.error('Erro ao iniciar sessão:', error);
    }
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

  if (presetsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-400 to-yellow-400 rounded-full flex items-center justify-center animate-pulse">
            <div className="w-12 h-12 bg-purple-900 rounded-full flex items-center justify-center">
              <div className="w-6 h-6 bg-gradient-to-br from-purple-300 to-yellow-300 rounded-full"></div>
            </div>
          </div>
          <p className="text-purple-200">Carregando presets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 pb-20">
      <div className="max-w-md mx-auto p-4">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-yellow-300 mb-2">
            Explorar Presets
          </h1>
          <p className="text-purple-200 text-sm">
            Descubra frequências para diferentes dimensões de consciência
          </p>
        </div>

        {/* Barra de Pesquisa */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-300 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar presets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent backdrop-blur-md"
          />
        </div>

        {/* Filtros */}
        <div className="flex space-x-2 mb-6 overflow-x-auto">
          {/* Filtro de Dimensão */}
          <select
            value={selectedDimension}
            onChange={(e) => setSelectedDimension(e.target.value)}
            className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 backdrop-blur-md"
          >
            {dimensions.map(dim => (
              <option key={dim} value={dim} className="bg-purple-900 text-white">
                {dim}
              </option>
            ))}
          </select>

          {/* Filtro de Categoria */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 backdrop-blur-md"
          >
            {categories.map(cat => (
              <option key={cat} value={cat} className="bg-purple-900 text-white">
                {cat}
              </option>
            ))}
          </select>

          {/* Botão Criar Preset */}
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>Criar</span>
          </button>
        </div>

        {/* Lista de Presets */}
        <div className="space-y-4">
          {filteredPresets.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-white/10 rounded-full flex items-center justify-center">
                <Search className="w-8 h-8 text-purple-300" />
              </div>
              <p className="text-purple-200 mb-2">Nenhum preset encontrado</p>
              <p className="text-purple-300 text-sm">
                Tente ajustar os filtros ou criar um novo preset
              </p>
            </div>
          ) : (
            filteredPresets.map((preset) => (
              <div
                key={preset.id}
                className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20 hover:bg-white/15 transition-all duration-200"
              >
                {/* Header do Preset */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <div className={`w-6 h-6 rounded-full bg-gradient-to-r ${getDimensionColor(preset.dimension)} flex items-center justify-center`}>
                        {getDimensionIcon(preset.dimension)}
                      </div>
                      <h3 className="text-white font-semibold">{preset.name}</h3>
                      {preset.is_custom && (
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      )}
                    </div>
                    <p className="text-purple-200 text-sm mb-2">{preset.description}</p>
                    
                    {/* Tags */}
                    <div className="flex items-center space-x-2 text-xs">
                      <span className={`px-2 py-1 rounded-full bg-gradient-to-r ${getDimensionColor(preset.dimension)} text-white font-medium`}>
                        {preset.dimension}
                      </span>
                      <span className="px-2 py-1 rounded-full bg-white/20 text-purple-200">
                        {preset.category}
                      </span>
                      {preset.duration && (
                        <div className="flex items-center space-x-1 text-purple-300">
                          <Clock className="w-3 h-3" />
                          <span>{preset.duration}min</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Botão Play */}
                  <button
                    onClick={() => handlePlayPreset(preset)}
                    className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white p-3 rounded-full transition-all duration-200 hover:scale-105"
                  >
                    <Play className="w-5 h-5" />
                  </button>
                </div>

                {/* Informações Técnicas */}
                <div className="grid grid-cols-3 gap-2 text-xs text-purple-300">
                  <div>
                    <span className="block text-purple-400">Base</span>
                    <span>{preset.base_frequency}Hz</span>
                  </div>
                  <div>
                    <span className="block text-purple-400">Beat</span>
                    <span>{preset.beat_frequency}Hz</span>
                  </div>
                  <div>
                    <span className="block text-purple-400">Luz</span>
                    <span>{preset.light_frequency}Hz</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Estatísticas */}
        <div className="mt-8 bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20">
          <h3 className="text-white font-semibold mb-3">Estatísticas</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="block text-purple-400">Total de Presets</span>
              <span className="text-white font-medium">{presets.length}</span>
            </div>
            <div>
              <span className="block text-purple-400">Presets Personalizados</span>
              <span className="text-white font-medium">
                {presets.filter(p => p.is_custom).length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Criar Preset (placeholder) */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 w-full max-w-md">
            <h3 className="text-white font-semibold mb-4">Criar Novo Preset</h3>
            <p className="text-purple-200 text-sm mb-4">
              Funcionalidade em desenvolvimento...
            </p>
            <button
              onClick={() => setShowCreateModal(false)}
              className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white py-2 px-4 rounded-lg transition-all duration-200"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Explore;

