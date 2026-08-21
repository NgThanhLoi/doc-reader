'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const DEFAULTS = {
  theme: 'dark',        // light | sepia | dark | custom
  font: "'Noto Serif', Georgia, serif",
  fontSize: 19,         // px
  lineHeight: 1.9,
  maxWidth: 720,        // px
  customBg: '#1e2229',
  customFg: '#d8dee9',
};

const THEMES = {
  light: { bg: '#fafafa', fg: '#24292f' },
  sepia: { bg: '#f4ecd8', fg: '#5b4636' },
  dark:  { bg: '#14171c', fg: '#cfd6dd' },
  paper: { bg: '#ffffff', fg: '#1a1a1a' },   // giấy trắng thuần
  nightBlue: { bg: '#0f1b2d', fg: '#aebfd4' }, // xanh đêm
  green: { bg: '#e3ece1', fg: '#2c3b2d' },   // xanh lá dịu (bảo vệ mắt)
  gray: { bg: '#e8e8e8', fg: '#3a3a3a' },    // xám trung tính
};

// Popular reader themes (label + colors shown in the picker)
export const THEME_LIST = [
  { id: 'light', label: 'Sáng' },
  { id: 'sepia', label: 'Sepia' },
  { id: 'dark', label: 'Tối' },
  { id: 'paper', label: 'Giấy' },
  { id: 'nightBlue', label: 'Xanh đêm' },
  { id: 'green', label: 'Xanh bảo vệ mắt' },
  { id: 'gray', label: 'Xám' },
];

const FONTS = [
  { label: 'Literata (Serif)', value: "var(--f-literata), Georgia, serif" },
  { label: 'Merriweather (Serif)', value: "var(--f-merriweather), Georgia, serif" },
  { label: 'Lora (Serif)', value: "var(--f-lora), Georgia, serif" },
  { label: 'Noto Serif', value: "var(--f-notoserif), Georgia, serif" },
  { label: 'Roboto Slab (Slab)', value: "var(--f-robotoslab), Georgia, serif" },
  { label: 'Inter (Sans)', value: "var(--f-inter), system-ui, sans-serif" },
  { label: 'Be Vietnam Pro (Sans)', value: "var(--f-bevietnam), system-ui, sans-serif" },
  { label: 'Hệ thống', value: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif" },
  { label: 'Monospace', value: "ui-monospace, 'SF Mono', Consolas, monospace" },
];

export default function ReaderChrome({ title, chapterTitle, prevHref, nextHref, tocHref, homeHref, children }) {
  const [s, setS] = useState(DEFAULTS);
  const [panelOpen, setPanelOpen] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('reader:settings');
      if (raw) setS({ ...DEFAULTS, ...JSON.parse(raw) });
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem('reader:settings', JSON.stringify(s));
  }, [s, ready]);

  // keyboard navigation
  useEffect(() => {
    const onKey = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === 'ArrowLeft' && prevHref) window.location.href = prevHref;
      if (e.key === 'ArrowRight' && nextHref) window.location.href = nextHref;
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [prevHref, nextHref]);

  const theme = s.theme === 'custom'
    ? { bg: s.customBg, fg: s.customFg }
    : THEMES[s.theme];

  const cssVars = {
    '--bg': theme.bg,
    '--fg': theme.fg,
    '--font': s.font,
    '--fs': `${s.fontSize}px`,
    '--lh': s.lineHeight,
    '--maxw': `${s.maxWidth}px`,
  };

  const set = (k) => (e) => setS((p) => ({ ...p, [k]: e.target.value }));

  return (
    <div className="chrome" style={cssVars} data-ready={ready}>
      <header className="topbar">
        <Link href={homeHref || '/'} className="icon-btn" aria-label="Trang chủ">⌂</Link>
        <Link href={tocHref || '/toc/'} className="icon-btn" aria-label="Danh sách chương">☰</Link>
        <span className="topbar-title">{title}</span>
        <button className="icon-btn" onClick={() => setPanelOpen((o) => !o)} aria-label="Cài đặt">Aa</button>
      </header>

      <main className="content" style={{ background: 'var(--bg)', color: 'var(--fg)' }}>
        <h2 className="chapter-title-top">{chapterTitle}</h2>
        <div className="prose" style={{ fontFamily: 'var(--font)', fontSize: 'var(--fs)', lineHeight: 'var(--lh)', maxWidth: 'var(--maxw)' }}>
          {children}
        </div>
      </main>

      <nav className="bottombar">
        {prevHref ? <Link href={prevHref} className="nav-btn">← Trước</Link> : <span className="nav-btn disabled">← Trước</span>}
        {nextHref ? <Link href={nextHref} className="nav-btn">Sau →</Link> : <span className="nav-btn disabled">Sau →</span>}
      </nav>

      {panelOpen && (
        <div className="settings-panel" role="dialog" aria-label="Cài đặt hiển thị">
          <div className="set-row">
            <label>Chủ đề</label>
            <div className="theme-dots">
              {THEME_LIST.map((t) => (
                <button
                  key={t.id}
                  className={`dot ${t.id} ${s.theme === t.id ? 'active' : ''}`}
                  title={t.label}
                  aria-label={t.label}
                  onClick={() => setS((p) => ({ ...p, theme: t.id }))}
                />
              ))}
              <button
                className={`dot custom ${s.theme === 'custom' ? 'active' : ''}`}
                style={{ background: s.customBg }}
                title="Màu tự chọn"
                onClick={() => setS((p) => ({ ...p, theme: 'custom' }))}
                aria-label="màu tùy chọn"
              />
            </div>
            <span className="theme-name">
              {s.theme === 'custom' ? 'Tùy chọn' : (THEME_LIST.find((t) => t.id === s.theme)?.label || s.theme)}
            </span>
          </div>

          {s.theme === 'custom' && (
            <div className="set-row colors">
              <label>
                Nền <input type="color" value={s.customBg} onChange={set('customBg')} />
              </label>
              <label>
                Chữ <input type="color" value={s.customFg} onChange={set('customFg')} />
              </label>
            </div>
          )}

          <div className="set-row">
            <label>Phông chữ</label>
            <select value={s.font} onChange={set('font')}>
              {FONTS.map((f) => <option key={f.label} value={f.value}>{f.label}</option>)}
            </select>
          </div>

          <div className="set-row">
            <label>Cỡ chữ: {s.fontSize}px</label>
            <input type="range" min="14" max="30" step="1" value={s.fontSize} onChange={(e) => setS((p) => ({ ...p, fontSize: +e.target.value }))} />
          </div>

          <div className="set-row">
            <label>Khoảng dòng: {Number(s.lineHeight).toFixed(1)}</label>
            <input type="range" min="1.4" max="2.6" step="0.1" value={s.lineHeight} onChange={(e) => setS((p) => ({ ...p, lineHeight: +e.target.value }))} />
          </div>

          <div className="set-row">
            <label>Độ rộng: {s.maxWidth}px</label>
            <input type="range" min="520" max="1100" step="20" value={s.maxWidth} onChange={(e) => setS((p) => ({ ...p, maxWidth: +e.target.value }))} />
          </div>

          <button className="reset-btn" onClick={() => setS(DEFAULTS)}>Đặt lại mặc định</button>
        </div>
      )}
    </div>
  );
}
