
import React, { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { UserRole } from '../types';

interface RegisterScreenProps {
  onNavigateToLogin: () => void;
  onNavigateToVerify: (email: string) => void;
}

const RegisterScreen: React.FC<RegisterScreenProps> = ({ onNavigateToLogin, onNavigateToVerify }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: UserRole.Student,
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [verificationToken, setVerificationToken] = useState<string | null>(null);
    const { registerUser, users } = useData();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setVerificationToken(null);

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long.');
            return;
        }
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        if (users.some(u => u.email === formData.email)) {
            setError('An account with this email already exists.');
            return;
        }
        
        setLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
            const { confirmPassword, ...userData } = formData;
            const token = registerUser(userData);
            setVerificationToken(token);
            setSuccess(`Registration successful! We've "sent" a verification code to your email. Please use the code below to verify your account.`);
        } catch (e) {
            setError('Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-primary">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-2xl m-4">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900">Create Account</h1>
                    <p className="mt-2 text-sm text-gray-600">Join the GDC Kukatpally community</p>
                </div>

                {success ? (
                    <div className="text-center space-y-4">
                        <p className="text-sm text-green-600">{success}</p>
                        {verificationToken && (
                        <div className="p-3 bg-gray-100 rounded-md">
                            <p className="text-sm text-gray-500">Your verification code is:</p>
                            <p className="text-2xl font-bold tracking-widest text-gray-800">{verificationToken}</p>
                        </div>
                        )}
                        <button
                        onClick={() => onNavigateToVerify(formData.email)}
                        className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-brand-primary hover:bg-brand-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                        Proceed to Verification
                        </button>
                    </div>
                ) : (
                    <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="name" className="sr-only">Full Name</label>
                            <input id="name" name="name" type="text" required value={formData.name} onChange={handleChange} className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Full Name"/>
                        </div>
                        <div>
                            <label htmlFor="email" className="sr-only">Email address</label>
                            <input id="email" name="email" type="email" required value={formData.email} onChange={handleChange} className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Email address"/>
                        </div>
                        <div>
                            <label htmlFor="role" className="sr-only">Role</label>
                            <select id="role" name="role" required value={formData.role} onChange={handleChange} className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                                <option value={UserRole.Student}>Register as Student</option>
                                <option value={UserRole.Lecturer}>Register as Lecturer</option>
                                <option value={UserRole.HOD}>Register as HOD</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="password-reg" className="sr-only">Password</label>
                            <input id="password-reg" name="password" type="password" required value={formData.password} onChange={handleChange} className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Password"/>
                        </div>
                        <div>
                            <label htmlFor="confirmPassword" className="sr-only">Confirm Password</label>
                            <input id="confirmPassword" name="confirmPassword" type="password" required value={formData.confirmPassword} onChange={handleChange} className="appearance-none rounded-md relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" placeholder="Confirm Password"/>
                        </div>

                        {error && <p className="text-sm text-red-600 text-center">{error}</p>}

                        <div>
                            <button type="submit" disabled={loading} className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-brand-primary to-brand-secondary hover:from-brand-secondary hover:to-brand-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
                                {loading ? 'Registering...' : 'Register'}
                            </button>
                        </div>
                    </form>
                )}

                <div className="text-center mt-4">
                    <p className="text-sm text-gray-600">
                        Already have an account?{' '}
                        <button onClick={onNavigateToLogin} className="font-medium text-brand-primary hover:text-brand-secondary">
                            Login here
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterScreen;