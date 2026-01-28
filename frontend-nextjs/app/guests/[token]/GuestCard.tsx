"use client";

import { Card, Result } from "antd";
import { notFound } from "next/navigation";
import RevealPartner from "@/components/guests/views/RevealPartner";
import InvitationStatus from "@/components/guests/views/InvitationStatus";
import GuestAcceptedView from "@/components/guests/views/GuestAcceptedView";
import GuestDeniedView from "@/components/guests/views/GuestDeniedView";
import GuestDeniedDoneView from "@/components/guests/views/GuestDeniedDoneView";
import GuestDeniedAssignedView from "@/components/guests/views/GuestDeniedAssignedView";

export default function GuestCard({ guest }: { guest: Guest }) {
  if (!guest) notFound();

  const renderView = () => {
    if (guest.inviteStatus === "denied") {
      if (guest.event.status === "done")
        return <GuestDeniedDoneView guest={guest} />;

      if (guest.event.status === "assigned")
        return <GuestDeniedAssignedView guest={guest} />;

      if (guest.event.status === "invited")
        return <GuestDeniedView guest={guest} />;
    }
    
    // Assignment done - reveal partner
    if (guest.event.status === "assigned" && guest.inviteStatus === "accepted")
      return <RevealPartner guest={guest} />;

    if (guest.event.status === "invited") {
      // Invitation pending response
      if (guest.inviteStatus === "opened")
        return <InvitationStatus guest={guest} />;

      // Guest accepted - show interest selection
      if (guest.inviteStatus === "accepted")
        return <GuestAcceptedView guest={guest} />;
    }

    // Newly registered guest (draft status)
    if (guest.inviteStatus === "draft") {
      return (
        <Result
          status="success"
          title="Du bist registriert!"
          subTitle="Du wirst benachrichtigt, sobald die Einladung verschickt wird."
        />
      );
    }

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
