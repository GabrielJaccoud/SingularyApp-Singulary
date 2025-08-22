import React from 'react';
import { AppProvider } from './context/AppContext';
import AuthWrapper from './components/auth/AuthWrapper';
import SingularyApp from './components/SingularyApp';
import './App.css';

function App() {
  return (
    <AppProvider>
      <AuthWrapper>
        <SingularyApp />
      </AuthWrapper>
    </AppProvider>
  );
}

export default App;

