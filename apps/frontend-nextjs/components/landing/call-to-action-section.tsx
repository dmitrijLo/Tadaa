"use client";
import { Button, Typography } from "antd";
import Link from "next/link";
import { CSSProperties } from "react";

const { Title, Paragraph } = Typography;
const pStyle: CSSProperties = {
  fontSize: "1.25rem",
  color: "#666",
  marginBottom: "30px",
};

export default function CallToActionSection() {
  return (
    <div>
      <Title level={1} style={{ fontSize: "4rem", marginBottom: "10px" }}>
        Tadaa
      </Title>
      <Paragraph style={pStyle}>Subtitle test</Paragraph>
      <Link href="/register">
        <Button type="primary" variant="solid" size="large" shape="round">
          Get started
        </Button>
      </Link>
    </div>
  );
}
