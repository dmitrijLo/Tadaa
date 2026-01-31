"use client";

import { Result, Typography, Button, App } from "antd";
import { UserAddOutlined } from "@ant-design/icons";
import { useState } from "react";
import { api } from "@/utils/api";

const { Paragraph, Text } = Typography;

export default function GuestDeniedView({ guest }: { guest: Guest }) {
  const { message } = App.useApp();
  const [loading, setLoading] = useState(false);

  const handleRejoin = async () => {
    setLoading(true);
    try {
      await api.patch(`/guests/${guest.id}/acceptinvitation`, {
        accept: true,
        declineMessage: null,
      });
      message.success("Willkommen zurück! Du nimmst jetzt teil.");
      window.location.reload();
    } catch (error) {
      message.error("Fehler beim Reaktivieren der Teilnahme");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Result
      icon={<UserAddOutlined style={{ color: "#faad14" }} />}
      title="Du hast abgesagt"
      subTitle="Du bist aktuell als 'Nicht teilnehmend' markiert."
      extra={
        <div className="space-y-4">
          <div className="text-left bg-gray-50 p-4 rounded-lg border border-gray-100">
            <Paragraph type="secondary" className="text-sm m-0">
              <Text strong italic>
                Meinung geändert?
              </Text>{" "}
              <Text type="secondary">
                Kein Problem! Da die Auslosung noch nicht stattgefunden hat,
                kannst du deine Teilnahme noch reaktivieren.
              </Text>
            </Paragraph>
          </div>
          <Button
            type="primary"
            size="large"
            block
            loading={loading}
            onClick={handleRejoin}
          >
            Doch teilnehmen
          </Button>
        </div>
      }
    />
  );
}
