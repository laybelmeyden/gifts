import { SoonButton } from '@shared/ui';
import { HeroScene } from '@widgets/hero-scene';
import styles from './EmptyLists.module.css';

export function EmptyLists({ name }: { name: string }) {
  const first = name.trim().split(/\s+/)[0] || 'Мечтатель';

  return (
    <section className={styles.page}>
      <h1>Привет, {first}</h1>
      <div className={styles.center}>
        <HeroScene empty />
        <h2>Тут пока пусто</h2>
        <p>
          Создай первый вишлист — на день рождения, Новый год или просто так. А потом поделись ссылкой с подругами.
        </p>
        <SoonButton>
          <span className={styles.plus} aria-hidden="true" />
          Создать первый вишлист
        </SoonButton>
      </div>
    </section>
  );
}
