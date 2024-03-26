import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.center}>
        <p className={styles.appName}>
          Budge
        </p>
        <p>
          Under Construction
        </p>
      </div>
    </main>
  );
}
