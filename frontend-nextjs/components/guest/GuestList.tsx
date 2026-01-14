"use client";

import { Guest } from "@/types/guest";
import { useState } from "react";
import GuestRow from "./GuestRow";

interface GuestListProps {
  eventId: string;
  initialGuests: Guest[];
}

export default function GuestList({ eventId, initialGuests }: GuestListProps) {
  const [guests, setGuests] = useState<Guest[]>(initialGuests);
  // const [isLoading, setIsLoading] = useState(true);

  const handleGuestAdded = (newGuest: Guest) => {
    setGuests((prev) => [...prev, newGuest]);
  };

  return (
    <div>
      {guests.map((guest) => (
        <GuestRow key={guest.id} eventId={eventId} guest={guest} />
      ))}

      <GuestRow eventId={eventId} onGuestAdded={handleGuestAdded} />
    </div>
  );
}
