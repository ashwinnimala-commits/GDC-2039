
import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';

interface VerificationScreenProps {
  email: string;
  onNavigateToLogin: () => void;
}

const VerificationScreen: React.FC<VerificationScreenProps> = ({ email, onNavigateToLogin }) => {
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { verifyUser } = useData();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    
    const result = await verifyUser(email, token);

    if (result === 'success') {
      setSuccess('Email verified successfully! Your account is now pending administrator approval. You will be able to log in once approved.');
    } else if (result === 'invalid_token') {
      setError('Invalid verification code. Please check and try again.');
    } else {
      setError('An error occurred. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-primary">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-2xl m-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Verify Your Email</h1>
          <p className="mt-2 text-sm text-gray-600">
            A 6-digit verification code has been "sent" to <span className="font-medium">{email}</span>. Please enter it below.
          </p>
        </div>
        
        {success ? (
          <div className="text-center space-y-4">
            <p className="text-green-600">{success}</p>
            <button
              onClick={onNavigateToLogin}
              className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-brand-primary hover:bg-brand-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Back to Login
            </button>
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            <div>
              <input
                id="token"
                name="token"
                type="text"
                maxLength={6}
                required
                className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-center tracking-[0.5em]"
                placeholder="______"
                value={token}
                onChange={(e) => setToken(e.target.value)}
              />
            </div>

            {error && <p className="text-sm text-red-600 text-center">{error}</p>}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-brand-primary to-brand-secondary hover:from-brand-secondary hover:to-brand-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {loading ? 'Verifying...' : 'Verify Account'}
              </button>
            </div>
          </form>
        )}
        
        <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
                Wrong account?{' '}
                <button onClick={onNavigateToLogin} className="font-medium text-brand-primary hover:text-brand-secondary">
                    Back to Login
                </button>
            </p>
        </div>
      </div>
    </div>
  );
};

export default VerificationScreen;
