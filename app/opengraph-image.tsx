import { t } from '@contracts/i18n';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';
import type { CSSProperties } from 'react';

export const alt = t.meta.imageAlt;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const root = process.cwd();
const png = async (name: string) =>
  `data:image/png;base64,${await readFile(join(root, 'public/hero', `${name}.png`), 'base64')}`;

const [beam, heart, gift, sparkle, pink, lilac, pixelFont, textFont] = await Promise.all([
  png('beam'),
  png('heart'),
  png('gift'),
  png('sparkle'),
  png('heart-pink'),
  png('heart-lilac'),
  readFile(join(root, 'src/app/styles/fonts/ComicSansMSPixel.ttf')),
  readFile(join(root, 'src/app/styles/fonts/JetBrainsMono-Regular.ttf')),
]);

type SpriteProps = { src: string; width: number; height: number; style: CSSProperties };

const Sprite = ({ src, width, height, style }: SpriteProps) => (
  // eslint-disable-next-line @next/next/no-img-element -- ImageResponse рендерит только обычный <img>
  <img
    src={src}
    width={width}
    height={height}
    alt=""
    style={{ position: 'absolute', imageRendering: 'pixelated', ...style }}
  />
);

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        padding: '0 80px 0 40px',
        background: 'radial-gradient(circle at 25% 45%, #2a1458 0%, #12081f 45%, #07040d 80%)',
        color: '#f4ecff',
      }}
    >
      <div style={{ display: 'flex', position: 'relative', width: 460, height: 560, flexShrink: 0 }}>
        <Sprite src={beam} width={360} height={448} style={{ top: 70, left: 50, opacity: 0.9 }} />
        <Sprite src={heart} width={124} height={105} style={{ top: 26, left: 168 }} />
        <Sprite src={gift} width={208} height={182} style={{ bottom: 60, left: 126 }} />
        <Sprite src={sparkle} width={30} height={30} style={{ top: 120, left: 60 }} />
        <Sprite src={sparkle} width={24} height={24} style={{ top: 220, left: 400 }} />
        <Sprite src={pink} width={26} height={22} style={{ top: 300, left: 40 }} />
        <Sprite src={lilac} width={22} height={19} style={{ top: 90, left: 360 }} />
        <div
          style={{
            position: 'absolute',
            bottom: 36,
            left: 70,
            width: 320,
            height: 40,
            borderRadius: '50%',
            background: 'radial-gradient(ellipse, rgba(140, 90, 255, 0.55) 0%, transparent 70%)',
          }}
        />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0, gap: 28, marginLeft: 40 }}>
        <div style={{ fontFamily: 'Pixel', fontSize: 120, lineHeight: 1, color: '#ffffff' }}>GIFTS</div>
        <div style={{ fontFamily: 'Pixel', fontSize: 44, lineHeight: 1.2, color: '#ff7ab6' }}>{t.meta.description}</div>
        <div style={{ fontFamily: 'Text', fontSize: 26, lineHeight: 1.45, color: '#b9a6e6' }}>{t.meta.lead}</div>
      </div>
    </div>,
    {
      ...size,
      fonts: [
        { name: 'Pixel', data: pixelFont, style: 'normal', weight: 400 },
        { name: 'Text', data: textFont, style: 'normal', weight: 400 },
      ],
    },
  );
}
