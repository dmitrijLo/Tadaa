import { EventMode } from "@/types/enums";
import {
  BugOutlined,
  CalendarOutlined,
  ExperimentOutlined,
  StarOutlined,
} from "@ant-design/icons";

export type EventModeInfo = {
  mode: EventMode;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
};

export const eventModesMock: readonly EventModeInfo[] = [
  {
    mode: EventMode.CLASSIC,
    name: "Klassisch",
    description:
      "Jede Person zieht im Voraus einen <strong>festen Wichtelpartner</strong> und beschenkt ausschließlich diese Person. Im Gegensatz zum Schrottwichteln stehen hier <strong>sinnvolle, nützliche</strong> oder <strong>persönlich</strong> ausgewählte Geschenke im Mittelpunkt. Ziel ist eine wertschätzende und faire Geschenkverteilung.",
    icon: <StarOutlined />,
    color: "blue",
  },
  {
    mode: EventMode.SCRAP,
    name: "Schrottwichteln",
    description:
      "Jeder bringt einen <strong>nutzlosen, kaputten oder lustigen</strong> Gegenstand mit, den er selbst nicht mehr will. Es geht nicht um Wert oder Nettigkeit, sondern um Humor. Je schlimmer das Geschenk, desto besser. Lachen garantiert, Dankbarkeit optional.",
    icon: <BugOutlined />,
    color: "orange",
  },
  {
    mode: EventMode.CUSTOM,
    name: "Benutzerdefiniert",
    description:
      "Lege ein eigenes Thema fest und wähle aus verschiedenen Regeln.",
    icon: <ExperimentOutlined />,
    color: "purple",
  },
] as const;

export const eventModeByModusMock: Readonly<Record<EventMode, EventModeInfo>> =
  eventModesMock.reduce(
    (acc, mode) => {
      acc[mode.mode] = mode;
      return acc;
    },
    {} as Record<EventMode, EventModeInfo>,
  );
