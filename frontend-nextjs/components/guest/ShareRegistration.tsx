"use client";

import { useState } from "react";
import { Button, Modal, QRCode, App, Tooltip } from "antd";
import { LinkOutlined, QrcodeOutlined } from "@ant-design/icons";

interface ShareRegistrationProps {
  eventId: string;
  eventName: string;
}

export default function ShareRegistration({
  eventId,
  eventName,
}: ShareRegistrationProps) {
  const { message } = App.useApp();
  const [modalOpen, setModalOpen] = useState(false);

  const signupPath = `/guests/register/${eventId}/signup`;
  const signupUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}${signupPath}`
      : signupPath;

  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(signupUrl);
    message.success("Registrierungslink kopiert!");
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <Tooltip title="Registrierungslink kopieren">
        <Button
          type="text"
          icon={<LinkOutlined />}
          onClick={handleCopyLink}
        />
      </Tooltip>
      <Tooltip title="QR-Code anzeigen">
        <Button
          type="text"
          icon={<QrcodeOutlined />}
          onClick={() => setModalOpen(true)}
        />
      </Tooltip>

      <Modal
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={
          <Button type="primary" onClick={handlePrint}>
            Drucken
          </Button>
        }
        title="QR-Code für Registrierung"
      >
        <div id="qr-print-area" style={{ textAlign: "center", padding: "20px" }}>
          <img
            src="/logo.png"
            alt="Logo"
            style={{ height: 50, marginBottom: 16 }}
          />
          <h2 style={{ margin: "0 0 20px 0" }}>{eventName}</h2>
          <QRCode value={signupUrl} size={250} icon="/logo.png" />
        </div>
      </Modal>

      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #qr-print-area,
          #qr-print-area * {
            visibility: visible;
          }
          #qr-print-area {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
          }
        }
      `}</style>
    </>
  );
}
