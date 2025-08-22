import React, { useState, useEffect } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import { apiRequest } from '../../config/api';

const AuthWrapper = ({ children, onAuthSuccess }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authMode, setAuthMode] = useState('login'); // 'login' ou 'register'

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('singulary_token');
      const userData = localStorage.getItem('singulary_user');

      if (!token || !userData) {
        setLoading(false);
        return;
      }

      // Verificar se o token ainda é válido
      const response = await apiRequest('/auth/verify', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.valid) {
        setUser(response.user);
        setIsAuthenticated(true);
        onAuthSuccess?.(response.user, token);
      } else {
        // Token inválido, limpar dados
        localStorage.removeItem('singulary_token');
        localStorage.removeItem('singulary_user');
      }
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
      // Em caso de erro, limpar dados
      localStorage.removeItem('singulary_token');
      localStorage.removeItem('singulary_user');
    } finally {
      setLoading(false);
    }
  };

  const handleAuthSuccess = (userData, token) => {
    setUser(userData);
    setIsAuthenticated(true);
    onAuthSuccess?.(userData, token);
  };

  const handleLogout = () => {
    localStorage.removeItem('singulary_token');
    localStorage.removeItem('singulary_user');
    setUser(null);
    setIsAuthenticated(false);
  };

  // Mostrar loading enquanto verifica autenticação
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-400 to-yellow-400 rounded-full flex items-center justify-center animate-pulse">
            <div className="w-12 h-12 bg-purple-900 rounded-full flex items-center justify-center">
              <div className="w-6 h-6 bg-gradient-to-br from-purple-300 to-yellow-300 rounded-full"></div>
            </div>
          </div>
          <h1 className="text-3xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-yellow-300 mb-2">
            Singulary
          </h1>
          <p className="text-purple-200 text-sm">Carregando...</p>
        </div>
      </div>
    );
  }

  // Se não estiver autenticado, mostrar telas de login/registro
  if (!isAuthenticated) {
    if (authMode === 'register') {
      return (
        <RegisterForm
          onRegisterSuccess={handleAuthSuccess}
          onSwitchToLogin={() => setAuthMode('login')}
        />
      );
    }

    return (
      <LoginForm
        onLoginSuccess={handleAuthSuccess}
        onSwitchToRegister={() => setAuthMode('register')}
      />
    );
  }

  // Se estiver autenticado, renderizar o app principal
  return React.cloneElement(children, { user, onLogout: handleLogout });
};

export default AuthWrapper;

