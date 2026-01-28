"use client";
import { Typography, Empty } from "antd";
import { FeaturedEventCard } from "./FeaturedEventCard";
import { EventList } from "./EventList";

const { Title } = Typography;

interface Props {
  featuredEvent?: EventResponse;
  eventStats?: GuestStatsResponse;
  upcomingEvents?: EventResponse[];
  pastEvents?: EventResponse[];
}

export default function DashboardEvents({
  featuredEvent,
  eventStats,
  upcomingEvents,
  pastEvents,
}: Props) {
  if (!featuredEvent) return <Empty description="Keine Events gefunden" />;
  return (
    <>
      <Title level={1} style={{ textAlign: "left", marginBottom: "24px" }}>
        Deine Events
      </Title>

      <div className="max-w-4xl mx-auto p-4">
        <Title level={2}>Nächstes Highlight</Title>
        <FeaturedEventCard event={featuredEvent} stats={eventStats} />

        <EventList
          events={upcomingEvents || []}
          title="Weitere geplante Events"
        />
        <EventList events={pastEvents || []} title="Vergangene Events" />
      </div>
    </>
  );
}
