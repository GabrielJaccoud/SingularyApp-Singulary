import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { apiRequest, API_CONFIG } from '../config/api';

// Estado inicial
const initialState = {
  user: null,
  isAuthenticated: false,
  currentPreset: null,
  isPlaying: false,
  currentSession: null,
  presets: [],
  sessions: [],
  loading: false,
  error: null,
  currentView: 'home',
  audioEngine: null,
  settings: {
    darkMode: false,
    notifications: true,
    privateData: true,
    volume: 0.5
  }
};

// Reducer para gerenciar estado
const appReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    
    case 'SET_USER':
      return { 
        ...state, 
        user: action.payload, 
        isAuthenticated: !!action.payload 
      };
    
    case 'LOGOUT':
      localStorage.removeItem('singulary_token');
      return { 
        ...state, 
        user: null, 
        isAuthenticated: false,
        sessions: [],
        currentSession: null
      };
    
    case 'SET_PRESETS':
      return { ...state, presets: action.payload };
    
    case 'ADD_PRESET':
      return { 
        ...state, 
        presets: [...state.presets, action.payload] 
      };
    
    case 'UPDATE_PRESET':
      return {
        ...state,
        presets: state.presets.map(preset =>
          preset.id === action.payload.id ? action.payload : preset
        )
      };
    
    case 'DELETE_PRESET':
      return {
        ...state,
        presets: state.presets.filter(preset => preset.id !== action.payload)
      };
    
    case 'SET_CURRENT_PRESET':
      return { ...state, currentPreset: action.payload };
    
    case 'SET_SESSIONS':
      return { ...state, sessions: action.payload };
    
    case 'ADD_SESSION':
      return { 
        ...state, 
        sessions: [action.payload, ...state.sessions] 
      };
    
    case 'UPDATE_SESSION':
      return {
        ...state,
        sessions: state.sessions.map(session =>
          session.id === action.payload.id ? action.payload : session
        ),
        currentSession: state.currentSession?.id === action.payload.id 
          ? action.payload 
          : state.currentSession
      };
    
    case 'SET_CURRENT_SESSION':
      return { ...state, currentSession: action.payload };
    
    case 'SET_PLAYING':
      return { ...state, isPlaying: action.payload };
    
    case 'SET_CURRENT_VIEW':
      return { ...state, currentView: action.payload };
    
    case 'SET_AUDIO_ENGINE':
      return { ...state, audioEngine: action.payload };
    
    case 'UPDATE_SETTINGS':
      return { 
        ...state, 
        settings: { ...state.settings, ...action.payload } 
      };
    
    default:
      return state;
  }
};

// Context
const AppContext = createContext();

