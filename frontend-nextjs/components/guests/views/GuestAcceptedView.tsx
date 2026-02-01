"use client";

import { Divider } from "antd";
import InterestNoteComponent from "../interests/InterestNoteComponent";
import InterestOptionComponent from "../interests/InterestComponent";
import { useEffect, useState } from "react";
import { Typography } from "antd";

const { Paragraph, Text } = Typography;

export default function GuestAcceptedView({ guest }: { guest: Guest }) {
  const { id: guestId } = guest;
  const [formattedDate, setFormattedDate] = useState<string>("");
  const [formattedDraftDate, setFormattedDraftDate] = useState<string>("");

  useEffect(() => {
    setFormattedDate(
      new Date(guest.event.eventDate).toLocaleDateString("de-DE"),
    );
    setFormattedDraftDate(
      new Date(guest.event.draftDate).toLocaleDateString("de-DE"),
    );
  }, [guest.event.eventDate, guest.event.draftDate]);

  return (
    <>
      <Paragraph>
        Du hast dich erfolgreich zum Event{" "}
        <Text strong>{guest.event.name}</Text> am{" "}
        <Text strong>{formattedDate}</Text> angemeldet! Die Auslosung findet am{" "}
        <Text strong>{formattedDraftDate}</Text> statt. Danach kannst du auf
        dieser Seite sehen, wem du ein Geschenk machen darfst.
      </Paragraph>
      <InterestOptionComponent guest={guest} guestId={guestId} />
      <Divider />
      <InterestNoteComponent guestId={guestId} />
    </>
  );
}
