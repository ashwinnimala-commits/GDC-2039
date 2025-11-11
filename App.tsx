
import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import LoginScreen from './screens/LoginScreen';
import Dashboard from './screens/Dashboard';
import RegisterScreen from './screens/RegisterScreen';
import VerificationScreen from './screens/VerificationScreen';

const App: React.FC = () => {
  return (
    <DataProvider>
      <AuthProvider>
        <Main />
      </AuthProvider>
    </DataProvider>
  );
};

const Main: React.FC = () => {
  const { user } = useAuth();
  const [currentView, setCurrentView] = useState<'login' | 'register' | 'verify'>('login');
  const [emailForVerification, setEmailForVerification] = useState<string>('');

  const navigateToRegister = () => setCurrentView('register');
  const navigateToLogin = () => setCurrentView('login');
  const navigateToVerify = (email: string) => {
    setEmailForVerification(email);
    setCurrentView('verify');
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200">
      {user ? (
        <Dashboard />
      ) : currentView === 'register' ? (
        <RegisterScreen onNavigateToLogin={navigateToLogin} onNavigateToVerify={navigateToVerify} />
      ) : currentView === 'verify' ? (
        <VerificationScreen email={emailForVerification} onNavigateToLogin={navigateToLogin} />
      ) : (
        <LoginScreen onNavigateToRegister={navigateToRegister} onNavigateToVerify={navigateToVerify} />
      )}
    </div>
  );
};

export default App;