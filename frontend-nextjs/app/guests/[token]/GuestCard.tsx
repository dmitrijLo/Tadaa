"use client";

import { Guest } from "@/types/guest";
import { Card, Typography } from "antd";

const { Title, Text, Paragraph } = Typography;

export default function GuestCard({ guest }: { guest: Guest }) {
  return (
    <Card className="max-w-md w-full">
      <Title level={1}>Welcome, {guest.name}!</Title>
      <Paragraph>
        <Text strong>Event:</Text> {guest.event.name}
      </Paragraph>
      <div className="mt-6">
        <Paragraph>
          <Text type="secondary">Status:</Text> {guest.inviteStatus}
        </Paragraph>
        <Paragraph>
          <Text type="secondary">Email:</Text> {guest.email}
        </Paragraph>
      </div>
    </Card>
  );
}
