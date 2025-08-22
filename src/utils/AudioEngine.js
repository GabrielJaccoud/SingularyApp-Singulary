class AudioEngine {
  constructor() {
    this.audioContext = null;
    this.leftOscillator = null;
    this.rightOscillator = null;
    this.leftGain = null;
    this.rightGain = null;
    this.merger = null;
    this.masterGain = null;
    this.analyser = null;
    this.lfo = null; // Low Frequency Oscillator para modulação
    this.isInitialized = false;
    this.isPlaying = false;
    this.currentPreset = null;
    this.sessionStartTime = null;
    this.fadeInDuration = 3; // segundos
    this.fadeOutDuration = 2; // segundos
    this.maxVolume = 0.6; // Volume máximo para segurança
    this.safetyTimer = null;
    this.maxSessionDuration = 3600000; // 1 hora em ms
  }

  async initialize() {
    if (this.isInitialized) return;

    try {
      // Verificar suporte do navegador
      if (!window.AudioContext && !window.webkitAudioContext) {
        throw new Error('Web Audio API não é suportada neste navegador');
      }

      // Criar contexto de áudio
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      // Aguardar contexto estar pronto
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }

      // Criar nós de áudio
      this.leftOscillator = this.audioContext.createOscillator();
      this.rightOscillator = this.audioContext.createOscillator();
      
      this.leftGain = this.audioContext.createGain();
      this.rightGain = this.audioContext.createGain();
      this.masterGain = this.audioContext.createGain();
      
      // Criar analisador para visualização
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 256;
      this.analyser.smoothingTimeConstant = 0.8;
      
      // Criar merger para separar canais esquerdo e direito
      this.merger = this.audioContext.createChannelMerger(2);

      // Configurar osciladores
      this.leftOscillator.type = 'sine';
      this.rightOscillator.type = 'sine';

      // Configurar ganho inicial (começar em 0 para fade in)
      this.leftGain.gain.value = 0.3;
      this.rightGain.gain.value = 0.3;
      this.masterGain.gain.value = 0;

      // Conectar nós
      this.leftOscillator.connect(this.leftGain);
      this.rightOscillator.connect(this.rightGain);
      
      this.leftGain.connect(this.merger, 0, 0); // Canal esquerdo
      this.rightGain.connect(this.merger, 0, 1); // Canal direito
      
      this.merger.connect(this.masterGain);
      this.masterGain.connect(this.analyser);
      this.analyser.connect(this.audioContext.destination);

      this.isInitialized = true;
      console.log('AudioEngine inicializado com sucesso');
    } catch (error) {
      console.error('Erro ao inicializar AudioEngine:', error);
      throw new Error('Não foi possível inicializar o áudio. Verifique se o navegador suporta Web Audio API.');
    }
  }

  async start(preset) {
    if (!this.isInitialized) {
      await this.initialize();
    }

    if (this.isPlaying) {
      await this.stop();
      await this.initialize();
    }

    try {
      this.currentPreset = preset;
      this.sessionStartTime = Date.now();

      // Extrair frequências do preset
      const baseFrequency = preset.base_frequency || 528;
      const beatFrequency = preset.beat_frequency || 40;
      const lightFrequency = preset.light_frequency || 10;

      // Validar frequências para segurança
      if (baseFrequency < 20 || baseFrequency > 2000) {
        throw new Error('Frequência base fora do range seguro (20-2000 Hz)');
      }
      if (beatFrequency < 0.5 || beatFrequency > 100) {
        throw new Error('Frequência de batida fora do range seguro (0.5-100 Hz)');
      }

      // Calcular frequências para batida binaural
      const leftFreq = baseFrequency;
      const rightFreq = baseFrequency + beatFrequency;

      // Configurar frequências
      this.leftOscillator.frequency.setValueAtTime(leftFreq, this.audioContext.currentTime);
      this.rightOscillator.frequency.setValueAtTime(rightFreq, this.audioContext.currentTime);

      // Fade in suave para evitar cliques
      this.masterGain.gain.setValueAtTime(0, this.audioContext.currentTime);
      this.masterGain.gain.linearRampToValueAtTime(
        this.maxVolume, 
        this.audioContext.currentTime + this.fadeInDuration
      );

      // Iniciar osciladores
      this.leftOscillator.start(this.audioContext.currentTime);
      this.rightOscillator.start(this.audioContext.currentTime);

      // Configurar timer de segurança
      this.safetyTimer = setTimeout(() => {
        console.warn('Sessão atingiu duração máxima, parando automaticamente');
        this.stop();
      }, this.maxSessionDuration);

      this.isPlaying = true;
      console.log(`Sessão iniciada: ${leftFreq}Hz (L) / ${rightFreq}Hz (R) - Beat: ${beatFrequency}Hz`);
      
      return {
        leftFrequency: leftFreq,
        rightFrequency: rightFreq,
        beatFrequency: beatFrequency,
        lightFrequency: lightFrequency
      };
    } catch (error) {
      console.error('Erro ao iniciar reprodução:', error);
      throw error;
    }
  }

  async pause() {
    if (!this.isPlaying || !this.masterGain) return;

    // Fade out temporário
    this.masterGain.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 0.5);
    
    setTimeout(() => {
      if (this.audioContext) {
        this.audioContext.suspend();
      }
    }, 500);
  }

  async resume() {
    if (!this.audioContext || this.audioContext.state !== 'suspended') return;

    await this.audioContext.resume();
    
    // Fade in de volta
    this.masterGain.gain.linearRampToValueAtTime(
      this.maxVolume, 
      this.audioContext.currentTime + 0.5
    );
  }

  async stop() {
    if (!this.isInitialized) return;

    try {
      // Limpar timer de segurança
      if (this.safetyTimer) {
        clearTimeout(this.safetyTimer);
        this.safetyTimer = null;
      }

      // Fade out suave
      if (this.masterGain) {
        this.masterGain.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + this.fadeOutDuration);
      }

      // Parar osciladores após fade out
      setTimeout(() => {
        try {
          if (this.leftOscillator) {
            this.leftOscillator.stop();
            this.leftOscillator = null;
          }
          if (this.rightOscillator) {
            this.rightOscillator.stop();
            this.rightOscillator = null;
          }
          if (this.lfo) {
            this.lfo.stop();
            this.lfo = null;
          }
        } catch (e) {
          // Ignorar erros de osciladores já parados
        }
        
        this.isPlaying = false;
        this.isInitialized = false;
        this.currentPreset = null;
        this.sessionStartTime = null;
        
        console.log('Sessão finalizada');
      }, this.fadeOutDuration * 1000);
    } catch (error) {
      console.error('Erro ao parar reprodução:', error);
      this.isPlaying = false;
      this.isInitialized = false;
    }
  }

  setVolume(volume) {
    // Limitar volume para segurança
    const safeVolume = Math.min(Math.max(volume, 0), this.maxVolume);
    
    if (this.masterGain) {
      this.masterGain.gain.linearRampToValueAtTime(
        safeVolume, 
        this.audioContext.currentTime + 0.1
      );
    }
  }

  updateFrequencies(baseFrequency, beatFrequency) {
    if (!this.isPlaying || !this.leftOscillator || !this.rightOscillator) return;

    // Validar frequências
    if (baseFrequency < 20 || baseFrequency > 2000) return;
    if (beatFrequency < 0.5 || beatFrequency > 100) return;

    const leftFreq = baseFrequency;
    const rightFreq = baseFrequency + beatFrequency;

    // Transição suave para novas frequências
    this.leftOscillator.frequency.linearRampToValueAtTime(
      leftFreq, 
      this.audioContext.currentTime + 1
    );
    this.rightOscillator.frequency.linearRampToValueAtTime(
      rightFreq, 
      this.audioContext.currentTime + 1
    );

    console.log(`Frequências atualizadas: ${leftFreq}Hz (L) / ${rightFreq}Hz (R)`);
  }

  // Método para criar tons isocrônicos (pulsos rítmicos)
  async startIsochronic(frequency = 528, pulseFrequency = 10) {
    if (!this.isInitialized) {
      await this.initialize();
    }

    if (this.isPlaying) {
      await this.stop();
      await this.initialize();
    }

    try {
      // Configurar oscilador principal
      this.leftOscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
      this.rightOscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);

      // Criar oscilador de baixa frequência para modulação
      this.lfo = this.audioContext.createOscillator();
      const lfoGain = this.audioContext.createGain();
      
      this.lfo.frequency.setValueAtTime(pulseFrequency, this.audioContext.currentTime);
      this.lfo.type = 'square';
      
      lfoGain.gain.setValueAtTime(0.5, this.audioContext.currentTime);
      
      // Conectar modulação
      this.lfo.connect(lfoGain);
      lfoGain.connect(this.masterGain.gain);

      // Fade in
      this.masterGain.gain.setValueAtTime(0, this.audioContext.currentTime);
      this.masterGain.gain.linearRampToValueAtTime(this.maxVolume, this.audioContext.currentTime + this.fadeInDuration);

      // Iniciar
      this.leftOscillator.start(this.audioContext.currentTime);
      this.rightOscillator.start(this.audioContext.currentTime);
      this.lfo.start(this.audioContext.currentTime);

      this.isPlaying = true;
      console.log(`Tons isocrônicos iniciados: ${frequency}Hz com pulsos de ${pulseFrequency}Hz`);
    } catch (error) {
      console.error('Erro ao iniciar tons isocrônicos:', error);
      throw error;
    }
  }

  getAnalyserData() {
    if (!this.analyser) return null;

    const bufferLength = this.analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    this.analyser.getByteFrequencyData(dataArray);
    return dataArray;
  }

  getTimeDomainData() {
    if (!this.analyser) return null;

    const bufferLength = this.analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    this.analyser.getByteTimeDomainData(dataArray);
    return dataArray;
  }

  // Obter informações da sessão atual
  getSessionInfo() {
    if (!this.isPlaying || !this.sessionStartTime) return null;

    const duration = Date.now() - this.sessionStartTime;
    const remainingTime = this.maxSessionDuration - duration;

    return {
      preset: this.currentPreset,
      duration: Math.floor(duration / 1000), // em segundos
      remainingTime: Math.max(0, Math.floor(remainingTime / 1000)), // em segundos
      isPlaying: this.isPlaying,
      volume: this.masterGain ? this.masterGain.gain.value : 0
    };
  }

  // Verificar se o áudio está funcionando
  isAudioWorking() {
    return this.audioContext && this.audioContext.state === 'running' && this.isPlaying;
  }

  // Limpar recursos
  dispose() {
    this.stop();
    
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
    
    this.isInitialized = false;
    console.log('AudioEngine descartado');
  }
}

export default AudioEngine;

