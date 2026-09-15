import Link from 'next/link';
import ContinueButton from '../components/ContinueButton';
import { BOOKS } from '../lib/books';

export default function Home() {
  return (
    <main className="home">
      {Object.values(BOOKS).map((b) => (
        <div className="hero" key={b.id}>
          <h1>{b.meta.title}</h1>
          <p className="author">{b.meta.author}</p>
          <p className="desc">{b.meta.description}</p>
          <div className="cta">
            <Link className="btn primary" href={`./read/?b=${b.id}&c=${b.start}`}>Đọc từ đầu</Link>
            <ContinueButton bookId={b.id} toc={b.toc} />
            <Link className="btn" href={`./toc/?b=${b.id}`}>Danh sách chương</Link>
          </div>
        </div>
      ))}
    </main>
  );
}
