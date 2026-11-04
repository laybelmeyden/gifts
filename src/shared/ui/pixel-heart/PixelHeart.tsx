import type { SVGAttributes } from 'react';

const palettes = {
  lilac: ['#e9d5ff', '#c084fc', '#f5f3ff', '#a855f7', '#7c3aed', '#5b21b6'],
  red: ['#ff6b8a', '#ff4d6d', '#ffd0d8', '#e11d48', '#be123c', '#9f1239'],
  white: ['#f5f0ff', '#d8b4fe', '#fff', '#c084fc', '#a855f7', '#7c3aed'],
  violet: ['#e9d5ff', '#9d6cff', '#f5f3ff', '#7a3dff', '#6d28d9', '#4c1d95'],
} as const;

export type PixelHeartColor = keyof typeof palettes;

type PixelHeartProps = SVGAttributes<SVGSVGElement> & {
  color?: PixelHeartColor;
};

export function PixelHeart({ color = 'lilac', ...rest }: PixelHeartProps) {
  const [top, body, shine, row3, row4, tip] = palettes[color];
  return (
    <svg viewBox="0 0 7 6" shapeRendering="crispEdges" aria-hidden="true" {...rest}>
      <rect x="1" y="0" width="2" height="1" fill={top} />
      <rect x="4" y="0" width="2" height="1" fill={top} />
      <rect x="0" y="1" width="7" height="2" fill={body} />
      <rect x="2" y="1" width="1" height="1" fill={shine} />
      <rect x="1" y="3" width="5" height="1" fill={row3} />
      <rect x="2" y="4" width="3" height="1" fill={row4} />
      <rect x="3" y="5" width="1" height="1" fill={tip} />
    </svg>
  );
}
