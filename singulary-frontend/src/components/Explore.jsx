import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Play, Plus, Filter } from 'lucide-react'

export default function Explore() {
  const navigate = useNavigate()
  const { presets } = useApp()
  const [selectedDimension, setSelectedDimension] = useState('Todas')
  const [selectedCategory, setSelectedCategory] = useState('Todas')

  const dimensions = ['Todas', '3D', '4D', '5D', 'Personalizado']
  const categories = ['Todas', 'Foco', 'Relaxamento', 'Meditação', 'Sono', 'Espiritual', 'Cura']

  const filteredPresets = presets.filter(preset => {
    const dimensionMatch = selectedDimension === 'Todas' || preset.dimension === selectedDimension
    const categoryMatch = selectedCategory === 'Todas' || preset.category === selectedCategory
    return dimensionMatch && categoryMatch
  })

  const getDimensionColor = (dimension) => {
    switch (dimension) {
      case '3D': return 'bg-blue-100 text-blue-800'
      case '4D': return 'bg-purple-100 text-purple-800'
      case '5D': return 'bg-yellow-100 text-yellow-800'
      case 'Personalizado': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="p-4 pb-20">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-primary mb-2">
          Explorar Dimensões
        </h1>
        <p className="text-muted-foreground">
          Descubra frequências para diferentes estados de consciência
        </p>
      </div>

      {/* Filtros */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Filter size={16} />
          <span className="text-sm font-medium">Dimensões</span>
        </div>
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          {dimensions.map(dimension => (
            <Button
              key={dimension}
              variant={selectedDimension === dimension ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedDimension(dimension)}
              className="whitespace-nowrap"
            >
              {dimension}
            </Button>
          ))}
        </div>

        <div className="flex items-center gap-2 mb-3">
          <Filter size={16} />
          <span className="text-sm font-medium">Categorias</span>
        </div>
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="whitespace-nowrap"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Lista de Presets */}
      <div className="space-y-4 mb-6">
        {filteredPresets.map(preset => (
          <Card key={preset.id} className="glass-card dimension-card">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold">{preset.name}</h3>
                    <Badge className={getDimensionColor(preset.dimension)}>
                      {preset.dimension}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    {preset.description}
                  </p>
                  <div className="flex gap-4 text-xs text-muted-foreground">
                    <span>Base: {preset.baseFrequency}Hz</span>
                    <span>Batida: {preset.beatFrequency}Hz</span>
                    <span>Duração: {preset.duration}min</span>
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={() => navigate(`/player/${preset.id}`)}
                >
                  <Play size={16} />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Botão para criar preset personalizado */}
      <Card className="glass-card">
        <CardContent className="p-4">
          <div className="text-center">
            <Plus size={32} className="mx-auto mb-2 text-muted-foreground" />
            <h3 className="font-semibold mb-1">Criar Preset Personalizado</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Configure suas próprias frequências
            </p>
            <Button 
              variant="outline" 
              onClick={() => navigate('/player/custom')}
            >
              Criar Novo
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

