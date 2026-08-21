'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { toc } from '../lib/toc';

export default function ContinueButton() {
  const [last, setLast] = useState(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('reader:progress');
      if (raw) setLast(JSON.parse(raw).last ?? null);
    } catch {}
  }, []);

  if (last === null) return null;
  return (
    <Link className="btn" href={`/read/?c=${last}`}>
      Tiếp tục: {toc[last]?.t || `Chương ${last}`}
    </Link>
  );
}
