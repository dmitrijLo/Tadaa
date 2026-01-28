"use client";

import {
  Card,
  Typography,
  Button,
  Input,
  Space,
  message,
  Popconfirm,
} from "antd";
import { notFound } from "next/navigation";

import { useEffect, useState } from "react";
import { api } from "@/utils/api";

const { TextArea } = Input;
const { Title, Text } = Typography;

const handleResponse = async (
  guestId: string,
  accept: boolean,
  declineMessage: string,
) => {
  console.log(guestId, accept, declineMessage);
  try {
    await api.patch(`/guests/${guestId}/acceptinvitation`, {
      accept,
      declineMessage,
    });

    message.success(accept ? "Einladung angenommen!" : "Einladung abgelehnt");
    window.location.reload();
  } catch (error) {
    message.error("Fehler beim Verarbeiten der Antwort");
    console.error(error);
  }
};

export default function InvitationStatus({ guest }: { guest: Guest }) {
  const { id: guestId } = guest;
  const [declineMessage, setDeclineMessage] = useState<string>("");

  if (!guest) notFound();

  const handleSubmit = (accept: boolean) => {
    handleResponse(guestId, accept, declineMessage);
  };

  return (
    <Card>
      <Title>Möchtest du teilnehmen?</Title>
      <Space orientation="vertical" style={{ width: "100%" }}>
        <Button
          type="primary"
          size="large"
          block
          onClick={() => handleSubmit(true)}
        >
          Teilnehmen
        </Button>

        <Popconfirm
          title="Möchtest du die Einladung wirklich ablehnen?"
          description={
            <div>
              <Text>
                Optional: Du kannst hier einen Grund für die Ablehnung angeben:
              </Text>
              <TextArea
                placeholder="Ich bin leider verhindert..."
                value={declineMessage}
                onChange={(e) => setDeclineMessage(e.target.value)}
                rows={3}
              />
            </div>
          }
          onConfirm={() => handleSubmit(false)}
          okText="Absage senden"
          cancelText="Abbrechen"
        >
          <Button danger size="large" block>
            Ablehnen
          </Button>
        </Popconfirm>
      </Space>
    </Card>
  );
}
