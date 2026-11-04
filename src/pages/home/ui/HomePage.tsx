import { Panel, PixelHeart } from '@shared/ui';
import { HomeEnterButton } from './HomeEnterButton';
import styles from './HomePage.module.css';

export function HomePage() {
  return (
    <main className={styles.page}>
      <section className={styles.stage}>
        <div className={styles.hero}>
          <p className="kicker">Лучший подарок — ты сам</p>
          <h1 className={styles.title}>
            список
            <br />
            подарков
            <br />
            <span>твоей мечты</span>
          </h1>
          <HomeEnterButton className={styles.enter} />
          <p className="lead">Войдите, чтобы создать список подарков своей мечты.</p>
          <Panel className={styles.lore}>
            <div>
              <h2>Настоящие списки. Настоящие истории.</h2>
              <p>Никакого шума. Только вход, ваши задачи и фиолетовое небо.</p>
            </div>
            <PixelHeart className={styles.loreHeart} />
          </Panel>
        </div>
      </section>
    </main>
  );
}
