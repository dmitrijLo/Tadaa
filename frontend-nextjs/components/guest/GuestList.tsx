"use client";

import { useState } from "react";
import styles from "./Guest.module.css";
import { Guest } from "@/types/guest";
import GuestRow from "./GuestRow";
import { Typography, Divider } from "antd";

const { Title } = Typography;

interface GuestListProps {
  eventId: string;
  initialGuests: Guest[];
}

export default function GuestList({ eventId, initialGuests }: GuestListProps) {
  const [guests, setGuests] = useState<Guest[]>(initialGuests);

  const handleGuestAdded = (newGuest: Guest) => {
    setGuests((prev) => [...prev, newGuest]);
  };

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
        <GuestRow eventId={eventId} onGuestAdded={handleGuestAdded} />
      </div>
    </div>
  );
}
