import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useToast } from '../contexts/ToastContext';

interface LoginProps {
  setPage: (page: 'landing' | 'signup') => void;
}

const Login: React.FC<LoginProps> = ({ setPage }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      addToast('Successfully logged in!', 'success');
      // No need to setPage, AuthContext will handle the redirect
    } catch (error: any) {
      addToast(error.message, 'error');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-800 rounded-lg p-8 border border-slate-700 shadow-2xl shadow-cyan-500/10">
        <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
            <p className="text-slate-400">Log in to access your AI advantage.</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2" htmlFor="email">Email</label>
            <input 
              type="email" 
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-900 text-white p-3 rounded-md border border-slate-600 focus:ring-2 focus:ring-cyan-500"
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2" htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-900 text-white p-3 rounded-md border border-slate-600 focus:ring-2 focus:ring-cyan-500"
              required 
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 rounded-lg disabled:bg-slate-600"
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>
        <p className="text-center text-sm text-slate-400 mt-6">
          Don't have an account?{' '}
          <button onClick={() => setPage('signup')} className="font-medium text-cyan-400 hover:underline">
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;