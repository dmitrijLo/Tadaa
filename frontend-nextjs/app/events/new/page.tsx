import EventForm from "./EventForm";
import { redirect } from "next/navigation";
import { api } from "@/utils/api";
import { CreateEventDto } from "@/types/guest";

export default function NewEventPage() {
  async function createEvent(formData: CreateEventDto) {
    "use server";

    try {
      const payload = {
        name: formData.name,
        description: formData.description || "",
        budget: formData.budget,
        currency: "EUR",
        eventMode: formData.eventMode,
        drawRule: formData.drawRule,
        eventDate: formData.eventDate,
        invitationDate: formData.invitationDate,
        draftDate: formData.draftDate,
      };

      const response = await api.post("/events", payload);
      redirect(`/events/${response.data.id}`);
    } catch (error) {
      console.error("Fehler beim Erstellen des Events:", error);
      throw error;
    }
  }

  return <EventForm createEvent={createEvent} />;
}
