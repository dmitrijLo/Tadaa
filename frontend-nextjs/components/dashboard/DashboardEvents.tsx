"use client";
import Link from "next/link";
import { Card, Typography, Empty } from "antd";

const { Title } = Typography;

export interface EventSummary {
  id: string;
  name: string;
}

interface Props {
  events: EventSummary[];
}

export default function DashboardEvents({ events }: Props) {
  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      {/* Der Container mit dunklerem Hintergrund & Schatten */}
      <div className="w-full max-w-md bg-gray-50 p-8 rounded-xl shadow-lg border border-gray-200">
        <Title level={3} style={{ textAlign: "center", marginBottom: "24px" }}>
          Deine Events
        </Title>

        {events.length === 0 ? (
          <Empty description="Keine Events gefunden" />
        ) : (
          <div className="flex flex-col gap-3">
            {events.map((event) => (
              <Link
                key={event.id}
                href={`/dashboard/events/${event.id}`}
                style={{ display: "block" }}
              >
                <Card
                  hoverable
                  size="small"
                  className="text-center font-medium"
                >
                  {event.name}
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
