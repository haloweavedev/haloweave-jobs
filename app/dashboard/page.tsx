import styles from '../page.module.css';

export default function PageName() {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>Page Name</h1>
        <p className={styles.description}>
          This is a placeholder for the Page Name page.
        </p>
      </main>
    </div>
  );
}