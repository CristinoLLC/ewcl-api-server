'use client';

import Link from 'next/link';

export default function LandingPage() {
  return (
    <main className="min-h-screen flex flex-col justify-center items-center gap-6 text-center">
      <h1 className="text-4xl font-bold">🧬 EWCL Platform Hub</h1>
      <p className="text-lg text-gray-300">Choose a module to test or visualize.</p>
      <div className="flex gap-4">
        <Link href="/home" className="px-6 py-2 bg-white text-black rounded-lg font-semibold">
          /home
        </Link>
        <Link href="/firebase-test" className="px-6 py-2 bg-yellow-400 text-black rounded-lg">
          /firebase-test
        </Link>
      </div>
    </main>
  );
}