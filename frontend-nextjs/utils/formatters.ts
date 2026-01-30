// Formats Date-Objekt or ISO-String to german Date "1. Januar 2026"

export function formatGermanDate(
  date: Date | string | null | undefined,
): string {
  if (!date) return "";

  const dateObj = typeof date === "string" ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) return "";

  return new Intl.DateTimeFormat("de-DE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(dateObj);
}

// Formats Date-Objekt or ISO-String to german Date and Time "1. Januar 2026, 00:00 Uhr"

export function formatGermanDateTime(
  date: Date | string | null | undefined,
): string {
  if (!date) return "";

  const dateObj = typeof date === "string" ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) return "";

  const datePart = new Intl.DateTimeFormat("de-DE", {
    timeZone: "Europe/Berlin",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(dateObj);

  const timePart = new Intl.DateTimeFormat("de-DE", {
    timeZone: "Europe/Berlin",
    hour: "numeric",
    minute: "2-digit",
  }).format(dateObj);

  return `${datePart}, ${timePart} Uhr`;
}
