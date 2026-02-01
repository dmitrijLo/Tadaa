"use client";

import LoginForm from "@/components/auth/LoginForm";
import { Typography } from "antd";
import styles from "./login.module.css";

const { Title } = Typography;

export default function LoginPage() {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <Title className="text-2xl font-bold mb-6 text-center">Login</Title>
        <LoginForm />
      </div>
    </div>
  );
}
