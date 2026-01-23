"use client";

import styles from "./app-footer.module.css";

export default function AppFooter() {
  return (
    <footer className={styles.footer}>
      <p className={styles.text}>
        {" "}
        Tadaa ©{new Date().getFullYear()} created by
      </p>
    </footer>
  );
}
