"use client";

import { Tabs, App, Modal, Divider, Button } from "antd";
import type { TabsProps } from "antd";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
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

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const handleOk = async () => {
    try {
      setConfirmLoading(true);
      await api.delete(`/events/${eventId}`);
      message.success("Event wurde gelöscht");
      setDeleteModalOpen(false);
      router.push("/dashboard");
    } catch (error) {
      console.error("Fehler beim Löschen des Events:", error);
      message.error("Event konnte nicht gelöscht werden");
    } finally {
      setConfirmLoading(false);
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
            onDelete={() => setDeleteModalOpen(true)}
          />
        )}
        {activeTab === "3" && (
          <GuestList eventId={eventId} initialGuests={initialGuests} />
        )}
      </div>
      <Modal
        title={`Event "${eventData.name}" wirklich löschen?`}
        centered
        open={deleteModalOpen}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={() => setDeleteModalOpen(false)}
        footer={[
          <Button
            key="submit"
            type="primary"
            loading={confirmLoading}
            onClick={handleOk}
          >
            Löschen
          </Button>,
        ]}
      >
        <div
          style={{
            display: "flex",
            gap: "8px",
            marginBottom: "16px",
            color: "var(--colorTextTertiary)",
          }}
        >
          <span>{formattedDate}</span>
          <span>|</span>
          <span>
            {initialGuests.length} <TeamOutlined />
          </span>
        </div>
        <Divider />
        <p>
          Wenn du dieses Event löschst, gehen alle Inhalte und Gäste verloren.
        </p>
        <p>Dies kann nicht rückgängig gemacht werden.</p>
      </Modal>
    </div>
  );
}
