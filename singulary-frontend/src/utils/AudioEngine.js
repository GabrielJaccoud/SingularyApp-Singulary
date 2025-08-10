class AudioEngine {
  constructor() {
    this.audioContext = null
    this.leftOscillator = null
    this.rightOscillator = null
    this.leftGain = null
    this.rightGain = null
    this.merger = null
    this.masterGain = null
    this.isInitialized = false
    this.isPlaying = false
  }

  async initialize() {
    if (this.isInitialized) return

    try {
      // Criar contexto de áudio
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)()
      
      // Aguardar contexto estar pronto
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume()
      }

      // Criar nós de áudio
      this.leftOscillator = this.audioContext.createOscillator()
      this.rightOscillator = this.audioContext.createOscillator()
      
      this.leftGain = this.audioContext.createGain()
      this.rightGain = this.audioContext.createGain()
      this.masterGain = this.audioContext.createGain()
      
      // Criar merger para separar canais esquerdo e direito
      this.merger = this.audioContext.createChannelMerger(2)

      // Configurar osciladores
      this.leftOscillator.type = 'sine'
      this.rightOscillator.type = 'sine'

      // Configurar ganho inicial
      this.leftGain.gain.value = 0.3
      this.rightGain.gain.value = 0.3
      this.masterGain.gain.value = 0.5

      // Conectar nós
      this.leftOscillator.connect(this.leftGain)
      this.rightOscillator.connect(this.rightGain)
      
      this.leftGain.connect(this.merger, 0, 0) // Canal esquerdo
      this.rightGain.connect(this.merger, 0, 1) // Canal direito
      
      this.merger.connect(this.masterGain)
      this.masterGain.connect(this.audioContext.destination)

      this.isInitialized = true
    } catch (error) {
      console.error('Erro ao inicializar AudioEngine:', error)
      throw new Error('Não foi possível inicializar o áudio. Verifique se o navegador suporta Web Audio API.')
    }
  }

  async start(baseFrequency = 528, beatFrequency = 40) {
    if (!this.isInitialized) {
      await this.initialize()
    }

    if (this.isPlaying) {
      this.stop()
      await this.initialize()
    }

    try {
      // Calcular frequências para batida binaural
      const leftFreq = baseFrequency
      const rightFreq = baseFrequency + beatFrequency

      // Configurar frequências
      this.leftOscillator.frequency.setValueAtTime(leftFreq, this.audioContext.currentTime)
      this.rightOscillator.frequency.setValueAtTime(rightFreq, this.audioContext.currentTime)

      // Fade in suave
      this.masterGain.gain.setValueAtTime(0, this.audioContext.currentTime)
      this.masterGain.gain.linearRampToValueAtTime(0.5, this.audioContext.currentTime + 2)

      // Iniciar osciladores
      this.leftOscillator.start(this.audioContext.currentTime)
      this.rightOscillator.start(this.audioContext.currentTime)

      this.isPlaying = true
    } catch (error) {
      console.error('Erro ao iniciar reprodução:', error)
      throw error
    }
  }

  pause() {
    if (!this.isPlaying || !this.masterGain) return

    // Fade out
    this.masterGain.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 0.5)
    
    setTimeout(() => {
      this.isPlaying = false
    }, 500)
  }

  stop() {
    if (!this.isInitialized) return

    try {
      // Fade out suave
      if (this.masterGain) {
        this.masterGain.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 1)
      }

      // Parar osciladores após fade out
      setTimeout(() => {
        if (this.leftOscillator) {
          this.leftOscillator.stop()
          this.leftOscillator = null
        }
        if (this.rightOscillator) {
          this.rightOscillator.stop()
          this.rightOscillator = null
        }
        
        this.isPlaying = false
        this.isInitialized = false
      }, 1000)
    } catch (error) {
      console.error('Erro ao parar reprodução:', error)
      this.isPlaying = false
      this.isInitialized = false
    }
  }

  setVolume(volume) {
    if (this.masterGain) {
      this.masterGain.gain.setValueAtTime(volume, this.audioContext.currentTime)
    }
  }

  updateFrequencies(baseFrequency, beatFrequency) {
    if (!this.isPlaying || !this.leftOscillator || !this.rightOscillator) return

    const leftFreq = baseFrequency
    const rightFreq = baseFrequency + beatFrequency

    // Transição suave para novas frequências
    this.leftOscillator.frequency.linearRampToValueAtTime(
      leftFreq, 
      this.audioContext.currentTime + 0.5
    )
    this.rightOscillator.frequency.linearRampToValueAtTime(
      rightFreq, 
      this.audioContext.currentTime + 0.5
    )
  }

  // Método para criar tons isocrônicos (pulsos rítmicos)
  async startIsochronic(frequency = 528, pulseFrequency = 10) {
    if (!this.isInitialized) {
      await this.initialize()
    }

    if (this.isPlaying) {
      this.stop()
      await this.initialize()
    }

    try {
      // Configurar oscilador principal
      this.leftOscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime)
      this.rightOscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime)

      // Criar oscilador de baixa frequência para modulação
      const lfo = this.audioContext.createOscillator()
      const lfoGain = this.audioContext.createGain()
      
      lfo.frequency.setValueAtTime(pulseFrequency, this.audioContext.currentTime)
      lfo.type = 'square'
      
      lfoGain.gain.setValueAtTime(0.5, this.audioContext.currentTime)
      
      // Conectar modulação
      lfo.connect(lfoGain)
      lfoGain.connect(this.masterGain.gain)

      // Iniciar
      this.leftOscillator.start(this.audioContext.currentTime)
      this.rightOscillator.start(this.audioContext.currentTime)
      lfo.start(this.audioContext.currentTime)

      this.isPlaying = true
    } catch (error) {
      console.error('Erro ao iniciar tons isocrônicos:', error)
      throw error
    }
  }

  getAnalyserData() {
    if (!this.audioContext || !this.masterGain) return null

    const analyser = this.audioContext.createAnalyser()
    this.masterGain.connect(analyser)
    
    analyser.fftSize = 256
    const bufferLength = analyser.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)
    
    analyser.getByteFrequencyData(dataArray)
    return dataArray
  }
}

export default AudioEngine

