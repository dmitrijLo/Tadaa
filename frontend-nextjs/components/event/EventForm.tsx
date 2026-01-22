"use client";

import { Button, Card, App, Steps } from "antd";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import GuestList from "@/components/guest/GuestList";
import EventSettings from "@/components/event/EventSettings";
import { api } from "@/utils/api";

type EventFormProps = {
  createEvent: (formData: CreateEventDto) => Promise<{ id: string }>;
  updateEvent: (eventId: string, formData: CreateEventDto) => Promise<void>;
};

export default function EventForm({
  createEvent,
  updateEvent,
}: EventFormProps) {
  const { message } = App.useApp();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [createdEventId, setCreatedEventId] = useState<string | null>(null);
  const [guests, setGuests] = useState<Guest[]>([]);
  const [eventData, setEventData] = useState<CreateEventDto | null>(null);

  useEffect(() => {
    const fetchGuests = async () => {
      if (currentStep === 1 && createdEventId) {
        try {
          const response = await api.get<Guest[]>(
            `/events/${createdEventId}/guests`,
          );
          setGuests(response.data);
        } catch (error) {
          console.error("Fehler beim Laden der Gäste:", error);
        }
      }
    };

    fetchGuests();
  }, [currentStep, createdEventId]);

  const handleGuestAdded = () => {
    if (createdEventId) {
      api
        .get<Guest[]>(`/events/${createdEventId}/guests`)
        .then((response: { data: Guest[] }) => setGuests(response.data))
        .catch((error: unknown) =>
          console.error("Fehler beim Laden der Gäste:", error),
        );
    }
  };

  const onSubmit = async (values: CreateEventDto) => {
    setEventData(values);

    if (createdEventId) {
      // Event existiert bereits, update durchführen
      await updateEvent(createdEventId, values);
      message.success("Event wurde aktualisiert");
    } else {
      // Neues Event erstellen
      const response = await createEvent(values);
      setCreatedEventId(response.id);
      message.success("Event wurde erstellt");
    }
    setCurrentStep(1);
  };

  const onChange = (value: number) => {
    // Nur erlauben zurück zu gehen, nicht vorwärts
    if (value < currentStep) {
      setCurrentStep(value);
    }
  };

  const handleFinish = () => {
    router.push("/dashboard");
  };

  const formSteps = [
    {
      title: "Einstellungen",
    },
    {
      title: "Gäste",
    },
    {
      title: "Fertig",
    },
  ];

  return (
    <Card style={{ width: 800 }}>
      <Steps
        current={currentStep}
        titlePlacement="vertical"
        items={formSteps}
        onChange={onChange}
        ellipsis
      />
      <div style={{ marginTop: 24 }}>
        {currentStep === 0 && (
          <EventSettings onSubmit={onSubmit} initialData={eventData} />
        )}

        {currentStep === 1 && createdEventId && (
          <div>
            <GuestList
              key={`${createdEventId}-${guests.length}`}
              eventId={createdEventId}
              initialGuests={guests}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: 24,
              }}
            >
              <Button
                type="primary"
                size="large"
                disabled={guests.length < 2}
                onClick={handleFinish}
              >
                Fertigstellen
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
