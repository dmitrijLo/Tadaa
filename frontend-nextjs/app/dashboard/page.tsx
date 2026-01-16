import GuestList from "@/components/guest/GuestList";
import { BACKEND_URL, getAuthHeader, TEST_EVENT_UUID } from "@/utils/api";

export default async function DashboardPage() {
  const response = await fetch(
    `${BACKEND_URL}/events/${TEST_EVENT_UUID}/guests`,
    {
      cache: "no-store",
      headers: getAuthHeader(),
    },
  );

  if (!response.ok) return <div>Fehler beim Laden der Gäste</div>;

  const initialGuests = await response.json();
  return (
    <div className="p-8">
      <GuestList eventId={TEST_EVENT_UUID} initialGuests={initialGuests} />
    </div>
  );
}
