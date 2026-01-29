import { notFound } from "next/navigation";
import GuestListing from "./readiness/GuestlistComponent";
import { makeApiRequest, BACKEND_URL } from "@/utils/api";

const fetchEventUsers = async (eventid: string) => {
  const { data, error } = await makeApiRequest<Guest[]>(
    `${BACKEND_URL}/events/${eventid}/readiness`,
  );

  if (error) {
    console.error(error);
    return undefined;
  }

  return data;
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
