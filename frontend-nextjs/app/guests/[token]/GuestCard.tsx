"use client";

import { Card, Typography, Divider } from "antd";
import { notFound } from "next/navigation";
import InterestOptionComponent from "@/components/guests/interests/InterestComponent";
import InterestNoteComponent from "@/components/guests/interests/InterestNoteComponent";
import RevealPartner from "@/components/guest/RevealPartner";

const { Text, Paragraph } = Typography;

export default function GuestCard({ guest }: { guest: Guest }) {
  const { id: guestId } = guest;
  if (!guest) notFound();

  console.log(guest);

  if (guest.event.status === "invited" && guest.inviteStatus === "opened")
    return <>do wou wnat to participate </>;

  if (guest.event.status === "invited" && guest.inviteStatus === "accepted")
    return (
      <>
        normale view, wo man dann auswaehelen kann was man mag und submitted
        <Card title={`Welcome, ${guest.name} to ${guest.event.name}`}>
          <Paragraph>
            <Text type="secondary">Status:</Text> {guest.inviteStatus}
          </Paragraph>
          <Divider />
          <InterestOptionComponent guest={guest} guestId={guestId} />
          <Divider />
          <InterestNoteComponent guestId={guestId} />
        </Card>
      </>
    );

  if (guest.event.status === "assigned")
    return (
      <>
        Ansicht ueber interesses des Wichtelpartners
        <RevealPartner guest={guest} />
      </>
    );

  return notFound();
}
