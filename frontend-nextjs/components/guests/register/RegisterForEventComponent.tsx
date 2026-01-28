"use client";

import { Card } from "antd";

export default function RegisterForEventComponent({
  eventId,
}: {
  eventId: string;
}) {
  return (
    <Card title="Register for Event">
      <p>Event ID: {eventId}</p>
    </Card>
  );
}
