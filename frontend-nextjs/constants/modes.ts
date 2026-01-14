import { EventMode } from "@/enums/enums";

export type EventModeInfo = {
  modus: EventMode;
  name: string;
  description: string;
};

export const eventModesMock: readonly EventModeInfo[] = [
  {
    modus: EventMode.CLASSIC,
    name: "Klassisch",
    description:
      "Jede Person zieht im Voraus einen <strong>festen Wichtelpartner</strong> und beschenkt ausschließlich diese Person. Im Gegensatz zum Schrottwichteln stehen hier <strong>sinnvolle, nützliche</strong> oder <strong>persönlich</strong> ausgewählte Geschenke im Mittelpunkt. Ziel ist eine wertschätzende und faire Geschenkverteilung.",
  },
  {
    modus: EventMode.SCRAP,
    name: "Schrottwichteln",
    description:
      "Jeder bringt einen <strong>nutzlosen, kaputten oder lustigen</strong> Gegenstand mit, den er selbst nicht mehr will. Es geht nicht um Wert oder Nettigkeit, sondern um Humor. Je schlimmer das Geschenk, desto besser. Lachen garantiert, Dankbarkeit optional.",
  },
  {
    modus: EventMode.CUSTOM,
    name: "Benutzerdefiniert",
    description:
      "Lege ein eigenes Thema fest und wähle aus verschiedenen Regeln.",
  },
] as const;

export const eventModeByModusMock: Readonly<Record<EventMode, EventModeInfo>> =
  eventModesMock.reduce(
    (acc, mode) => {
      acc[mode.modus] = mode;
      return acc;
    },
    {} as Record<EventMode, EventModeInfo>
  );
