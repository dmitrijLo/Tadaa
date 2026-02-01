"use client";

import { Layout } from "antd";
import styles from "./app-footer.module.css";

const footerStyle: React.CSSProperties = {
  textAlign: "center",
  background: "#f0f2f5",
};

export default function AppFooter() {
  const { Footer } = Layout;
  return (
    <Footer style={footerStyle}>
      <p className={styles.text}>
        {" "}
        Tadaa ©{new Date().getFullYear()} created by
      </p>
    </Footer>
  );
}
