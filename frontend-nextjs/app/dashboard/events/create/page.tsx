import { EventForm } from "@/components";
import {
  serverApiPost,
  serverApiPatch,
  SERVER_BACKEND_URL,
} from "@/utils/server-api";

function eventPayload(
  formData: CreateEventDto,
): Record<string, string | number | null> {
  return {
    name: formData.name,
    description: formData.description || "",
    budget: formData.budget,
    currency: "EUR",
    eventMode: formData.eventMode,
    drawRule: formData.drawRule,
    eventDate: new Date(formData.eventDate).toISOString(),
    invitationDate: formData.invitationDate
      ? new Date(formData.invitationDate).toISOString()
      : null,
    draftDate: formData.draftDate
      ? new Date(formData.draftDate).toISOString()
      : null,
  };
}

export default function NewEventPage() {
  async function createEvent(
    formData: CreateEventDto,
  ): Promise<{ id: string }> {
    "use server";

    const payload = eventPayload(formData);

    console.log(
      "Sending payload to backend:",
      JSON.stringify(payload, null, 2),
    );

    const { data, error } = await serverApiPost<{ id: string }>(
      `${SERVER_BACKEND_URL}/events`,
      payload,
    );

    if (error || !data) {
      console.error("Fehler beim Erstellen des Events:", error);
      throw new Error(error || "Event creation failed");
    }

    return { id: data.id };
  }

  async function updateEvent(
    eventId: string,
    formData: CreateEventDto,
  ): Promise<void> {
    "use server";

    const payload = eventPayload(formData);

    const { error } = await serverApiPatch(
      `${SERVER_BACKEND_URL}/events/${eventId}`,
      payload,
    );

    if (error) {
      console.error("Fehler beim Aktualisieren des Events:", error);
      throw new Error(error);
    }
  }

  return <EventForm createEvent={createEvent} updateEvent={updateEvent} />;
}
