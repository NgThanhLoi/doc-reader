'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { meta } from '../lib/book';
import { toc } from '../lib/toc';
import ReaderChrome from './ReaderChrome';

export default function ReaderClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawId = searchParams.get('c');
  const parsedId = parseInt(rawId, 10);
  const id = Number.isInteger(parsedId) ? parsedId : null;

  const [chap, setChap] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id === null || id < 0 || id >= toc.length) return;
    let alive = true;
    setLoading(true);
    fetch(`/data/ch${id}.json`)
      .then((r) => r.json())
      .then((j) => {
        if (!alive) return;
        setChap(j);
        setLoading(false);
        document.title = `${j.t} — ${meta.title}`;
        localStorage.setItem('reader:progress', JSON.stringify({ last: id }));
        window.scrollTo(0, 0);
      });
    return () => { alive = false; };
  }, [id]);

  if (id === null || id < 0 || id >= toc.length)
    return (
      <main style={{ padding: 24 }}>
        <p>Không tìm thấy chương.</p>
        <Link href="/toc/">← Danh sách chương</Link>
      </main>
    );

  const prev = id > 0 ? id - 1 : null;
  const next = id < toc.length - 1 ? id + 1 : null;
  const go = (n) => router.push(`/read/?c=${n}`);

  return (
    <ReaderChrome
      title={meta.title}
      chapterTitle={toc[id].t}
      prevHref={prev !== null ? `/read/?c=${prev}` : null}
      nextHref={next !== null ? `/read/?c=${next}` : null}
      tocHref="/toc/"
      homeHref="/"
    >
      {loading || !chap ? (
        <p className="loading">Đang tải chương…</p>
      ) : (
        <article>
          <h2 className="chapter-title">{chap.t}</h2>
          {chap.p.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
          <nav className="end-nav">
            {prev !== null && (
              <a href={`/read/?c=${prev}`} onClick={(e) => { e.preventDefault(); go(prev); }}>← Chương trước</a>
            )}
            <span> </span>
            {next !== null && (
              <a href={`/read/?c=${next}`} onClick={(e) => { e.preventDefault(); go(next); }}>Chương sau →</a>
            )}
          </nav>
        </article>
      )}
    </ReaderChrome>
  );
}
