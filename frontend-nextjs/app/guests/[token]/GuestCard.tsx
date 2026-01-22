"use client";

import { Card } from "antd";
import { notFound } from "next/navigation";
import RevealPartner from "@/components/guest/RevealPartner";
import InvitationStatus from "@/components/guest/InvitationStatus";
import GuestAcceptedView from "@/components/guests/views/GuestAcceptedView";

export default function GuestCard({ guest }: { guest: Guest }) {
  if (!guest) notFound();

  const renderView = () => {
    // Invitation pending response
    if (guest.event.status === "invited" && guest.inviteStatus === "opened")
      return <InvitationStatus guest={guest} />;

    // Guest accepted - show interest selection
    if (guest.event.status === "invited" && guest.inviteStatus === "accepted")
      return <GuestAcceptedView guest={guest} />;

    // Assignment done - reveal partner
    if (guest.event.status === "assigned")
      return <RevealPartner guest={guest} />;

    return notFound();
  };

  return (
    <Card title={`Welcome, ${guest.name} to ${guest.event.name}`}>
      {renderView()}
    </Card>
  );
}
