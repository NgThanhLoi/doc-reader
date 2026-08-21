import './globals.css';
import {
  Literata,
  Merriweather,
  Lora,
  Noto_Serif,
  Inter,
  Be_Vietnam_Pro,
  Roboto_Slab,
} from 'next/font/google';

// All fonts include Vietnamese subset, self-hosted at build time (no external CDN).
const literata = Literata({ subsets: ['latin', 'vietnamese'], variable: '--f-literata', display: 'swap' });
const merriweather = Merriweather({ subsets: ['latin', 'vietnamese'], variable: '--f-merriweather', display: 'swap' });
const lora = Lora({ subsets: ['latin', 'vietnamese'], variable: '--f-lora', display: 'swap' });
const notoSerif = Noto_Serif({ subsets: ['latin', 'vietnamese'], variable: '--f-notoserif', display: 'swap' });
const inter = Inter({ subsets: ['latin', 'vietnamese'], variable: '--f-inter', display: 'swap' });
const beVietnamPro = Be_Vietnam_Pro({
  weight: ['400', '600'],
  subsets: ['latin', 'vietnamese'],
  variable: '--f-bevietnam',
  display: 'swap',
});
const robotoSlab = Roboto_Slab({ subsets: ['latin', 'vietnamese'], variable: '--f-robotoslab', display: 'swap' });

export const metadata = {
  title: 'Lê Minh Chi Kiếm — Đọc truyện',
  description: 'Trình đọc truyện Lê Minh Chi Kiếm (黎明之剑) full 1598 chương.',
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="vi"
      className={`${literata.variable} ${merriweather.variable} ${lora.variable} ${notoSerif.variable} ${inter.variable} ${beVietnamPro.variable} ${robotoSlab.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
