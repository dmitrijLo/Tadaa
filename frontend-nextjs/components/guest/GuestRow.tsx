"use client";
import { App } from "antd";
import { AxiosError } from "axios";
import { useState } from "react";
import { useGuestStore } from "@/stores/useGuestsStore";
import { useShallow } from "zustand/shallow";
import GuestRowCard from "@/components/guest/GuestRowCard";
import GuestRowForm from "./GuestRowForm";

interface GuestRowProps {
  eventId: string;
  guest?: Guest; // EditMode wenn vorhanden, ansonsten CreateMode
  isChild: boolean;
}

export default function GuestRow({ eventId, guest, isChild }: GuestRowProps) {
  const { message } = App.useApp();
  const hasGuestData = !!guest;
  const [inEditMode, setInEditMode] = useState(!hasGuestData);
  const { removeGuest, addGuest, updateGuest } = useGuestStore(
    useShallow(({ removeGuest, addGuest, updateGuest }) => ({
      removeGuest,
      addGuest,
      updateGuest,
    })),
  );

  const handleSave = async (newGuest: CreateGuestDto): Promise<void> => {
    try {
      if (!hasGuestData) {
        await addGuest(eventId, newGuest);
        message.success("Guest added!");
      } else {
        await updateGuest(eventId, guest.id, newGuest);
        message.success("Guest updated!");
        setInEditMode(false);
      }
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof AxiosError) {
        message.error(err.response?.data?.message || "Fehler beim Speichern");
      }
      throw err;
    }
  };

  const handleOnEditClick = () => setInEditMode(true);
  const handleOnCancelClick = () => setInEditMode(false);
  const handleDelete = async () => {
    if (!hasGuestData) return;
    const result = await removeGuest(eventId, guest.id);
    if (result instanceof AxiosError) {
      message.error(result.response?.data.message || "Fehler beim Entfernen");
      return;
    }
    message.success("Guest removed!");
  };

  if (inEditMode) {
    return (
      <GuestRowForm
        eventId={eventId}
        initialData={guest}
        onSave={handleSave}
        onCancel={handleOnCancelClick}
      />
    );
  }

  return (
    <GuestRowCard
      guest={guest!}
      isChild={isChild}
      onEdit={handleOnEditClick}
      onDelete={handleDelete}
    />
  );
}
