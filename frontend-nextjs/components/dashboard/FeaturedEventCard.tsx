"use client";
import { getEventModeConfig, getEventStatusColor } from "@/utils/event-helpers";
import { Badge, Card, Col, Row, Statistic, Tag, Typography } from "antd";
import Link from "next/link";
import { GuestInvitationProgress } from "../guest/GuestInvitationProgress";

const { Text } = Typography;

interface FeaturedEventProps {
  event: EventResponse;
  stats?: GuestStatsResponse;
}

export const FeaturedEventCard = ({ event, stats }: FeaturedEventProps) => {
  const modeConfig = getEventModeConfig(event.eventMode);
  const { totalGuests, accepted, denied, open } = stats || {
    totalGuests: 0,
    accepted: 0,
    denied: 0,
    open: 0,
  };

  const cardStyle = {
    borderColor: modeConfig.color,
    boxShadow: `0 4px 20px -5px ${modeConfig.color}`,
  };
  return (
    <Badge.Ribbon text={event.status} color={getEventStatusColor(event.status)}>
      <Link className="block group" href={`/dashboard/events/${event.id}`}>
        <Card
          hoverable
          className="bg-white mb-8 border-4 transition-colors duration-300 hover:bg-gray-100"
          style={cardStyle}
          title={
            <div className="flex items-center gap-2">
              <span style={{ color: modeConfig.color, fontSize: "1.2rem" }}>
                {modeConfig.icon}
              </span>
              <span>{event.name}</span>
            </div>
          }
        >
          <Text type="secondary" className="block pl-5 pr-5 mb-4 line-clamp-2">
            {event.description || "Keine Beschreibung verfügbar."}
          </Text>
          <Row gutter={16} className="text-center mb-4 items-center">
            <Col span={8}>
              <Statistic
                title="Budget"
                value={event.budget}
                precision={2}
                prefix={event.currency === "EUR" ? "€" : "$"}
              />
            </Col>
            <Col span={8}>
              <Statistic
                title="Datum"
                value={new Date(event.eventDate).toLocaleDateString("de-DE")}
              />
            </Col>
            <Col span={8}>
              <GuestInvitationProgress
                total={totalGuests}
                accepted={accepted}
                denied={denied}
              />
            </Col>
          </Row>

          <div className="flex gap-2 justify-end">
            <Tag color={modeConfig.color}>Mode: {modeConfig.label}</Tag>
            <Tag>Draw Rule: {event.drawRule}</Tag>
          </div>
        </Card>
      </Link>
    </Badge.Ribbon>
  );
};
