import { notFound } from "next/navigation";
import GuestCard from "./GuestCard";
import { BACKEND_URL, makeApiRequest } from "@/utils/api";

export default async function Guestpage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token: guestId } = await params;
  if (!guestId) {
    notFound();
  }

  const { data: guestData, error: guestErr } = await makeApiRequest<Guest>(
    `${BACKEND_URL}/guests/${guestId}`,
  );

  if (!guestData) {
    notFound();
  }

  return <GuestCard guest={guestData} />;
}
