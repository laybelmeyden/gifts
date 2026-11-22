import { t } from '@contracts/i18n';
import { Header } from '@widgets/header';
import styles from './BoardPage.module.css';

type BoardPageProps = {
  /** Чужой список по ссылке /u/:userId; без него - свой список. */
  userId?: string;
};

export function BoardPage({ userId }: BoardPageProps) {
  const isOwn = !userId;

  return (
    <section className={styles.board}>
      <Header />
      <header className={styles.head}>
        <h1 className={styles.title}>{isOwn ? t.board.ownTitle : t.board.title}</h1>
      </header>
      <div className={styles.empty}>
        <p>{isOwn ? t.board.ownEmpty : t.board.empty}</p>
      </div>
    </section>
  );
}
