"use client";
import { eventModeByModusMock } from "@/constants/modes";
import { eventModeByModus } from "@/constants/eventStates";
import { Badge, Card, Col, Row, Statistic, Tag, Typography } from "antd";
import Link from "next/link";
import { GuestInvitationProgress } from "../guest/GuestInvitationProgress";
import { useMemo } from "react";
import { formatGermanDateTime } from "@/utils/formatters";
import { drawRuleByRuleMock } from "@/constants/drawRules";

const { Text } = Typography;

interface FeaturedEventProps {
  event: EventResponse;
  stats?: GuestStatsResponse;
}

export const FeaturedEventCard = ({ event, stats }: FeaturedEventProps) => {
  const modeConfig = eventModeByModusMock[event.eventMode];
  const drawRuleConfig = drawRuleByRuleMock[event.drawRule];
  const { totalGuests, accepted, denied, open } = stats || {
    totalGuests: 0,
    accepted: 0,
    denied: 0,
    open: 0,
  };

  const cardStyle = {
    borderColor: `var(--ant-${modeConfig.color}-3)`,
    boxShadow: `0 4px 20px -5px var(--ant-${modeConfig.color}-3)`,
  };

  const formattedEventDate = useMemo(
    () => formatGermanDateTime(event.eventDate),
    [event.eventDate],
  );
  return (
    <Badge.Ribbon
      text={eventModeByModus[event.status]?.label || event.status}
      color={eventModeByModus[event.status]?.color || "default"}
    >
      <Link className="block group" href={`/dashboard/events/${event.id}`}>
        <Card
          hoverable
          className="bg-white mb-8 border-4 transition-colors duration-300 hover:bg-gray-100"
          style={cardStyle}
          title={
            <div className="flex items-center gap-2">
              <span
                style={{
                  color: `var(--ant-${modeConfig.color}-5)`,
                  fontSize: "1.2rem",
                }}
              >
                {modeConfig.icon}
              </span>
              <span>{event.name}</span>
            </div>
          }
        >
          <Text type="secondary" className="block mb-4 line-clamp-2">
            {event.description || "Keine Beschreibung verfügbar."}
          </Text>
          <div className="flex gap-2 justify-start font-normal mb-4 flex-wrap">
            <Tag color={modeConfig.color} variant="outlined">
              Modus: {modeConfig.name}
            </Tag>
            <Tag variant="outlined">
              Auslosung: {drawRuleConfig ? drawRuleConfig.name : "Unbekannt"}
            </Tag>
          </div>
          <div
            style={{
              display: "flex",
              gap: "32px",
              flexWrap: "wrap",
              justifyContent: "flex-start",
            }}
          >
            <div style={{ flex: "1 1 150px" }}>
              <Statistic
                title="Budget"
                value={event.budget}
                precision={2}
                suffix={event.currency === "EUR" ? "€" : "$"}
                formatter={(value) =>
                  new Intl.NumberFormat("de-DE", {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 2,
                  }).format(Number(value))
                }
              />
            </div>
            <div style={{ flex: "1 1 200px" }}>
              <Statistic title="Datum" value={formattedEventDate} />
            </div>
            <div style={{ flex: "1 1 150px" }}>
              <GuestInvitationProgress
                total={totalGuests}
                accepted={accepted}
                denied={denied}
              />
            </div>
          </div>
        </Card>
      </Link>
    </Badge.Ribbon>
  );
};
