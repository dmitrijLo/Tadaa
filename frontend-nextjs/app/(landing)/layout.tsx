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
      <Content style={{ background: "transparent" }}>{children}</Content>
    </Layout>
  );
}
