"use client";

import { App, Layout, theme } from "antd";
import { PropsWithChildren } from "react";
import AppHeader from "./Header";
import AppFooter from "./Footer";

const { Content } = Layout;

export default function MainWrapper({ children }: PropsWithChildren) {
  const { token } = theme.useToken();

  return (
    <Layout style={{ minHeight: "100vh", background: "transparent" }}>
      <AppHeader />
      <Layout style={{ padding: "24px", flex: 1 }}>
        <Content
          style={{
            padding: 24,
            margin: 0,
            minHeight: 280,
            background: token.colorBgContainer,
            borderRadius: token.borderRadiusLG,
          }}
        >
          {children}
        </Content>
      </Layout>
      <AppFooter />
    </Layout>
  );
}
