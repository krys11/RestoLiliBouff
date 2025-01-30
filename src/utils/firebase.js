import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDNTCXtgXLjRsGAznWVngao2ZOO9ofqrj0",
  authDomain: "lilibouf-ee183.firebaseapp.com",
  projectId: "lilibouf-ee183",
  storageBucket: "lilibouf-ee183.firebasestorage.app",
  messagingSenderId: "698332269409",
  appId: "1:698332269409:web:4adcbcbd47383042891320",
  measurementId: "G-Q3LSFCFD6G"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);