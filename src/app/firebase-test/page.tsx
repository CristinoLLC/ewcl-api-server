'use client';

import React, { useEffect, useState } from 'react';
import { db, analytics } from '../firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';

export default function Page() {
  const [docs, setDocs] = useState<any[]>([]);

  useEffect(() => {
    const runTest = async () => {
      const ref = collection(db, 'test-collection');
      await addDoc(ref, {
        message: '🧬 EWCL Firebase Test',
        timestamp: Date.now()
      });
      const snap = await getDocs(ref);
      const results = snap.docs.map(doc => doc.data());
      setDocs(results);
    };

    runTest();
  }, []);

  return (
    <div className="p-6 text-center">
      <h1 className="text-2xl font-bold">🔥 Firebase Firestore Test</h1>
      <ul className="mt-4 text-left">
        {docs.map((doc, i) => (
          <li key={i}>✅ {doc.message} — {new Date(doc.timestamp).toLocaleString()}</li>
        ))}
      </ul>
    </div>
  );
}