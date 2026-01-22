"use client";

import { Card, Divider } from "antd";
import { notFound } from "next/navigation";
import InterestOptionComponent from "@/components/guests/interests/InterestComponent";
import InterestNoteComponent from "@/components/guests/interests/InterestNoteComponent";
import RevealPartner from "@/components/guest/RevealPartner";
import InvitationStatus from "@/components/guest/InvitationStatus";

export default function GuestCard({ guest }: { guest: Guest }) {
  const { id: guestId } = guest;
  if (!guest) notFound();

  const renderView = () => {
    // Invitation pending response
    if (guest.event.status === "invited" && guest.inviteStatus === "opened")
      return <InvitationStatus guest={guest} />;

    // Guest accepted - show interest selection
    if (guest.event.status === "invited" && guest.inviteStatus === "accepted")
      return (
        <>
          <InterestOptionComponent guest={guest} guestId={guestId} />
          <Divider />
          <InterestNoteComponent guestId={guestId} />
        </>
      );

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
