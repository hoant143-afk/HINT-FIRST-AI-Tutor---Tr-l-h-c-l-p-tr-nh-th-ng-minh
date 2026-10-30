import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Official Firebase Configuration for project hint-first-ai-tutor (Corrected API key with 'q')
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyC7rkQ8PxQcYvUujO4PkUq_fAbXBg1COSg',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'hint-first-ai-tutor.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'hint-first-ai-tutor',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'hint-first-ai-tutor.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '244410928916',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:244410928916:web:db0f8f5decfd23faa13c01',
};

// Diagnostic info in development (masked API key, length, source, project metadata)
const apiKeyVal = firebaseConfig.apiKey || '';
const apiKeyLength = apiKeyVal.length;
const apiKeyMasked = apiKeyLength > 10 
  ? `${apiKeyVal.substring(0, 6)}...${apiKeyVal.slice(-4)}` 
  : 'INVALID';

console.group('[Firebase Diagnostic Report]');
console.log('Source: Official Firebase Config (Corrected API key with q)');
console.log(`API Key Length: ${apiKeyLength} (Expected 39)`);
console.log(`API Key Masked: ${apiKeyMasked}`);
console.log(`Project ID: ${firebaseConfig.projectId}`);
console.log(`Auth Domain: ${firebaseConfig.authDomain}`);
console.log(`App ID: ${firebaseConfig.appId}`);
console.groupEnd();

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.projectId &&
  firebaseConfig.apiKey !== 'YOUR_API_KEY'
);

let app: any = null;
let auth: any = null;
let db: any = null;
let googleProvider: any = null;

if (isFirebaseConfigured) {
  try {
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    db = getFirestore(app);
    googleProvider = new GoogleAuthProvider();
    console.log('[Firebase Diagnostic] Firebase successfully initialized with correct API key.');
  } catch (err: any) {
    console.error('[Firebase Diagnostic] Initialization error:', err);
  }
}

export { app, auth, db, googleProvider };
