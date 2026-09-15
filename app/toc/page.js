'use client';

import { Suspense } from 'react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { getBook } from '../../lib/books';

export default function TocPage() {
  return (
    <Suspense fallback={<main className="toc-page"><p>Đang tải…</p></main>}>
      <Toc />
    </Suspense>
  );
}

function Toc() {
  const searchParams = useSearchParams();
  const book = getBook(searchParams.get('b'));
  const { toc, meta, id: bookId } = book;
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);
  const perPage = 100;
  const [progress, setProgress] = useState(null);

  useEffect(() => {
    const raw = localStorage.getItem(`reader:progress:${bookId}`);
    if (raw) {
      try { setProgress(JSON.parse(raw)); } catch {}
    }
  }, [bookId]);

  const filtered = q
    ? toc.filter((c) => c.t.toLowerCase().includes(q.toLowerCase()))
    : toc;

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const pageItems = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <main className="toc-page">
      <header className="topbar">
        <Link href="/" className="back">← Trang chủ</Link>
        <h1>{meta.title} — Danh sách chương ({toc.length})</h1>
      </header>
      <input
        className="search"
        placeholder="Tìm chương…"
        value={q}
        onChange={(e) => { setQ(e.target.value); setPage(1); }}
      />
      {progress && (
        <div className="continue-bar">
          <Link href={`/read/?b=${bookId}&c=${progress.last}`}>
            Đọc tiếp: {toc[progress.last]?.t || `Chương ${progress.last}`}
          </Link>
        </div>
      )}
      <ol className="toc-list">
        {pageItems.map((c) => (
          <li key={c.i} className={progress && progress.last === c.i ? 'current' : ''}>
            <Link href={`/read/?b=${bookId}&c=${c.i}`}>{c.t}</Link>
          </li>
        ))}
      </ol>
      <nav className="pager">
        <button disabled={page <= 1} onClick={() => setPage(page - 1)}>← Trước</button>
        <span>Trang {page}/{totalPages}</span>
        <button disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Sau →</button>
      </nav>
    </main>
  );
}
