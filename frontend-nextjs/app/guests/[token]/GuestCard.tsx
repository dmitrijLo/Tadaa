"use client";

import { Card, Splitter, Typography, Divider } from "antd";
import { notFound } from "next/navigation";
import InterestOptionComponent from "@/components/guests/interests/InterestComponent";
import InterestNoteComponent from "@/components/guests/interests/InterestNoteComponent";

const { Title, Text, Paragraph } = Typography;

export default function GuestCard({ guest }: { guest: Guest }) {
  const { id: guestId } = guest;
  if (!guest) notFound();

  return (
    <Card title={`Welcome, ${guest.name} to ${guest.event.name}`}>
      <Paragraph>
        <Text type="secondary">Status:</Text> {guest.inviteStatus}
      </Paragraph>
      <Divider />
      <InterestOptionComponent guest={guest} guestId={guestId} />
      <Divider />
      <InterestNoteComponent guestId={guestId} />
    </Card>
  );
}
