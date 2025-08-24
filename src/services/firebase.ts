import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getDatabase, connectDatabaseEmulator } from 'firebase/database';
import { getStorage } from 'firebase/storage';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBQFrju1Vl6VJsPD2ZfRl5xIS2Fh066nRU",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "chatflow-builder-qwix4.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "chatflow-builder-qwix4",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "chatflow-builder-qwix4.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "287388723540",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:287388723540:web:b54160f980fec2a182c0c1",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);
export const rtdb = getDatabase(app);

// Firebase Emulator disabled for production-like development
// Uncomment below if you want to use Firebase emulators
/*
if (import.meta.env.DEV && import.meta.env.VITE_USE_FIREBASE_EMULATOR === 'true') {
  connectAuthEmulator(auth, "http://localhost:9099");
  connectFirestoreEmulator(db, 'localhost', 8080);
  connectFunctionsEmulator(functions, "localhost", 5001);
  try {
    connectDatabaseEmulator(rtdb, 'localhost', 9000);
  } catch {
    // Emulator may not be running; ignore in dev
  }
}
*/

export default app;
