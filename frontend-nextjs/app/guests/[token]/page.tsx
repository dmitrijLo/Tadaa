import { notFound } from "next/navigation";

const fetchGuest = async (token: string): Promise<Guest | undefined> => {
  try {
    // Use API_URL for server-side requests (Docker internal)
    const apiUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;
    const response = await fetch(`${apiUrl}/guests/${token}`);
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
  const token = (await params).token;
  if (!token) {
    notFound();
  }

  const guest = await fetchGuest(token);

  if (!guest) {
    notFound();
  }

  console.log(guest);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Welcome, {guest.name}!
        </h1>
        <p className="text-lg text-gray-700">Event: {guest.event.name}</p>
        <div className="mt-6 text-sm text-gray-600">
          <p>Status: {guest.inviteStatus}</p>
          <p>Email: {guest.email}</p>
        </div>
      </div>
    </div>
  );
}
