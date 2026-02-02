"use client";
import Link from "next/link";
import styles from "./app-header.module.css";
import Image from "next/image";
import { Layout, Menu, Button } from "antd";
import { useAuthStore } from "@/stores/useAuthStore";
import { usePathname, useRouter } from "next/navigation";

const { Header } = Layout;

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
  const { currentUser, logout } = useAuthStore();
  const pathname = usePathname();
  const router = useRouter();

  const isHomePage = pathname === "/";
  const isLoginPage = pathname === "/login";
  const isRegisterPage = pathname === "/register";

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const getMenuItems = () => {
    if (currentUser) {
      return [
        {
          key: "logout",
          label: (
            <Button
              color="primary"
              variant="outlined"
              size="large"
              onClick={handleLogout}
            >
              Logout
            </Button>
          ),
        },
      ];
    }

    if (isHomePage) {
      return [
        {
          key: "login",
          label: (
            <Link href="/login">
              <Button color="primary" variant="outlined" size="large">
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
    }

    if (isLoginPage) {
      return [
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
    }

    if (isRegisterPage) {
      return [
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
      ];
    }

    return [];
  };

  return (
    <Header style={headerStyle}>
      <Layout className={"mainContainer"} style={{ padding: "12px 24px" }}>
        <Layout style={headerInnerStyle}>
          <Link href={currentUser ? "/dashboard" : "/"}>
            <Image
              src="/logo.png"
              alt="Logo Tadaa"
              width={80}
              height={40}
              className={styles.logoImage}
              priority
            />
          </Link>
          <Menu
            mode="horizontal"
            items={getMenuItems()}
            selectable={false}
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
