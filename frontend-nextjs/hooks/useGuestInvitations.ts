import { useGuestStore } from "@/stores/useGuestsStore";
import { api, BACKEND_URL } from "@/utils/api";
import { message } from "antd";
import { useEffect, useRef, useState } from "react";
import { InviteStatus } from "@/types/enums";

export const useGuestInvitations = (eventId: string) => {
  const [isSending, setIsSending] = useState(false);
  const { markInviteStatusAs } = useGuestStore();

  const eventSourceRef = useRef<EventSource | null>(null);
  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, []);

  const sendInvitations = async () => {
    if (isSending) return;

    setIsSending(true);

    try {
      if (eventSourceRef.current) eventSourceRef.current.close();
      eventSourceRef.current = new EventSource(
        `${BACKEND_URL}/events/${eventId}/mail-stream`,
      );

      eventSourceRef.current.onmessage = (e) => {
        const { status, guestId, reason } = JSON.parse(e.data);

        switch (status) {
          case "SUCCESS":
            markInviteStatusAs(guestId, InviteStatus.INVITED);
            break;
          case "ERROR":
            markInviteStatusAs(guestId, InviteStatus.ERROR);
            message.error(`Fehler bei einer Mail: ${reason}`);
            break;
          case "DONE":
            eventSourceRef.current?.close();
            setIsSending(false);
            message.success("Alle Einladungen wurden erfolgreich verarbeitet.");
            break;
          default:
            break;
        }
      };

      eventSourceRef.current.onerror = () => {
        eventSourceRef.current?.close();
        setIsSending(false);
        message.error("Verbindung zum Server verloren.");
      };

      const response = await api.post(`/events/${eventId}/guests/invite`);
      console.log("the res:", response);
      if (response.data.queueCount === 0) {
        eventSourceRef.current.close();
        setIsSending(false);
        message.info(
          "Es gibt keine neuen Gäste, die eingeladen werden müssen.",
        );
        return;
      }
    } catch (error) {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
      setIsSending(false);
      message.error("Fehler beim Starten der Eiladungen.");
    }
  };

  return { sendInvitations, isSending };
};
