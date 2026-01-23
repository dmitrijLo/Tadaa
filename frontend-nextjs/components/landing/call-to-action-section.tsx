"use client";
import { Button, Typography, Space } from "antd";
import Link from "next/link";
import { CSSProperties } from "react";

const { Title, Paragraph } = Typography;
const pStyle: CSSProperties = {
  fontSize: "1.25rem",
  color: "rgba(255, 255, 255, 0.9)",
  marginBottom: "30px",
};

export default function CallToActionSection() {
  return (
    <Space orientation="vertical" size="large" style={{ width: "100%" }}>
      <Title
        level={1}
        style={{
          fontSize: "4rem",
          marginBottom: "10px",
          color: "rgba(255, 255, 255, 0.9)",
        }}
      >
        Tadaa
      </Title>
      <Paragraph style={pStyle}>
        Organisiere dein Wichtelevent mühelos und überrasche deine Freunde,
        Familie oder Kollegen!
      </Paragraph>
      <Space size="middle" wrap>
        <Link href="/register">
          <Button type="primary" variant="solid" size="large" shape="round">
            Registrieren
          </Button>
        </Link>
      </Space>
    </Space>
  );
}
