import RevealPartner from "@/components/guest/RevealPartner";
import { notFound } from "next/navigation";

const mockData = {
  event: {
    name: "Büro-Weihnachtsfeier 2025",
    budget: 20,
    currency: "€",
    eventDate: "2025-12-24T18:00:00.000Z",
  },
  receiver: {
    name: "Max Mustermann",
    noteForGiver: "Ich sammle Brettspiele und trinke gerne guten Tee.",

    interests: ["Brettspiele", "Tee", "Science-Fiction"],
    noInterests: ["Süßigkeiten", "Alkohol"],
  },
};

export default async function ResultPage({
  params,
}: {
  params: Promise<{ eventId: string; guestId: string }>;
}) {
  const { guestId } = await params;

  // const response = await fetch(
  //   `${process.env.BACKEND_URL}/guests/${guestId}/assignment`,
  //   { cache: "no-store" },
  // );
  // if (!response.ok) {
  //   return notFound();
  // }

  // const data = await response.json();

  const data = mockData;

  return (
    <main className="min-h-screen bg-[#f0f2f5] flex items-center justify-center p-4">
      <RevealPartner data={data} />
    </main>
  );
}
