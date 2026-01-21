import RevealPartner from "@/components/guest/RevealPartner";
import { BACKEND_URL } from "@/utils/api";
import { notFound } from "next/navigation";

const getGuest = async (guestId: string): Promise<Guest> => {
  try {
    const response = await fetch(`${BACKEND_URL}/guests/${guestId}/assignment`);
    if (!response.ok) return notFound();

    const data = await response.json();

    return data;
  } catch {
    throw new Error("Could not fetch Guest");
  }
};

export default async function ResultPage({
  params,
}: {
  params: Promise<{ guestId: string }>;
}) {
  const { guestId } = await params;

  const guest = await getGuest(guestId);

  return (
    <main className="min-h-screen bg-[#f0f2f5] flex items-center justify-center p-4">
      <RevealPartner guest={guest} />
    </main>
  );
}
