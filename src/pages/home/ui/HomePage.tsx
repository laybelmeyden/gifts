import { t } from '@contracts/i18n';
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
            {t.home.signIn}
          </ButtonLink>
          <ButtonLink className={styles.barCreate} size="sm" href={routes.signUp}>
            {t.home.createList}
          </ButtonLink>
        </div>
      </header>
      <div className={styles.grid}>
        <div className={styles.stack}>
          <div className={styles.copy}>
            <p className={styles.eyebrow}>
              <span className={styles.desk}>{t.home.eyebrowDesktop}</span>
              <span className={styles.mob}>{t.home.eyebrowMobile}</span>
              <span className={`${styles.spark} ${styles.desk}`} aria-hidden="true" />
            </p>
            <h1>
              {t.home.titleTop}
              <br />
              <span>{t.home.titleBottom}</span>
            </h1>
            <p className={styles.lead}>
              <span className={styles.desk}>{t.home.leadDesktop}</span>
              <span className={styles.mob}>{t.home.leadMobile}</span>
            </p>
          </div>
          <div className={styles.ctas}>
            <ButtonLink href={routes.signUp}>{t.home.createList}</ButtonLink>
            <ButtonLink className={styles.ctaLogin} variant="secondary" href={routes.signIn}>
              {t.home.signIn}
            </ButtonLink>
          </div>
        </div>
        <HeroScene quote className={styles.hero} />
      </div>
    </div>
  );
}
