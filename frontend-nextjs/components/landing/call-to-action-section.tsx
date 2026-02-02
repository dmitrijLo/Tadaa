"use client";
import { Button, Typography, Space } from "antd";
import Link from "next/link";
import { CSSProperties } from "react";

const { Paragraph } = Typography;
const pStyle: CSSProperties = {
  fontSize: "1.25rem",
  color: "var(--colorTextSecondary)",
  marginBottom: "30px",
};

export default function CallToActionSection() {
  return (
    <Space orientation="vertical" size="large" style={{ width: "100%" }}>
      <img src="/logo.png" alt="Logo Tadaa" />
      <Paragraph style={pStyle}>
        Organisiere dein Wichtelevent mühelos und überrasche deine Freunde,
        Familie oder Kollegen!
      </Paragraph>
      <Space size="middle" wrap>
        <Link href="/register">
          <Button type="primary" variant="solid" size="large">
            Registrieren
          </Button>
        </Link>
      </Space>
    </Space>
  );
}