// Provider
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Verificar autenticação ao carregar
  useEffect(() => {
    const token = localStorage.getItem('singulary_token');
    if (token) {
      verifyToken();
    }
  }, []);

  // Carregar presets ao autenticar
  useEffect(() => {
    if (state.isAuthenticated) {
      loadPresets();
      loadSessions();
    }
  }, [state.isAuthenticated]);

  // Funções de autenticação
  const login = async (email, password) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const response = await apiRequest(API_CONFIG.ENDPOINTS.AUTH.LOGIN, {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });

      localStorage.setItem('singulary_token', response.token);
      dispatch({ type: 'SET_USER', payload: response.user });
      dispatch({ type: 'CLEAR_ERROR' });
      
      return response;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const register = async (name, email, password) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const response = await apiRequest(API_CONFIG.ENDPOINTS.AUTH.REGISTER, {
        method: 'POST',
        body: JSON.stringify({ name, email, password })
      });

      localStorage.setItem('singulary_token', response.token);
      dispatch({ type: 'SET_USER', payload: response.user });
      dispatch({ type: 'CLEAR_ERROR' });
      
      return response;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const verifyToken = async () => {
    try {
      const response = await apiRequest(API_CONFIG.ENDPOINTS.AUTH.VERIFY, {
        method: 'POST'
      });

      dispatch({ type: 'SET_USER', payload: response.user });
    } catch (error) {
      console.error('Token inválido:', error);
      dispatch({ type: 'LOGOUT' });
    }
  };

  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  // Funções de presets
  const loadPresets = async () => {
    try {
      const userId = state.user?.id;
      const params = userId ? `?user_id=${userId}` : '';
      
      const presets = await apiRequest(`${API_CONFIG.ENDPOINTS.PRESETS.LIST}${params}`);
      dispatch({ type: 'SET_PRESETS', payload: presets });
    } catch (error) {
      console.error('Erro ao carregar presets:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };

  const createPreset = async (presetData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const newPreset = await apiRequest(API_CONFIG.ENDPOINTS.PRESETS.CREATE, {
        method: 'POST',
        body: JSON.stringify({ ...presetData, userId: state.user?.id })
      });

      dispatch({ type: 'ADD_PRESET', payload: newPreset });
      return newPreset;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const updatePreset = async (presetId, presetData) => {
    try {
      const updatedPreset = await apiRequest(API_CONFIG.ENDPOINTS.PRESETS.UPDATE(presetId), {
        method: 'PUT',
        body: JSON.stringify(presetData)
      });

      dispatch({ type: 'UPDATE_PRESET', payload: updatedPreset });
      return updatedPreset;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  const deletePreset = async (presetId) => {
    try {
      await apiRequest(API_CONFIG.ENDPOINTS.PRESETS.DELETE(presetId), {
        method: 'DELETE'
      });

      dispatch({ type: 'DELETE_PRESET', payload: presetId });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  // Funções de sessões
  const loadSessions = async () => {
    try {
      if (!state.user?.id) return;
      
      const sessions = await apiRequest(`${API_CONFIG.ENDPOINTS.SESSIONS.LIST}?user_id=${state.user.id}`);
      dispatch({ type: 'SET_SESSIONS', payload: sessions });
    } catch (error) {
      console.error('Erro ao carregar sessões:', error);
    }
  };

  const createSession = async (sessionData) => {
    try {
      const newSession = await apiRequest(API_CONFIG.ENDPOINTS.SESSIONS.CREATE, {
        method: 'POST',
        body: JSON.stringify({
          ...sessionData,
          userId: state.user?.id,
          startTime: new Date().toISOString()
        })
      });

      dispatch({ type: 'ADD_SESSION', payload: newSession });
      dispatch({ type: 'SET_CURRENT_SESSION', payload: newSession });
      return newSession;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  const updateSession = async (sessionId, sessionData) => {
    try {
      const updatedSession = await apiRequest(API_CONFIG.ENDPOINTS.SESSIONS.UPDATE(sessionId), {
        method: 'PUT',
        body: JSON.stringify(sessionData)
      });

      dispatch({ type: 'UPDATE_SESSION', payload: updatedSession });
      return updatedSession;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  const finishSession = async (sessionId, endData) => {
    try {
      const finishedSession = await updateSession(sessionId, {
        ...endData,
        endTime: new Date().toISOString()
      });

      dispatch({ type: 'SET_CURRENT_SESSION', payload: null });
      return finishedSession;
    } catch (error) {
      throw error;
    }
  };

  // Funções de controle de áudio
  const startSession = async (preset) => {
    try {
      dispatch({ type: 'SET_CURRENT_PRESET', payload: preset });
      
      if (state.user) {
        const session = await createSession({
          presetId: preset.id,
          deviceModel: navigator.userAgent.includes('Mobile') ? 'Mobile Device' : 'Desktop'
        });
        
        dispatch({ type: 'SET_CURRENT_SESSION', payload: session });
      }

      dispatch({ type: 'SET_PLAYING', payload: true });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  const stopSession = async () => {
    try {
      if (state.currentSession && state.user) {
        await finishSession(state.currentSession.id, {
          duration: Math.floor((new Date() - new Date(state.currentSession.startTime)) / 1000)
        });
      }

      dispatch({ type: 'SET_PLAYING', payload: false });
      dispatch({ type: 'SET_CURRENT_PRESET', payload: null });
      dispatch({ type: 'SET_CURRENT_SESSION', payload: null });
    } catch (error) {
      console.error('Erro ao finalizar sessão:', error);
    }
  };

  // Funções utilitárias
  const setCurrentView = (view) => {
    dispatch({ type: 'SET_CURRENT_VIEW', payload: view });
  };

  const setAudioEngine = (engine) => {
    dispatch({ type: 'SET_AUDIO_ENGINE', payload: engine });
  };

  const updateSettings = (newSettings) => {
    dispatch({ type: 'UPDATE_SETTINGS', payload: newSettings });
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  // Valor do contexto
  const value = {
    ...state,
    // Auth
    login,
    register,
    logout,
    // Presets
    loadPresets,
    createPreset,
    updatePreset,
    deletePreset,
    // Sessions
    loadSessions,
    createSession,
    updateSession,
    finishSession,
    // Audio Control
    startSession,
    stopSession,
    // Utils
    setCurrentView,
    setAudioEngine,
    updateSettings,
    clearError
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

// Hook para usar o contexto
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp deve ser usado dentro de AppProvider');
  }
  return context;
};

export default AppContext;

