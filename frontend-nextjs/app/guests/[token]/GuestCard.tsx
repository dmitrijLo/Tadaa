"use client";

import { Card, Divider } from "antd";
import { notFound } from "next/navigation";
import RevealPartner from "@/components/guests/views/RevealPartner";
import InvitationStatus from "@/components/guests/views/InvitationStatus";
import GuestAcceptedView from "@/components/guests/views/GuestAcceptedView";
import GuestDeniedView from "@/components/guests/views/GuestDeniedView";
import GuestDeniedDoneView from "@/components/guests/views/GuestDeniedDoneView";
import GuestDeniedAssignedView from "@/components/guests/views/GuestDeniedAssignedView";
import GuestDraftView from "@/components/guests/views/GuestDraftView";
import GuestEventDoneView from "@/components/guests/views/GuestEventDoneView";
import GuestProgressSteps from "@/components/guests/views/GuestProgressSteps";
import { EventStatus, InviteStatus } from "@/types/enums";

const getViewForState = (
  inviteStatus: string,
  eventStatus: string,
  guest: Guest,
): React.ReactNode => {
  if (inviteStatus === InviteStatus.DENIED) {
    switch (eventStatus) {
      case EventStatus.DONE:
        return <GuestDeniedDoneView guest={guest} />;
      case EventStatus.ASSIGNED:
        return <GuestDeniedAssignedView guest={guest} />;
      case EventStatus.INVITED:
        return <GuestDeniedView guest={guest} />;
    }
  }

  if (inviteStatus === InviteStatus.ACCEPTED) {
    switch (eventStatus) {
      case EventStatus.DONE:
        return <GuestEventDoneView guest={guest} />;
      case EventStatus.ASSIGNED:
        return <RevealPartner guest={guest} />;
      case EventStatus.INVITED:
        return <GuestAcceptedView guest={guest} />;
    }
  }

  if (inviteStatus === InviteStatus.OPENED) {
    if (eventStatus === EventStatus.INVITED) {
      return <InvitationStatus guest={guest} />;
    }
  }

  if (inviteStatus === InviteStatus.INVITED) {
    if (eventStatus === EventStatus.INVITED) {
      return <InvitationStatus guest={guest} />;
    }
  }

  if (inviteStatus === InviteStatus.DRAFT) {
    return <GuestDraftView guest={guest} />;
  }

  return null;
};

export default function GuestCard({ guest }: { guest: Guest }) {
  if (!guest) notFound();

  const view = getViewForState(guest.inviteStatus, guest.event.status, guest);

  if (!view) {
    return notFound();
  }

  const showProgress =
    guest.inviteStatus !== InviteStatus.DRAFT &&
    guest.inviteStatus !== InviteStatus.DENIED;

  return (
    <Card
      title={`Willkommen, ${guest.name} zu ${guest.event.name}!`}
      styles={{ header: { textAlign: "center" } }}
    >
      {showProgress && (
        <>
          <GuestProgressSteps
            inviteStatus={guest.inviteStatus}
            eventStatus={guest.event.status}
          />
          <Divider />
        </>
      )}
      {view}
    </Card>
  );
}
