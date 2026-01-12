"use client";
import { Button, Layout, Menu } from "antd";
import Link from "next/link";
import { PropsWithChildren } from "react";

const { Header, Content, Footer } = Layout;

const headerStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  background: "#fff", // TODO
  borderBottom: "1px solid #f0f0f0",
};

const footerStyle: React.CSSProperties = {
  textAlign: "center",
  background: "transparent",
};

export default function LandingPageLayout({ children }: PropsWithChildren) {
  return (
    <Layout style={{ width: "100%", background: "transparent" }}>
      <Header style={headerStyle}>
        <div>LOGO</div>
        <Menu
          mode="horizontal"
          items={[
            {
              key: "login",
              label: (
                <Link href="/login">
                  <Button
                    type="primary"
                    variant="solid"
                    size="large"
                    shape="round"
                  >
                    SignIn
                  </Button>
                </Link>
              ),
            },
          ]}
          style={{ border: "none", flex: 1, justifyContent: "flex-end" }}
        />
      </Header>
      <Content style={{ background: "transparent" }}>{children}</Content>
      <Footer style={footerStyle}>Tadaa ©2026 created by</Footer>
    </Layout>
  );
}
