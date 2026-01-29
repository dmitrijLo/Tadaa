"use client";

import { useEffect } from "react";
import styles from "./Guest.module.css";
import GuestRow from "./GuestRow";
import ShareRegistration from "./ShareRegistration";
import { Typography, Divider, Button } from "antd";
import { useGuestStore } from "@/stores/useGuestsStore";
import { useShallow } from "zustand/shallow";
import { useGuestInvitations } from "@/hooks/useGuestInvitations";
import { InviteStatus } from "@/types/enums";

const { Title } = Typography;

interface GuestListProps {
  eventId: string;
  eventName: string;
  initialGuests: Guest[];
}

export default function GuestList({ eventId, eventName, initialGuests }: GuestListProps) {
  const { sendInvitations, isSending } = useGuestInvitations(eventId);
  const { guests, setGuests } = useGuestStore(
    useShallow(({ guests, setGuests }) => ({
      guests,
      setGuests,
    })),
  );

  const hasGuestsToInvite = true;
  // guests.some(
  //   (guest) =>
  //     guest.inviteStatus === InviteStatus.DRAFT ||
  //     guest.inviteStatus === InviteStatus.ERROR,
  // );

  useEffect(() => {
    setGuests(initialGuests);
  }, [initialGuests, setGuests]);

  return (
    <div className={styles.container}>
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Title level={4} style={{ margin: 0 }}>
            Guests ({guests.length})
          </Title>
          <div style={{ display: "flex", gap: 4 }}>
            <ShareRegistration eventId={eventId} eventName={eventName} />
          </div>
        </div>
        <span className="text-pink-500 text-sm">Verwalte hier Einladungen</span>
      </div>

      <div className={styles.container}>
        {guests.map((guest) => (
          <GuestRow key={guest.id} eventId={eventId} guest={guest} />
        ))}
        {guests.length > 0 && <Divider plain>Add Guest</Divider>}
        <GuestRow eventId={eventId} />
      </div>

      <Button
        type="primary"
        // htmlType="submit"
        // disabled={!isValid}
        // loading={isSaving}
        // icon={<PlusOutlined />}
        loading={isSending}
        disabled={!hasGuestsToInvite}
        onClick={sendInvitations}
        block
      >
        {isSending
          ? "Sending Invitations..."
          : hasGuestsToInvite
            ? "Send Invitations"
            : "No Invitations to send"}
      </Button>
    </div>
  );
}
