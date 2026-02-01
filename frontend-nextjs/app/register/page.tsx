"use client";

import Link from "next/link";
import RegisterForm from "@/components/auth/RegisterForm";
import { Typography } from "antd";
import styles from "./register.module.css";

const { Title, Text } = Typography;

export default function RegisterPage() {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <Title level={2} style={{ textAlign: "center", marginBottom: "30px" }}>
          Account erstellen
        </Title>

        <RegisterForm />

        <Text style={{ marginBottom: "0" }}>
          Hast du bereits einen Account? <Link href="/login">Anmelden</Link>
        </Text>
      </div>
    </div>
  );
}
