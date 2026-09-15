'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function ContinueButton({ bookId, toc }) {
  const [last, setLast] = useState(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(`reader:progress:${bookId}`);
      if (raw) setLast(JSON.parse(raw).last ?? null);
    } catch {}
  }, [bookId]);

  if (last === null) return null;
  return (
    <Link className="btn" href={`/read/?b=${bookId}&c=${last}`}>
      Tiếp tục: {toc[last]?.t || `Chương ${last}`}
    </Link>
  );
}
