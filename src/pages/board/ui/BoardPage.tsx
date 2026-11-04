import styles from './BoardPage.module.css';

type BoardPageProps = {
  /** Чужой список по ссылке /u/:userId; без него — свой список. */
  userId?: string;
};

export function BoardPage({ userId }: BoardPageProps) {
  const isOwn = !userId;

  return (
    <section className={styles.board}>
      <header className={styles.head}>
        <h1 className={styles.title}>{isOwn ? 'Ваш список подарков' : 'Список подарков'}</h1>
      </header>
      <div className={styles.empty}>
        <p>{isOwn ? 'Пока пусто. Добавьте первый подарок.' : 'У этого человека пока нет подарков.'}</p>
      </div>
    </section>
  );
}
