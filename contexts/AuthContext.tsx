import React, { createContext, useState, useEffect, useContext } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, onSnapshot, Timestamp } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { UserProfile, AppUser } from '../types';

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  profile: UserProfile | null;
  profileLoading: boolean;
}

export const AuthContext = createContext<AuthContextType>({ user: null, loading: true, profile: null, profileLoading: true });

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        // Create a simplified, serializable user object to prevent circular reference errors.
        const simplifiedUser: AppUser = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
        };
        setUser(simplifiedUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
    if (user) {
        setProfileLoading(true);
        const userRef = doc(db, 'users', user.uid);
        unsubscribe = onSnapshot(userRef, (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                // FIX: Convert Firestore Timestamp to a serializable ISO string.
                // This prevents the "circular structure" error when state is serialized.
                const createdAtTimestamp = data.createdAt as Timestamp;
                const serializableProfile: UserProfile = {
                    uid: data.uid,
                    email: data.email,
                    displayName: data.displayName,
                    bio: data.bio,
                    createdAt: createdAtTimestamp ? createdAtTimestamp.toDate().toISOString() : new Date().toISOString(),
                };
                setProfile(serializableProfile);
            } else {
                setProfile(null);
            }
            setProfileLoading(false);
        });
    } else {
        setProfile(null);
        setProfileLoading(false);
    }
    return () => unsubscribe && unsubscribe();
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, loading, profile, profileLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);