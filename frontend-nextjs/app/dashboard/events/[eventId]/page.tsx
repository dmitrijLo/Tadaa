import { EventDetailTabs } from "@/components";
import { BACKEND_URL, makeApiRequest } from "@/utils/api";

interface PageProps {
  params: Promise<{ eventId: string }>;
}

export default async function EventDetailPage({ params }: PageProps) {
  const { eventId } = await params;

  let initialEvent, initialGuests;

  try {
    [initialEvent, initialGuests] = await Promise.all([
      makeApiRequest(`${BACKEND_URL}/events/${eventId}`),
      makeApiRequest(`${BACKEND_URL}/events/${eventId}/guests`),
    ]);
  } catch {
    return <div>Fehler beim Laden der Daten</div>;
  }

  return (
    <>
      <EventDetailTabs
        eventId={eventId}
        initialEvent={initialEvent}
        initialGuests={initialGuests}
      />
    </>
  );
}
