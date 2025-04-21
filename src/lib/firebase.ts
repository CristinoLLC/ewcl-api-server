import { initializeApp } from 'firebase/app'
import { getFirestore, collection, addDoc } from 'firebase/firestore'

// Your web app's Firebase configuration
const firebaseConfig = {
  // TODO: Replace with your Firebase config
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

interface BenchmarkData {
  name: string
  entropyScore: number
  residues: number[]
  timestamp: string
  fileUrl: string
}

export async function saveBenchmarkToFirestore(data: BenchmarkData) {
  try {
    const docRef = await addDoc(collection(db, 'benchmarks'), data)
    console.log('Benchmark saved with ID:', docRef.id)
    return docRef.id
  } catch (error) {
    console.error('Error saving benchmark:', error)
    throw error
  }
} 