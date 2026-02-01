"use client";

import { useState, useEffect } from "react";
import { QRCode, Card, Button, Spin, Result } from "antd";
import Link from "next/link";
import { getPublicEventInfo } from "@/utils/api";

export default function QRComponent({ eventId }: { eventId: string }) {
  const [eventName, setEventName] = useState<string | null>(null);
  const [eventError, setEventError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const signupPath = `/guests/register/${eventId}/signup`;
  const signupUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}${signupPath}`
      : signupPath;

  useEffect(() => {
    const fetchEvent = async () => {
      const result = await getPublicEventInfo(eventId);
      setLoading(false);
      if (result.error) {
        setEventError(result.error);
      } else if (result.data) {
        setEventName(result.data.name);
      }
    };
    fetchEvent();
  }, [eventId]);

  if (loading) {
    return (
      <Card>
        <Spin />
      </Card>
    );
  }

  if (eventError) {
    return (
      <Card>
        <Result status="error" title="Event nicht gefunden" />
      </Card>
    );
  }

  return (
    <Card title={eventName}>
      <QRCode value={signupUrl} size={200} />
      <Link href={signupPath}>
        <Button type="primary" block style={{ marginTop: 16 }}>
          Zur Registrierung
        </Button>
      </Link>
    </Card>
  );
}
