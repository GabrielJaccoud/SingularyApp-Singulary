import { useEffect, useRef } from 'react'

export default function StrobeVisualizer({ frequency, isActive }) {
  const canvasRef = useRef(null)
  const animationRef = useRef(null)
  const lastFlashRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    let isFlashing = false
    const flashDuration = 50 // ms

    const animate = (timestamp) => {
      if (!isActive) {
        ctx.fillStyle = '#1C2B4A'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        return
      }

      const interval = 1000 / frequency // ms entre flashes
      
      if (timestamp - lastFlashRef.current >= interval) {
        isFlashing = true
        lastFlashRef.current = timestamp
        setTimeout(() => {
          isFlashing = false
        }, flashDuration)
      }

      // Criar gradiente radial
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2
      const radius = Math.min(canvas.width, canvas.height) / 2

      const gradient = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, radius
      )

      if (isFlashing) {
        // Flash branco/dourado
        gradient.addColorStop(0, 'rgba(255, 215, 0, 0.9)')
        gradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.7)')
        gradient.addColorStop(0.6, 'rgba(216, 199, 232, 0.5)')
        gradient.addColorStop(1, 'rgba(28, 43, 74, 0.8)')
      } else {
        // Estado normal - tons suaves
        gradient.addColorStop(0, 'rgba(216, 199, 232, 0.3)')
        gradient.addColorStop(0.5, 'rgba(28, 43, 74, 0.2)')
        gradient.addColorStop(1, 'rgba(28, 43, 74, 0.8)')
      }

      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Adicionar padrões geométricos sutis
      if (isFlashing) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)'
        ctx.lineWidth = 2
        
        // Círculos concêntricos
        for (let i = 1; i <= 3; i++) {
          ctx.beginPath()
          ctx.arc(centerX, centerY, (radius / 3) * i, 0, Math.PI * 2)
          ctx.stroke()
        }
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    if (isActive) {
      animationRef.current = requestAnimationFrame(animate)
    } else {
      ctx.fillStyle = '#1C2B4A'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [frequency, isActive])

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        className="strobe-canvas w-full h-48 bg-primary/10"
      />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center text-white/80">
          <div className="text-sm font-medium">
            Visualização Estroboscópica
          </div>
          <div className="text-xs">
            {frequency}Hz • {isActive ? 'Ativo' : 'Pausado'}
          </div>
        </div>
      </div>
    </div>
  )
}

