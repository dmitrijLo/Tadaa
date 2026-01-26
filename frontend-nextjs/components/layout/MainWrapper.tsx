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
      <Layout className={"mainContainer"}>{children}</Layout>
      <AppFooter />
    </Layout>
  );
}
