import React, { useState } from 'react';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

const CompleteProfile: React.FC = () => {
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      addToast('You must be logged in.', 'error');
      return;
    }
    setLoading(true);
    try {
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        displayName,
        bio,
        createdAt: serverTimestamp(),
      });
      addToast('Profile completed successfully!', 'success');
      // AuthContext will detect the profile and redirect to Dashboard
    } catch (error: any) {
      addToast(error.message, 'error');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-800 rounded-lg p-8 border border-slate-700 shadow-2xl shadow-cyan-500/10">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">Complete Your Profile</h1>
          <p className="text-slate-400">Just a few more details to get you started.</p>
        </div>
        <form onSubmit={handleProfileSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2" htmlFor="displayName">Display Name</label>
            <input 
              type="text" 
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full bg-slate-900 text-white p-3 rounded-md border border-slate-600 focus:ring-2 focus:ring-cyan-500"
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2" htmlFor="bio">Bio / Role</label>
            <textarea 
              id="bio" 
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="e.g., Sales Manager at Augusta Motors"
              className="w-full bg-slate-900 text-white p-3 rounded-md border border-slate-600 focus:ring-2 focus:ring-cyan-500"
              required 
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 rounded-lg disabled:bg-slate-600"
          >
            {loading ? 'Saving...' : 'Save Profile'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CompleteProfile;