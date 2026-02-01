"use client";

import { ReactNode } from "react";
import { Row, Col } from "antd";
import styles from "./hero-section.module.css";

// const heroStyle: React.CSSProperties = {
//   maxWidth: 1200,
//   margin: "0 auto",
//   backgroundColor: "#111827",
//   borderRadius: "24px",
//   padding: "60px 40px",
//   color: "white",
//   boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)",
// };

interface HeroSectionProps {
  leftSlot: ReactNode;
  rightSlot: ReactNode;
}

export default function HeroSection({ leftSlot, rightSlot }: HeroSectionProps) {
  return (
    <section style={{ width: "100%" }}>
      <div className={styles.heroCard}>
        <Row gutter={[80, 80]} align="middle">
          <Col xs={24} md={12}>
            {leftSlot}
          </Col>
          <Col xs={24} md={12}>
            {rightSlot}
          </Col>
        </Row>
      </div>
    </section>
  );
}
