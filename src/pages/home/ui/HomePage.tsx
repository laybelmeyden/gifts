import { routes } from '@shared/config';
import { ButtonLink, Logo } from '@shared/ui';
import { HeroScene } from '@widgets/hero-scene';
import styles from './HomePage.module.css';

export function HomePage() {
  return (
    <div className={`${styles.page} starfield`}>
      <header className={styles.bar}>
        <Logo />
        <div className={styles.barActions}>
          <ButtonLink variant="secondary" size="sm" href={routes.signIn}>
            Войти
          </ButtonLink>
          <ButtonLink className={styles.barCreate} size="sm" href={routes.signUp}>
            Создать вишлист
          </ButtonLink>
        </div>
      </header>
      <div className={styles.grid}>
        <div className={styles.stack}>
          <div className={styles.copy}>
            <p className={styles.eyebrow}>
              <span className={styles.desk}>Вишлист для своих</span>
              <span className={styles.mob}>Вишлист без намёков</span>
              <span className={`${styles.spark} ${styles.desk}`} aria-hidden="true" />
            </p>
            <h1>
              Список подарков
              <br />
              <span>твоей мечты</span>
            </h1>
            <p className={styles.lead}>
              <span className={styles.desk}>
                Собери все желания в одном месте, отправь ссылку подругам - и получай только то, о чём давно мечтаешь.
              </span>
              <span className={styles.mob}>
                Собери желания в один список, отправь ссылку - и получай только то, о чём мечтаешь.
              </span>
            </p>
          </div>
          <div className={styles.ctas}>
            <ButtonLink href={routes.signUp}>Создать вишлист</ButtonLink>
            <ButtonLink className={styles.ctaLogin} variant="secondary" href={routes.signIn}>
              Войти
            </ButtonLink>
          </div>
        </div>
        <HeroScene quote className={styles.hero} />
      </div>
    </div>
  );
}
