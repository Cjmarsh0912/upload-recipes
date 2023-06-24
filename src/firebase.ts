import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const apiKey = process.env.REACT_APP_API_KEY;

const firebaseConfig = {
  apiKey: apiKey,
  authDomain: 'recipe-website-43298.firebaseapp.com',
  projectId: 'recipe-website-43298',
  storageBucket: 'recipe-website-43298.appspot.com',
  messagingSenderId: '466908845368',
  appId: '1:466908845368:web:5ae2072fcfaedcc6df9dcd',
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const db = getFirestore(app);
