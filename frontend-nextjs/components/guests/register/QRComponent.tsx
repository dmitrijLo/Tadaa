"use client";

import { QRCode, Card, Button } from "antd";
import Link from "next/link";

export default function QRComponent({ eventId }: { eventId: string }) {
  const signupPath = `/guests/register/${eventId}/signup`;
  const signupUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}${signupPath}`
      : signupPath;

  return (
    <Card title="Scan to Register">
      <QRCode value={signupUrl} size={200} />
      <Link href={signupPath}>
        <Button type="primary" block style={{ marginTop: 16 }}>
          Go to Signup
        </Button>
      </Link>
    </Card>
  );
}
