"use client";

import { Tabs, App } from "antd";
import type { TabsProps } from "antd";
import { useState, useMemo } from "react";
import { EventSettings, GuestList } from "@/components";
import { api } from "@/utils/api";
import { Typography } from "antd";
import { formatGermanDateTime } from "@/utils/formatters";
import {
  ClockCircleOutlined,
  GiftOutlined,
  PieChartOutlined,
  SettingOutlined,
  TeamOutlined,
} from "@ant-design/icons";

const { Title } = Typography;

const items: TabsProps["items"] = [
  {
    key: "1",
    label: "Übersicht",
    icon: <PieChartOutlined />,
  },
  {
    key: "2",
    label: "Einstellungen",
    icon: <SettingOutlined />,
  },
  {
    key: "3",
    label: "Gäste",
    icon: <TeamOutlined />,
  },
  {
    key: "4",
    label: "Ergebnis",
    icon: <GiftOutlined />,
    disabled: true,
  },
];

type EventDetailTabsProps = {
  eventId: string;
  initialEvent: Event;
  initialGuests: Guest[];
};

export default function EventDetailTabs({
  eventId,
  initialEvent,
  initialGuests,
}: EventDetailTabsProps) {
  const { message } = App.useApp();
  const [activeTab, setActiveTab] = useState<string>("1");
  const [eventData, setEventData] = useState<Event>(initialEvent);

  const formattedDate = useMemo(
    () => formatGermanDateTime(eventData.eventDate),
    [eventData.eventDate],
  );

  const onChange = (key: string) => {
    setActiveTab(key);
  };

  const handleUpdateEvent = async (values: CreateEventDto) => {
    try {
      const updateData: UpdateEventDto = {
        name: values.name,
        description: values.description,
        budget: values.budget,
        eventDate: values.eventDate,
        invitationDate: values.invitationDate,
        draftDate: values.draftDate,
        eventMode: values.eventMode,
        drawRule: values.drawRule,
      };

      await api.patch(`/events/${eventId}`, updateData);
      setEventData((prevEventData) => ({ ...prevEventData, ...updateData }));
      message.success("Event wurde aktualisiert");
    } catch (error) {
      console.error("Fehler beim Aktualisieren des Events:", error);
      message.error("Event konnte nicht aktualisiert werden");
    }
  };

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Title level={1} style={{ marginBottom: 5 }}>
          {eventData.name}
        </Title>
        <div className={"sub-title"}>
          <ClockCircleOutlined />
          <span suppressHydrationWarning>{formattedDate}</span>
        </div>
      </div>
      <Tabs activeKey={activeTab} items={items} onChange={onChange} />
      <div style={{ marginTop: 12 }}>
        {activeTab === "1" && <div>Details</div>}
        {activeTab === "2" && (
          <EventSettings
            onSubmit={handleUpdateEvent}
            initialData={eventData}
            submitLabel={"Speichern"}
          />
        )}
        {activeTab === "3" && (
          <GuestList eventId={eventId} initialGuests={initialGuests} />
        )}
      </div>
    </div>
  );
}
