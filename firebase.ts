// FIX: Aligned Firebase imports with the rest of the application (using 'firebase/*' instead of '@firebase/*').
// This resolves a module mismatch where two different instances of the Firestore SDK were being loaded,
// causing errors when functions from one module were used with instances from the other.
// FIX: Corrected Firebase v9 import style to use named function imports instead of a namespace.
// FIX: The namespace import for 'firebase/app' was incorrect. Switched to named function imports for Firebase v9 compatibility.
import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDWYoY-XWp4HPQutYvhg1spC-pUmc6EeMI",
  authDomain: "vibe-coding-of-aug-platform.firebaseapp.com",
  projectId: "vibe-coding-of-aug-platform",
  storageBucket: "vibe-coding-of-aug-platform.firebasestorage.app",
  messagingSenderId: "548671767449",
  appId: "1:548671767449:web:026ffd5417d35eb0a2c908",
  measurementId: "G-WZTF728085"
};

// Initialize Firebase robustly, preventing re-initialization errors in development.
// FIX: Correctly call modular Firebase v9 functions for app initialization.
// FIX: Switched from an incorrect namespace-based call to direct function calls for Firebase initialization.
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };