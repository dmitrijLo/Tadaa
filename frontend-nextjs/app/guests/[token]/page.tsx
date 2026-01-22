import { notFound } from "next/navigation";
import GuestCard from "./GuestCard";

const fetchGuest = async (token: string): Promise<Guest | undefined> => {
  try {
    const response = await fetch(`${process.env.API_URL}/guests/${token}`);
    if (!response.ok) return undefined;
    const guest: Guest = await response.json();
    return guest;
  } catch (error) {
    console.error(error);
    return undefined;
  }
};

export default async function Guestpage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const guestId = (await params).token;
  if (!guestId) {
    notFound();
  }

  const guest = await fetchGuest(guestId);

  if (!guest) {
    notFound();
  }

  return <GuestCard guest={guest} />;
}
