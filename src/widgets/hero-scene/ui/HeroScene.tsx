import { cx } from '@shared/lib';
import { Dialogue } from './Dialogue';
import styles from './HeroScene.module.css';

type HeroSceneProps = {
  quote?: boolean;
  compact?: boolean;
  empty?: boolean;
  className?: string;
};

const stars = [
  { x: '8%', y: '26%' },
  { x: '78%', y: '14%' },
  { x: '86%', y: '44%' },
  { x: '16%', y: '56%' },
  { x: '72%', y: '68%' },
] as const;

const hearts = [
  { x: '7%', y: '43%', kind: 'pink' },
  { x: '86%', y: '36%', kind: 'lilac' },
  { x: '10%', y: '83%', kind: 'lilac' },
  { x: '80%', y: '83%', kind: 'pink' },
] as const;

export function HeroScene({ quote = false, compact = false, empty = false, className }: HeroSceneProps) {
  return (
    <div className={cx(styles.scene, compact && styles.compact, empty && styles.empty, className)}>
      <div className={styles.stage} aria-hidden="true">
        <span className={styles.beamDim} />
        <span className={styles.beam} />
        <span className={styles.floor}>
          <span className={styles.glow} />
        </span>
        <span className={styles.gift} />
        <span className={styles.aura} />
        <span className={styles.heart} />
        {hearts.map((heart) => (
          <span
            key={`${heart.x}-${heart.y}`}
            className={cx(styles.floatHeart, styles[heart.kind])}
            style={{ left: heart.x, top: heart.y }}
          />
        ))}
        {stars.map((star) => (
          <span key={`${star.x}-${star.y}`} className={styles.star} style={{ left: star.x, top: star.y }} />
        ))}
      </div>
      {quote && <Dialogue />}
    </div>
  );
}
