'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/folder/main'); // redirect without adding to history
  }, [router]);

  return null; // nothing to render
}