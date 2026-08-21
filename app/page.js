import Link from 'next/link';
import ContinueButton from '../components/ContinueButton';
import { meta } from '../lib/book';
import { toc } from '../lib/toc';

export default function Home() {
  return (
    <main className="home">
      <div className="hero">
        <h1>{meta.title}</h1>
        <p className="author">{meta.author}</p>
        <p className="desc">{meta.description}</p>
        <div className="cta">
          <Link className="btn primary" href="/read/?c=2">Đọc từ đầu</Link>
          <ContinueButton />
          <Link className="btn" href="/toc/">Danh sách chương</Link>
        </div>
      </div>
    </main>
  );
}
