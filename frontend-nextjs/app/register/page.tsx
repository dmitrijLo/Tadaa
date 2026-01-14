"use client";

import Link from "next/link";
import RegisterForm from "@/components/forms/RegisterForm";
import { Typography } from "antd";
import styles from "./register.module.css";

const { Title, Text } = Typography;

export default function RegisterPage() {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <Title level={2} style={{ textAlign: "center", marginBottom: "30px" }}>
          Create Account
        </Title>

        <RegisterForm />

        <Text style={{ marginBottom: "0" }}>
          Already have an account? <Link href="/login">Sign in</Link>
        </Text>
      </div>
    </div>
  );
}
