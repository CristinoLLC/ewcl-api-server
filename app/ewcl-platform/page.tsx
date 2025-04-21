'use client'

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function EWCLPlatformRedirect() {
  const router = useRouter();
  
  useEffect(() => {
    router.push('/ewcl-analysis');
  }, [router]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <p className="text-gray-600">Redirecting to EWCL Analysis...</p>
    </div>
  );
}