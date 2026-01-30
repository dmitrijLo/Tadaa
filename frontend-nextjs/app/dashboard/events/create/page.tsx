import { EventForm } from "@/components";
import { api } from "@/utils/api";

export default function NewEventPage() {
  async function createEvent(
    formData: CreateEventDto,
  ): Promise<{ id: string }> {
    "use server";

    try {
      const payload: Record<string, string | number> = {
        name: formData.name,
        description: formData.description || "",
        budget: formData.budget,
        currency: "EUR",
        eventMode: formData.eventMode,
        drawRule: formData.drawRule,
        eventDate: new Date(formData.eventDate).toISOString(),
      };

      if (formData.invitationDate) {
        payload.invitationDate = new Date(
          formData.invitationDate,
        ).toISOString();
      }

      if (formData.draftDate) {
        payload.draftDate = new Date(formData.draftDate).toISOString();
      }

      console.log(
        "Sending payload to backend:",
        JSON.stringify(payload, null, 2),
      );
      const response = await api.post("/events", payload);
      return { id: response.data.id };
    } catch (error) {
      console.error("Fehler beim Erstellen des Events:", error);
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response: { data: unknown; status: number };
        };
        console.error("Response data:", axiosError.response.data);
        console.error("Response status:", axiosError.response.status);
      }
      throw error;
    }
  }

  async function updateEvent(
    eventId: string,
    formData: CreateEventDto,
  ): Promise<void> {
    "use server";

    try {
      const payload: Record<string, string | number> = {
        name: formData.name,
        description: formData.description || "",
        budget: formData.budget,
        currency: "EUR",
        eventMode: formData.eventMode,
        drawRule: formData.drawRule,
        eventDate: new Date(formData.eventDate).toISOString(),
      };

      if (formData.invitationDate) {
        payload.invitationDate = new Date(
          formData.invitationDate,
        ).toISOString();
      }

      if (formData.draftDate) {
        payload.draftDate = new Date(formData.draftDate).toISOString();
      }

      await api.patch(`/events/${eventId}`, payload);
    } catch (error) {
      console.error("Fehler beim Aktualisieren des Events:", error);
      throw error;
    }
  }

  return <EventForm createEvent={createEvent} updateEvent={updateEvent} />;
}
