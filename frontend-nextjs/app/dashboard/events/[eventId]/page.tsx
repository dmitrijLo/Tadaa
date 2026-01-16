import GuestList from "@/components/guest/GuestList";
import { BACKEND_URL, getAuthHeader } from "@/utils/api";

interface PageProps {
  params: { eventId: string };
}

export default async function EventDetailPage({ params }: PageProps) {
  const { eventId } = params;
  const response = await fetch(`${BACKEND_URL}/events/${eventId}/guests`, {
    cache: "no-store",
    headers: getAuthHeader(),
  });

  if (!response.ok) return <div>Fehler beim Laden der Gäste</div>;

  const initialGuests = await response.json();
  return (
    <div className="p-8">
      <GuestList eventId={eventId} initialGuests={initialGuests} />
    </div>
  );
}
