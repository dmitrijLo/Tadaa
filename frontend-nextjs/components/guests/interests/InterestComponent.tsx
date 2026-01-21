"use client";

import InterestPicker from "./InterestPicker";
import { useInterestStore } from "@/stores/useInterestStore";
import React from "react";

export default function InterestOptionComponent({
  guest,
  guestId,
}: {
  guest: Guest;
  guestId: string;
}) {
  const { fetchInterestOptions, isLoading, setInitialInterests } =
    useInterestStore();

  React.useEffect(() => {
    fetchInterestOptions();

    if (guest.interests && guest.noInterest) {
      setInitialInterests(guest.interests, guest.noInterest);
    }
  }, [fetchInterestOptions, guest, setInitialInterests]);

  return <InterestPicker guestId={guestId} isLoading={isLoading} />;
}
