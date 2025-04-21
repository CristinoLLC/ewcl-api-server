import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB097-VYGl5aNEsqmvQrQBOfDSh1x0m8gs",
  authDomain: "benchmarks--ewcl.firebaseapp.com",
  projectId: "benchmarks--ewcl",
  storageBucket: "benchmarks--ewcl.firebasestorage.app",
  messagingSenderId: "844216373624",
  appId: "1:844216373624:web:23b830d43a9fcdd284f88d",
  measurementId: "G-YXN8NGZQYY"
};

// Initialize Firebase with SSR safety checks
let app;
let analytics;
let db;

// Only initialize Firebase on the client side
if (typeof window !== 'undefined' && !getApps().length) {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  
  // Analytics is only available on client side
  try {
    analytics = getAnalytics(app);
  } catch (error) {
    console.error("Analytics initialization error:", error);
  }
}

export interface AnalysisData {
  name: string;
  score: number;
  entropyMap: Record<string, number>;
  timestamp: number;
}

// Function to save analysis data to Firestore
export async function saveAnalysisToFirestore(data: AnalysisData) {
  if (!db) {
    console.error("Firebase not initialized - client-side only");
    alert("Could not save to Firebase - only works in browser");
    return null;
  }
  
  try {
    const docRef = await addDoc(collection(db, "analyses"), {
      ...data,
      timestamp: new Date()
    });
    console.log("Analysis saved with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error saving analysis:", error);
    alert("Failed to save analysis to Firebase. Please try again.");
    return null;
  }
}

// Function to get user's analysis history
export async function getUserAnalysisHistory(limit = 10) {
  if (!db) return [];
  
  try {
    const querySnapshot = await getDocs(
      query(collection(db, "analyses"), 
            orderBy("timestamp", "desc"), 
            limit(limit))
    );
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error fetching analysis history:", error);
    return [];
  }
}