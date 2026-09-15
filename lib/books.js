// Multi-book registry. Served under /reader/ (nginx alias) → BASE prefix.
import { meta } from './book';
import { metaNttt } from './book-nttt';
import { toc } from './toc';
import { tocNttt } from './toc-nttt';

export const BASE = '/reader';

export const BOOKS = {
  lmck: { id: 'lmck', meta, toc, dir: '', start: 2 },
  nttt: { id: 'nttt', meta: metaNttt, toc: tocNttt, dir: 'nttt/', start: 1 },
};

export function getBook(b) {
  return BOOKS[b] || BOOKS.lmck;
}
