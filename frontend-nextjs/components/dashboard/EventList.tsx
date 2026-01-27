"use client";
import { getEventModeConfig } from "@/utils/event-helpers";
import { Avatar, Pagination, Typography } from "antd";
import Link from "next/link";
import { useState } from "react";

const { Text, Title } = Typography;
const PAGE_SIZE = 5;

interface EventListProps {
  events: EventResponse[];
  title?: string;
}

export const EventList = ({ events, title }: EventListProps) => {
  if (events.length === 0) return null;
  const [currentPage, setCurrentPage] = useState(1);
  const pageCount = Math.ceil(events.length / PAGE_SIZE);
  const startIdx = (currentPage - 1) * PAGE_SIZE;
  const eventsToShow = events.slice(startIdx, startIdx + PAGE_SIZE);

  return (
    <div className="mt-8">
      {title && <Title level={4}>{title}</Title>}
      <div className="flex flex-col gap-2">
        {eventsToShow.map((item) => {
          const mode = getEventModeConfig(item.eventMode);
          return (
            <Link
              className="group block"
              key={item.id}
              href={`/dashboard/events/${item.id}`}
            >
              <div
                className="bg-white rounded-md p-4 shadow-sm border border-gray-200 transition-colors duration-200 hover:bg-gray-100 flex items-center justify-between"
                style={{ borderLeft: `4px solid ${mode.color}` }}
              >
                {/*Linker Teil: Icon + Text*/}
                <div className="pl-5 flex-1 flex items-start gap-4">
                  <Avatar
                    style={{ backgroundColor: mode.color }}
                    icon={mode.icon}
                  />
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                      {item.name}
                    </span>
                    <div className="text-xs text-gray-400">
                      {new Date(item.eventDate).toLocaleDateString("de-DE")} •{" "}
                      {item.status}
                    </div>
                  </div>
                </div>

                {/* Rechter Teil: Preis*/}
                <div className="pr-5 hidden sm:block min-w-20 text-right">
                  <Text strong>
                    {item.budget} {item.currency}
                  </Text>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/*Pagination*/}
      {pageCount > 1 && (
        <div className="mt-4 flex justify-center">
          <Pagination
            current={currentPage}
            pageSize={PAGE_SIZE}
            total={events.length}
            onChange={(page) => setCurrentPage(page)}
            size="small"
            showSizeChanger={false}
          />
        </div>
      )}
    </div>
  );
};
