import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'
import { db } from './firebase' // Ensure this is your Firestore instance

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyCm7qPXTMC95Af3dJpEE1TGG1wWDt0S3Tg',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'ewcl-platform.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'ewcl-platform',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'ewcl-platform.appspot.com',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '951574725278',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:951574725278:web:3974b027d57380c79c0559',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Export Firestore and Storage
export const db = getFirestore(app)
export const storage = getStorage(app)

// Export Firebase app
export default app

// Fetch benchmarks from Firestore
export async function fetchBenchmarks() {
  try {
    const benchmarksRef = collection(db, 'benchmarks') // Replace 'benchmarks' with your Firestore collection name
    const q = query(benchmarksRef, orderBy('createdAt', 'desc')) // Adjust query as needed
    const querySnapshot = await getDocs(q)
    const benchmarks = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    return benchmarks
  } catch (error) {
    console.error('Error fetching benchmarks:', error)
    throw error
  }
}