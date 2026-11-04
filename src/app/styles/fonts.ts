import localFont from 'next/font/local';

export const pixelFont = localFont({
  src: './fonts/ComicSansMSPixel.ttf',
  weight: '400',
  style: 'normal',
  display: 'swap',
  variable: '--font-pixel',
  fallback: ['Comic Sans MS', 'sans-serif'],
});
