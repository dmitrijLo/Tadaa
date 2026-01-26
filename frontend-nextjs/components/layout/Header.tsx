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
  padding: "0",
  height: "auto",
};

const headerInnerStyle: React.CSSProperties = {
  display: "flex",
  background: "transparent",
  flexDirection: "row",
  alignItems: "center",
  padding: "0 24px",
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
              <Button type="primary" size="large">
                Login
              </Button>
            </Link>
          ),
        },
        {
          key: "register",
          label: (
            <Link href="/register">
              <Button type="primary" size="large">
                Registrieren
              </Button>
            </Link>
          ),
        },
      ];

  return (
    <Header style={headerStyle}>
      <Layout className={"mainContainer"} style={{ padding: "12px 24px" }}>
        <Layout style={headerInnerStyle}>
          <Link href={currentUser ? "/dashboard" : "/"}>
            <Image
              src="/logo.png"
              alt="Logo Tadaa"
              width={100}
              height={50}
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
        </Layout>
      </Layout>
    </Header>
  );
}
