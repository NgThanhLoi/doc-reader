import './globals.css';

export const metadata = {
  title: 'Lê Minh Chi Kiếm — Đọc truyện',
  description: 'Trình đọc truyện Lê Minh Chi Kiếm (黎明之剑) full 1598 chương.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
