"use client";

import {
  Badge,
  Card,
  Collapse,
  Progress,
  Divider,
  Typography,
  Button,
} from "antd";
import moment from "moment";
import { CSSProperties } from "react";

const { Text } = Typography;

export default function GuestListing({ guests }: { guests: Guest[] }) {
  const style: CSSProperties = {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    gap: "1rem",
  };

  const states: Record<
    InviteStatus,
    "default" | "processing" | "success" | "error"
  > = {
    draft: "default",
    invited: "default",
    opened: "processing",
    accepted: "success",
    denied: "error",
  };

  const percentOfAccepted =
    (guests.filter((guest) => guest.inviteStatus === "accepted").length /
      guests.length) *
    100;

  return (
    <Card title="Invited Guests" size="small">
      <Text>Accepted:</Text>
      <Progress percent={percentOfAccepted} size="small" />
      <Divider />
      <Collapse
        items={guests.map((guest, index) => ({
          key: index,
          label: (
            <div style={style} key={index}>
              <Badge status={states[guest.inviteStatus]} />
              <p>{guest.name}</p>
            </div>
          ),
          children: (
            <ul>
              {guest.receivedAt && (
                <li>
                  received at:
                  {moment(guest.receivedAt).format()}
                </li>
              )}
              {guest.openedAt && (
                <li>
                  opened at:
                  {moment(guest.openedAt).format()}
                </li>
              )}
              {guest.declineMessage && (
                <li>
                  decilened because:
                  {guest.declineMessage}
                </li>
              )}
            </ul>
          ),
        }))}
      />
      <Divider />
      <Button type="primary" disabled={percentOfAccepted != 100} block>
        Draw
      </Button>
    </Card>
  );
}
