"use client";

import { useEffect, useState } from "react";
import styles from "./Guest.module.css";
import GuestRow from "./GuestRow";
import { Typography, Divider } from "antd";
import { useGuestStore } from "@/stores/useGuestsStore";
import { useShallow } from "zustand/shallow";

const { Title } = Typography;

interface GuestListProps {
  eventId: string;
  initialGuests: Guest[];
}

export default function GuestList({ eventId, initialGuests }: GuestListProps) {
  const { guests, setGuests } = useGuestStore(
    useShallow(({ guests, setGuests }) => ({
      guests,
      setGuests,
    })),
  );

  useEffect(() => {
    setGuests(initialGuests);
  }, [initialGuests, setGuests]);

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
          <GuestRow key={guest.id} eventId={eventId} guest={guest} />
        ))}
        {guests.length > 0 && <Divider plain>Add Guest</Divider>}
        <GuestRow eventId={eventId} />
      </div>
    </div>
  );
}
