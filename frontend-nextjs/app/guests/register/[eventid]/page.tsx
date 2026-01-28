import QRComponent from "@/components/guests/register/QRComponent";
import { notFound } from "next/navigation";

export default async function RegisterForEventPage({
  params,
}: {
  params: Promise<{ eventid: string }>;
}) {
  const { eventid } = await params;

  if (!eventid) notFound();

  return <QRComponent eventId={eventid} />;
}
