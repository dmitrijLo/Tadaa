"use client";
import Link from "next/link";
import { Card, Typography, Empty, Button, Popconfirm } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { api, BACKEND_URL } from "@/utils/api";

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
    <>
      {/* Der Container mit dunklerem Hintergrund & Schatten */}
      <Title level={1} style={{ textAlign: "left", marginBottom: "24px" }}>
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
              <Card hoverable size="small" className="text-center font-medium">
                {event.name}
              </Card>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
