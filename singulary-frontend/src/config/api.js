// Configuração da API para o Singulary
export const API_CONFIG = {
  BASE_URL: 'http://localhost:5000/api',
  ENDPOINTS: {
    HEALTH: '/health',
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      VERIFY: '/auth/verify',
      REFRESH: '/auth/refresh',
      CHANGE_PASSWORD: '/auth/change-password'
    },
    PRESETS: {
      LIST: '/presets',
      CREATE: '/presets',
      GET: (id) => `/presets/${id}`,
      UPDATE: (id) => `/presets/${id}`,
      DELETE: (id) => `/presets/${id}`,
      SEED: '/presets/seed'
    },
    SESSIONS: {
      LIST: '/sessions',
      CREATE: '/sessions',
      GET: (id) => `/sessions/${id}`,
      UPDATE: (id) => `/sessions/${id}`,
      EXPORT: '/sessions/export',
      EXPORT_SINGLE: (id) => `/sessions/${id}/export`,
      STATS: '/sessions/stats'
    },
    USERS: {
      GET: (id) => `/users/${id}`,
      UPDATE: (id) => `/users/${id}`
    }
  }
};

// Função helper para fazer requisições
export const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_CONFIG.BASE_URL}${endpoint}`;
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  // Adicionar token de autenticação se disponível
  const token = localStorage.getItem('singulary_token');
  if (token) {
    defaultOptions.headers.Authorization = `Bearer ${token}`;
  }

  const finalOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, finalOptions);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
    }

    // Para downloads de CSV, retornar o blob
    if (response.headers.get('content-type')?.includes('text/csv')) {
      return response.blob();
    }

    return await response.json();
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};

export default API_CONFIG;

