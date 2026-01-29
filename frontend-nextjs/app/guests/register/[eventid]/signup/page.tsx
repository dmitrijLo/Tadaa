import RegisterForEventComponent from "@/components/guests/register/RegisterForEventComponent";
import { notFound } from "next/navigation";

export default async function SignUpForEventPage({
  params,
}: {
  params: Promise<{ eventid: string }>;
}) {
  const { eventid } = await params;

  if (!eventid) notFound();
  return <RegisterForEventComponent eventId={eventid} />;
}
