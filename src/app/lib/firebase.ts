'use client';

import { initializeApp } from 'firebase/app';
import { getAnalytics, isSupported } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore/lite';

const firebaseConfig = {
  apiKey: "AIzaSyB097-VYGl5aNEsqmvQrQBOfDSh1x0m8gs",
  authDomain: "benchmarks--ewcl.firebaseapp.com",
  projectId: "benchmarks--ewcl",
  storageBucket: "benchmarks--ewcl.firebasestorage.app",
  messagingSenderId: "844216373624",
  appId: "1:844216373624:web:23b830d43a9fcdd284f88d",
  measurementId: "G-YXN8NGZQYY"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let analytics: ReturnType<typeof getAnalytics> | null = null;
isSupported().then((yes) => {
  if (yes) analytics = getAnalytics(app);
});

export { db, analytics };