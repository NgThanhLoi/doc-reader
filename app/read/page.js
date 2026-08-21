'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { meta } from '../../lib/book';
import { toc } from '../../lib/toc';
import ReaderChrome from '../../components/ReaderChrome';

export default function ReadPage() {
  const [id, setId] = useState(null);
  const [chap, setChap] = useState(null);
  const [loading, setLoading] = useState(true);

  // Parse chapter id from query string: /read/?c=N
  useEffect(() => {
    const readId = () => {
      const p = new URLSearchParams(window.location.search).get('c');
      const n = parseInt(p, 10);
      setId(Number.isInteger(n) ? n : null);
    };
    readId();
    window.addEventListener('popstate', readId);
    return () => window.removeEventListener('popstate', readId);
  }, []);

  useEffect(() => {
    if (id === null || id < 0 || id >= toc.length) return;
    // Skip empty placeholder chapters (bìa/nav) by jumping forward
    if (toc[id].n === 0 && id + 1 < toc.length) {
      router.replace(`/read/?c=${id + 1}`);
      return;
    }
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
      <main className="reader" style={{ padding: 24 }}>
        <p>Không tìm thấy chương.</p>
        <Link href="/toc/">← Danh sách chương</Link>
      </main>
    );

  const prev = id > 0 ? id - 1 : null;
  const next = id < toc.length - 1 ? id + 1 : null;

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
            {prev !== null && <Link href={`/read/?c=${prev}`}>← Chương trước</Link>}
            <span> </span>
            {next !== null && <Link href={`/read/?c=${next}`}>Chương sau →</Link>}
          </nav>
        </article>
      )}
    </ReaderChrome>
  );
}
