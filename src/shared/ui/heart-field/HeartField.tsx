import styles from './HeartField.module.css';

const HEART_COUNT = 20;

/** Портрет с парящими пиксельными сердечками из карточки входа. */
export function HeartField() {
  return (
    <div className={styles.portrait} aria-hidden="true">
      <div className={styles.field}>
        {Array.from({ length: HEART_COUNT }, (_, index) => (
          <span key={index} />
        ))}
      </div>
    </div>
  );
}
