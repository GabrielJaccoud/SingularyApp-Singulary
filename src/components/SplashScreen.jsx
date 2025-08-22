import { useEffect, useState } from 'react'
import logoSingulary from '../assets/LogoSingularyemTonsGradientes.png'

export default function SplashScreen() {
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true)
    }, 2500)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className={`fixed inset-0 singulary-gradient flex items-center justify-center transition-opacity duration-500 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}>
      <div className="text-center">
        <div className="logo-container mx-auto mb-6 animate-pulse">
          <img 
            src={logoSingulary} 
            alt="Singulary Logo" 
            className="w-16 h-16 object-contain"
          />
        </div>
        
        <h1 className="text-3xl font-bold text-primary mb-2">
          Singulary
        </h1>
        
        <p className="text-lg text-muted-foreground mb-8">
          Conectando você ao seu potencial e além...
        </p>
        
        <div className="flex justify-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    </div>
  )
}

