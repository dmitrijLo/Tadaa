"use client";
import { useGuestStore } from "@/stores/useGuestsStore";
import { api, BACKEND_URL } from "@/utils/api";
import { App } from "antd";
import { useEffect, useRef, useState } from "react";
import { InviteStatus } from "@/types/enums";

export const useGuestInvitations = (eventId: string) => {
  const { message } = App.useApp();
  const [isSending, setIsSending] = useState(false);
  const { markInviteStatusAs } = useGuestStore();

  const eventSourceRef = useRef<EventSource | null>(null);
  const progressRef = useRef({ total: 0, current: 0 });

  useEffect(() => {
    return () => {
      closeConnection();
    };
  }, []);

  const closeConnection = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
  };

  const checkCompletion = () => {
    const { total, current } = progressRef.current;
    if (total > 0 && current >= total) {
      message.success("Alle Einladungen wurden Verarbeitet.");
      closeConnection();
      setIsSending(false);
    }
  };

  const sendInvitations = async () => {
    if (isSending) return;
    setIsSending(true);

    progressRef.current = { total: 0, current: 0 };

    try {
      closeConnection();
      const sse = new EventSource(
        `${BACKEND_URL}/events/${eventId}/mail-stream`,
      );
      eventSourceRef.current = sse;

      sse.onmessage = (e) => {
        try {
          const data = JSON.parse(e.data);

          if (!data || !data.status) return;

          const { status, guestId, reason } = data;
          if (status === "SUCCESS") {
            markInviteStatusAs(guestId, InviteStatus.INVITED);
            progressRef.current.current++;
          } else if (status === "ERROR") {
            markInviteStatusAs(guestId, InviteStatus.ERROR);
            message.error(`Fehler bei Gast (Mail): ${reason}`);
            progressRef.current.current++;
          }

          checkCompletion();
        } catch (err) {
          console.error("SSE Parse Error", err);
        }
      };

      sse.onerror = () => {
        console.warn("SSE Connection lost on error");
      };

      const response = await api.post(`/events/${eventId}/guests/invite`);
      const totalCount = response.data.queueCount || 0;
      progressRef.current.total = totalCount;
      console.log(`Expecting ${totalCount} updates...`);

      if (totalCount === 0) {
        message.info(
          "Es gibt keine neuen Gäste, die eingeladen werden müssen.",
        );
        closeConnection();
        setIsSending(false);
        return;
      }

      checkCompletion();
    } catch (err) {
      console.error(err);
      closeConnection();
      setIsSending(false);
      message.error("Konnte das Versenden der Eiladungen nicht starten.");
    }
  };

  return { sendInvitations, isSending };
};
