"use client";

import { Divider, Card } from "antd";
import InterestNoteComponent from "../interests/InterestNoteComponent";
import InterestOptionComponent from "../interests/InterestComponent";

export default function GuestAcceptedView({ guest }: { guest: Guest }) {
  const { id: guestId } = guest;
  return (
    <Card
      size="small"
      className="max-w-md w-full shadow-2xl animate-in fade-in duration-700"
    >
      <InterestOptionComponent guest={guest} guestId={guestId} />
      <Divider />
      <InterestNoteComponent guestId={guestId} />
    </Card>
  );
}
