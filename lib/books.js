// Multi-book registry. Served under /reader/ (nginx alias) → BASE prefix.
import { meta } from './book';
import { metaNttt } from './book-nttt';
import { toc } from './toc';
import { tocNttt } from './toc-nttt';

export const BOOKS = {
  lmck: { id: 'lmck', meta, toc, dir: '', start: 2 },
  nttt: { id: 'nttt', meta: metaNttt, toc: tocNttt, dir: 'nttt/', start: 1 },
};

export function getBook(b) {
  return BOOKS[b] || BOOKS.lmck;
}

// Runtime subpath detection: /reader/* on nginx, /* on Vercel.
export function basePath() {
  if (typeof window !== 'undefined' && window.location.pathname.startsWith('/reader')) return '/reader';
  return '';
}
