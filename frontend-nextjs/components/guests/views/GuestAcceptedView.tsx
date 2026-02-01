"use client";

import { Divider } from "antd";
import InterestNoteComponent from "../interests/InterestNoteComponent";
import InterestOptionComponent from "../interests/InterestComponent";
import { useMemo } from "react";
import { Typography } from "antd";
import { formatGermanDateTime } from "@/utils/formatters";

const { Paragraph, Text } = Typography;

export default function GuestAcceptedView({ guest }: { guest: Guest }) {
  const { id: guestId } = guest;

  const formattedDate = useMemo(
    () => formatGermanDateTime(guest.event.eventDate),
    [guest.event.eventDate],
  );

  const formattedDraftDate = useMemo(
    () => formatGermanDateTime(guest.event.draftDate),
    [guest.event.draftDate],
  );

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
