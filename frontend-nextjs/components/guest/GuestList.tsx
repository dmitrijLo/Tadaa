"use client";

import { useEffect } from "react";
import styles from "./Guest.module.css";
import GuestRow from "./GuestRow";
import { Typography, Divider, Button } from "antd";
import { useGuestStore } from "@/stores/useGuestsStore";
import { useGuestInvitations } from "@/hooks/useGuestInvitations";
import { InviteStatus } from "@/types/enums";
import { useGuestList } from "@/hooks/useGuestList";

const { Title } = Typography;

interface GuestListProps {
  eventId: string;
  initialGuests: Guest[];
}

export default function GuestList({ eventId, initialGuests }: GuestListProps) {
  const { sendInvitations, isSending } = useGuestInvitations(eventId);
  const guests = useGuestList();
  const { init } = useGuestStore();

  const hasGuestsToInvite = true;
  // guests.some(
  //   (guest) =>
  //     guest.inviteStatus === InviteStatus.DRAFT ||
  //     guest.inviteStatus === InviteStatus.ERROR,
  // );

  useEffect(() => {
    init(initialGuests);
  }, [eventId]);

  return (
    <div className={styles.container}>
      <div style={{ marginBottom: 16 }}>
        <Title level={4} style={{ margin: 0 }}>
          Guests ({guests.length})
        </Title>
        <span className="text-pink-500 text-sm">Verwalte hier Einladungen</span>
      </div>

      <div className={styles.container}>
        {guests.map((guest) => (
          <GuestRow
            key={guest.id}
            eventId={eventId}
            guest={guest}
            isChild={guest.isChild}
            hasChild={guest.hasChild}
          />
        ))}
        {guests.length > 0 && <Divider plain>Add Guest</Divider>}
        <GuestRow eventId={eventId} isChild={false} hasChild={false} />
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
