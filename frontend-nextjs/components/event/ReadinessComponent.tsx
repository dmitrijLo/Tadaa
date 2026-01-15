import { notFound } from "next/navigation";
import GuestListing from "./readiness/GuestlistComponent";
import { Guest } from "@/types/guest";

const fetchEventUsers = async (eventid: string) => {
  try {
    const response = await fetch(
      `${process.env.API_URL}/events/${eventid}/readiness`,
    );

    if (!response.ok) return undefined;

    const users: Guest[] = await response.json();
    return users;
  } catch (error) {
    console.error(error);
  }
};

export default async function ReadinessComponent({
  eventid,
}: {
  eventid: string;
}) {
  const users = await fetchEventUsers(eventid);
  if (!users) notFound();

  return (
    <>
      <h1>SOO Ready</h1>
      <GuestListing guests={users} />
    </>
  );
}
