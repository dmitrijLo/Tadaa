"use client";
import Link from "next/link";
import styles from "./app-header.module.css";
import Image from "next/image";
import { Layout, Menu, Button } from "antd";
import { useAuthStore } from "@/stores/useAuthStore";
import { useEffect, useState } from "react";
import LogoutButton from "@/components/auth/LogoutButton";

const headerStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  background: "#fff",
  borderBottom: "1px solid #f0f0f0",
};

export default function AppHeader() {
  const { currentUser } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  const { Header } = Layout;

  // useEffect(() => {
  //   setMounted(true);
  // }, []);

  // if (!mounted) {
  //   return (
  //     <header className={styles.header}>
  //       <div
  //         className={styles.logoPlaceholder}
  //         style={{ width: 80, height: 80 }}
  //       />
  //     </header>
  //   );
  // }

  const menuItems = currentUser
    ? [
        {
          key: "logout",
          label: <LogoutButton />,
        },
      ]
    : [
        {
          key: "login",
          label: (
            <Link href="/login">
              <Button type="primary" size="large" shape="round">
                Login
              </Button>
            </Link>
          ),
        },
        {
          key: "register",
          label: (
            <Link href="/register">
              <Button type="primary" size="large" shape="round">
                Registrieren
              </Button>
            </Link>
          ),
        },
      ];

  return (
    <Header style={headerStyle}>
      <Link href={currentUser ? "/dashboard" : "/"}>
        <Image
          src="/logo.png"
          alt="Logo Tadaa"
          width={80}
          height={80}
          className={styles.logoImage}
          priority
        />
      </Link>
      <Menu
        mode="horizontal"
        items={menuItems}
        style={{
          border: "none",
          flex: 1,
          justifyContent: "flex-end",
          minWidth: 0,
        }}
      />
    </Header>
  );
}
