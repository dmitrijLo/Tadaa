import { BACKEND_URL, getAuthHeader } from "@/utils/api";
import DashboardEvents, {
  EventSummary,
} from "@/components/dashboard/DashboardEvents";
import LogoutButton from "@/components/auth/LogoutButton";

export default async function DashboardPage() {
  let events: EventSummary[] = [];

  try {
    const res = await fetch(`${BACKEND_URL}/events`, {
      cache: "no-store",
      headers: getAuthHeader(),
    });
    if (res.ok) events = await res.json();
  } catch (e) {
    console.error("Fetch Error", e);
  }

  console.log(events);
  // // MOCK DATA
  // if (events.length === 0) {
  //   events = [
  //     { id: "e77b9a3f-911d-41d4-807b-8f4e315c6f31", title: "Test Geburtstag" },
  //     { id: "demo-id-2", title: "Weihnachtsfeier 2024" },
  //   ];
  // }

  return (
    <>
      <LogoutButton />
      <DashboardEvents events={events} />;
    </>
  );
}
