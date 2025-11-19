
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { DEMO_USERS, COLLEGE_LOGO_URL } from '../constants';
import { UserRole } from '../types';

interface LoginScreenProps {
  onNavigateToRegister: () => void;
  onNavigateToVerify: (email: string) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onNavigateToRegister, onNavigateToVerify }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(email, password);
    if (result === 'invalid') {
      setError('Invalid credentials.');
    } else if (result === 'pending') {
      setError('Your account is pending administrator approval.');
    } else if (result === 'unverified') {
      setError('Your email is not verified.');
    }
    setLoading(false);
  };
  
  const autofill = (role: UserRole) => {
    const user = DEMO_USERS.find(u => u.role === role);
    if(user){
      setEmail(user.email);
      setPassword(user.password || '');
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-primary">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-2xl m-4">
        <div className="text-center">
            <img src={COLLEGE_LOGO_URL} alt="College Logo" className="w-24 h-24 mx-auto mb-4 rounded-full object-cover shadow-md"/>
          <h1 className="text-3xl font-bold text-gray-900">GDC Kukatpally</h1>
          <p className="mt-3 text-sm font-serif italic font-semibold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-600 tracking-wider">
            "Quality learning within everyone’s reach"
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && <p className="text-sm text-red-600 text-center">{error}</p>}
          {error === 'Your email is not verified.' && (
            <div className="text-center mt-2">
                <button onClick={() => onNavigateToVerify(email)} className="font-medium text-sm text-brand-primary hover:text-brand-secondary">
                    Click here to verify your email
                </button>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-brand-primary to-brand-secondary hover:from-brand-secondary hover:to-brand-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
         <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <button onClick={onNavigateToRegister} className="font-medium text-brand-primary hover:text-brand-secondary">
                Register here
                </button>
            </p>
        </div>
         <div className="mt-6">
            <p className="text-center text-sm font-medium text-gray-700 mb-2">Demo Logins (Tap to Autofill)</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                {DEMO_USERS.map(user => (
                    <button key={user.id} onClick={() => autofill(user.role)} className="p-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-center">
                        <span className="font-bold block">{user.role}</span>
                        <span>{user.email.split('@')[0]}</span>
                    </button>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
