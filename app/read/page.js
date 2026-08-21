import { Suspense } from 'react';
import ReaderClient from '../../components/ReaderClient';

export default function Page() {
  return (
    <Suspense fallback={<main className="reader"><p className="loading">Đang tải…</p></main>}>
      <ReaderClient />
    </Suspense>
  );
}
