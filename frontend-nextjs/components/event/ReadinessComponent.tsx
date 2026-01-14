import { notFound } from "next/navigation";

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

  console.log(users);

  return (
    <>
      <h1>SOO Ready</h1>
    </>
  );
}
