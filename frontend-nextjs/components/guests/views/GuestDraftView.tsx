"use client";

import { Result, Typography, Divider } from "antd";
import { ClockCircleOutlined } from "@ant-design/icons";
import GuestProgressSteps from "./GuestProgressSteps";
import { useEffect, useState } from "react";

const { Paragraph, Text } = Typography;

export default function GuestDraftView({ guest }: { guest: Guest }) {
  const [formattedInvitationDate, setFormattedInvitationDate] =
    useState<string>("");

  useEffect(() => {
    if (guest.event.invitationDate) {
      setFormattedInvitationDate(
        new Date(guest.event.invitationDate).toLocaleDateString("de-DE", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }),
      );
    }
  }, [guest.event.invitationDate]);

  return (
    <>
      <GuestProgressSteps
        inviteStatus={guest.inviteStatus}
        eventStatus={guest.event.status}
      />
      <Divider />
      <Result
        icon={<ClockCircleOutlined style={{ color: "#1890ff" }} />}
        title="Du bist registriert!"
        subTitle={
          <div className="text-center">
            <Paragraph>
              Du hast dich erfolgreich für{" "}
              <Text strong>{guest.event.name}</Text> registriert.
            </Paragraph>
            {formattedInvitationDate && (
              <Paragraph type="secondary">
                Die Einladungen werden voraussichtlich am{" "}
                <Text strong>{formattedInvitationDate}</Text> verschickt.
              </Paragraph>
            )}
            <Paragraph type="secondary" className="text-sm mt-4">
              Du erhältst eine E-Mail, sobald es losgeht. Bis dahin musst du
              nichts weiter tun.
            </Paragraph>
          </div>
        }
      />
    </>
  );
}
