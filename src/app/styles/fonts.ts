import localFont from 'next/font/local';

export const pixelFont = localFont({
  src: './fonts/ComicSansMSPixel.ttf',
  weight: '400',
  style: 'normal',
  display: 'swap',
  variable: '--font-pixel',
  fallback: ['Comic Sans MS', 'sans-serif'],
});

export const textFont = localFont({
  src: [
    { path: './fonts/JetBrainsMono-Light.ttf', weight: '300', style: 'normal' },
    { path: './fonts/JetBrainsMono-Regular.ttf', weight: '400', style: 'normal' },
    { path: './fonts/JetBrainsMono-Medium.ttf', weight: '500', style: 'normal' },
    { path: './fonts/JetBrainsMono-Bold.ttf', weight: '700', style: 'normal' },
  ],
  display: 'swap',
  variable: '--font-text',
  fallback: ['Consolas', 'monospace'],
});
