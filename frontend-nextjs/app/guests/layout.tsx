export default function GuestsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="flex items-start justify-center">{children}</div>;
}
