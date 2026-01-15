import ReadinessComponent from "@/components/event/ReadinessComponent";

export default async function EventPage({
  params,
}: {
  params: { eventid: string };
}) {
  const { eventid } = await params;

  return (
    <div>
      <h1>Event</h1>
      <p>Hier entsteht bald Großes.</p>

      <ReadinessComponent eventid={eventid} />
    </div>
  );
}
