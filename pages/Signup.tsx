import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useToast } from '../contexts/ToastContext';

interface SignupProps {
  setPage: (page: 'landing' | 'login') => void;
}

const Signup: React.FC<SignupProps> = ({ setPage }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      addToast('Account created! Please complete your profile.', 'success');
      // AuthContext will detect the new user and redirect to CompleteProfile
    } catch (error: any) {
      addToast(error.message, 'error');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-800 rounded-lg p-8 border border-slate-700 shadow-2xl shadow-cyan-500/10">
        <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white">Create Your Account</h1>
            <p className="text-slate-400">Join the AI revolution in auto sales.</p>
        </div>
        <form onSubmit={handleSignup} className="space-y-6">
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
              minLength={6}
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 rounded-lg disabled:bg-slate-600"
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>
        <p className="text-center text-sm text-slate-400 mt-6">
          Already have an account?{' '}
          <button onClick={() => setPage('login')} className="font-medium text-cyan-400 hover:underline">
            Log in
          </button>
        </p>
      </div>
    </div>
  );
};

export default Signup;