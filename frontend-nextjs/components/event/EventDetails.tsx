"use client";

import { formatGermanDateTime } from "@/utils/formatters";
import { useWindowSize } from "@/hooks/useWindowSize";
import { eventModeByModusMock } from "@/constants/modes";
import { drawRuleByRuleMock } from "@/constants/drawRules";
import { Card, Flex, Progress, Statistic, Steps, theme } from "antd";
import type { StepsProps } from "antd";
import {
  TeamOutlined,
  UserAddOutlined,
  UserDeleteOutlined,
} from "@ant-design/icons";

type EventDetailsProps = {
  event: Event;
  guests?: Guest[];
};

const getCurrentStep = (eventStatus: string): number => {
  if (eventStatus === "draft" || eventStatus === "created") {
    return 0; // Noch nicht eingeladen
  } else if (eventStatus === "invited") {
    return 1; // Eingeladen, noch nicht ausgelost
  } else if (eventStatus === "assigned") {
    return 2; // Ausgelost, noch nicht beschenkt
  } else {
    return 3; // Event vorbei
  }
};

export default function EventDetails({
  event,
  guests = [],
}: EventDetailsProps) {
  const viewportWidth = useWindowSize().width;
  const modeInfo = eventModeByModusMock[event.eventMode];
  const drawRuleInfo = drawRuleByRuleMock[event.drawRule];
  const eventGuests = guests.length > 0 ? guests : event.guests || [];

  const guestsAll = eventGuests.length;
  const guestsAccepted = eventGuests.filter(
    (guest) => guest.inviteStatus === "accepted",
  ).length;
  const guestsDenied = eventGuests.filter(
    (guest) => guest.inviteStatus === "denied",
  ).length;

  const formattedInvitationDate = formatGermanDateTime(event.invitationDate);
  const formattedDraftDate = formatGermanDateTime(event.draftDate);
  const formattedEventDate = formatGermanDateTime(event.eventDate);

  const guestsAttending = eventGuests.filter(
    (guest) => guest.inviteStatus !== "denied",
  ).length;

  const guestsAcceptedPercent =
    Math.floor(((guestsAccepted / guestsAttending) * 100 || 0) * 10) / 10;

  const current = getCurrentStep(event.status);

  const sharedProps: StepsProps = {
    current,
    items: [
      {
        title: "Einladen",
        content: formattedInvitationDate
          ? `Am ${formattedInvitationDate}`
          : "Findet manuell statt",
      },
      {
        title: "Geschenke besorgen",
        content: formattedDraftDate
          ? `Ab ${formattedDraftDate}`
          : "Auslosung manuell starten",
      },
      {
        title: "Beschenken",
        content: formattedEventDate,
      },
    ],
  };

  return (
    <>
      <Flex vertical gap="large" style={{ marginBottom: 24 }}>
        {viewportWidth && viewportWidth < 850 ? (
          <Steps type="default" orientation="vertical" {...sharedProps} />
        ) : (
          <Steps type="panel" className="progressSteps" {...sharedProps} />
        )}
      </Flex>

      <Flex gap="large" style={{ marginBottom: 24, flexWrap: "wrap" }}>
        <div className={"accentContainer"} style={{ flex: "1 1 150px" }}>
          <Statistic
            title="Gäste (gesamt)"
            styles={{
              content: {
                fontWeight: "bold",
                fontSize: "50px",
                color: "var(--colorTextSecondary)",
              },
            }}
            prefix={<TeamOutlined />}
            value={guestsAll}
          />
        </div>

        <div className={"accentContainer"} style={{ flex: "1 1 150px" }}>
          <Statistic
            title="Gäste (zugesagt)"
            styles={{
              content: {
                color: "#3f8600",
                fontWeight: "bold",
                fontSize: "50px",
              },
            }}
            prefix={<UserAddOutlined />}
            value={guestsAccepted}
          />
        </div>

        <div className={"accentContainer"} style={{ flex: "1 1 150px" }}>
          <Statistic
            title="Gäste (abgesagt)"
            styles={{
              content: {
                color: "#cf1322",
                fontWeight: "bold",
                fontSize: "50px",
              },
            }}
            prefix={<UserDeleteOutlined />}
            value={guestsDenied}
          />
        </div>

        <div
          className={"accentContainer"}
          style={{
            flex: "1 0 auto",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Progress
            type="circle"
            steps={{ count: guestsAttending, gap: 4 }}
            percent={guestsAcceptedPercent}
            railColor="rgba(0, 0, 0, 0.06)"
            strokeWidth={20}
            style={{ fontWeight: "bold" }}
          />
        </div>
      </Flex>

      <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 250px", display: "flex" }}>
          <Card title={`Modus: ${modeInfo.name}`} style={{ width: "100%" }}>
            <div dangerouslySetInnerHTML={{ __html: modeInfo.description }} />
          </Card>
        </div>
        <div style={{ flex: "1 1 250px", display: "flex" }}>
          <Card
            title={`Auslosung: ${drawRuleInfo.name}`}
            style={{ width: "100%" }}
          >
            <div
              dangerouslySetInnerHTML={{ __html: drawRuleInfo.description }}
            />
          </Card>
        </div>
      </div>
    </>
  );
}
