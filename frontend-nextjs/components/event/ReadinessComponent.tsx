import { notFound } from "next/navigation";
import GuestListing from "./readiness/GuestlistComponent";
import { makeApiRequest, BACKEND_URL } from "@/utils/api";

export default async function ReadinessComponent({
  eventid,
}: {
  eventid: string;
}) {
  const { data: users, error } = await makeApiRequest<Guest[]>(
    `${BACKEND_URL}/events/${eventid}/readiness`,
  );
  if (!users) notFound();

  return (
    <>
      <h1>SOO Ready</h1>
      <GuestListing guests={users} />
    </>
  );
}
