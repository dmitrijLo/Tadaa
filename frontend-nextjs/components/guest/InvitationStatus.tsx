"use client";

import { Card, Typography, Button, Input, Space, message } from "antd";
import { notFound } from "next/navigation";

import { useState } from "react";
import { api } from "@/utils/api";

const { Text, Paragraph, Title } = Typography;
const { TextArea } = Input;

export default function InvitationStatus({ guest }: { guest: Guest }) {
  const { id: guestId } = guest;
  const [loading, setLoading] = useState(false);
  const [declineMessage, setDeclineMessage] = useState("");

  if (!guest) notFound();

  const handleResponse = async (accept: boolean) => {
    setLoading(true);
    try {
      await api.patch(`/guests/${guestId}/acceptinvitation`, {
        accept,
        declineMessage: accept ? undefined : declineMessage,
      });

      message.success(accept ? "Einladung angenommen!" : "Einladung abgelehnt");
      window.location.reload();
    } catch (error) {
      message.error("Fehler beim Verarbeiten der Antwort");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  {
    return (
      <Card>
        <Title>Möchtest du teilnehmen?</Title>
        <Space orientation="vertical" style={{ width: "100%" }}>
          <Button
            type="primary"
            size="large"
            block
            onClick={() => handleResponse(true)}
            loading={loading}
          >
            Teilnehmen
          </Button>

          <TextArea
            placeholder="Optional: Grund für Ablehnung"
            value={declineMessage}
            onChange={(e) => setDeclineMessage(e.target.value)}
            rows={3}
          />

          <Button
            danger
            size="large"
            block
            onClick={() => handleResponse(false)}
            loading={loading}
          >
            Ablehnen
          </Button>
        </Space>
      </Card>
    );
  }
}
