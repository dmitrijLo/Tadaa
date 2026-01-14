import GuestList from "@/components/guest/GuestList";
import { TEST_EVENT_UUID, TEST_ROUTE } from "@/utils/api";

export default async function DashboardPage() {
  const response = await fetch(TEST_ROUTE, {
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      "x-dev-user-id": "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
    },
  });

  if (!response.ok) return <div>Fehler beim Laden der Gäste</div>;

  const initialGuests = await response.json();
  return (
    <div className="p-8">
      <GuestList eventId={TEST_EVENT_UUID} initialGuests={initialGuests} />
    </div>
  );
}
