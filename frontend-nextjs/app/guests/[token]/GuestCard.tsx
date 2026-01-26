"use client";

import { Card } from "antd";
import { notFound } from "next/navigation";
import RevealPartner from "@/components/guests/views/RevealPartner";
import InvitationStatus from "@/components/guests/views/InvitationStatus";
import GuestAcceptedView from "@/components/guests/views/GuestAcceptedView";
import GuestDeniedView from "@/components/guests/views/GuestDeniedView";

export default function GuestCard({ guest }: { guest: Guest }) {
  if (!guest) notFound();

  const renderView = () => {
    // Guest denied invitation
    if (guest.inviteStatus === "denied")
      return <GuestDeniedView guest={guest} />;

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
    <Card
      title={`Willkommen, ${guest.name} zu ${guest.event.name}!`}
      styles={{ header: { textAlign: "center" } }}
    >
      {renderView()}
    </Card>
  );
}
