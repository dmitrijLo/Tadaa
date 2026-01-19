import RevealPartner from "@/components/guest/RevealPartner";
import { Event, Guest } from "@/types/guest";
import { notFound } from "next/navigation";

// Mock-Daten für verschiedene Gäste
const mockData = {
  event: {
    name: "Büro-Weihnachtsfeier 2025",
    budget: 20,
    currency: "€",
    eventDate: "24.12.2025", // Als String für einfachere Anzeige
  },
  receiver: {
    name: "Max Mustermann",
    noteForGiver: "Ich sammle Brettspiele und trinke gerne guten Tee.",
    interests: {
      likes: ["Brettspiele", "Tee", "Science-Fiction"],
      dislikes: ["Süßigkeiten", "Alkohol"],
    },
  },
};

export default async function ResultPage({
  params,
}: {
  params: Promise<{ eventId: string; guestId: string }>;
}) {
  const { guestId } = await params;

  // Hier später: const data = await fetchFromYourApi(guestId);
  const data = mockData;

  if (!data) return notFound();

  return (
    <main className="min-h-screen bg-[#f0f2f5] flex items-center justify-center p-4">
      <RevealPartner data={data} />
    </main>
  );
}
