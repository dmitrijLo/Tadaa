import { EventStatus } from "@/types/enums";

export type EventStatusInfo = {
  status: EventStatus;
  name: string;
  label: string;
  color: string;
};

export const eventModes: readonly EventStatusInfo[] = [
  {
    status: EventStatus.DRAFT,
    name: "draft",
    label: "Entwurf",
    color: "default",
  },
  {
    status: EventStatus.CREATED,
    name: "created",
    label: "Erstellt",
    color: "blue",
  },
  {
    status: EventStatus.INVITED,
    name: "invited",
    label: "Eingeladen",
    color: "gold",
  },
  {
    status: EventStatus.ASSIGNED,
    name: "assigned",
    label: "Ausgelost",
    color: "green",
  },
  {
    status: EventStatus.DONE,
    name: "done",
    label: "Abgeschlossen",
    color: "orange",
  },
] as const;

export const eventModeByModus: Readonly<Record<EventStatus, EventStatusInfo>> =
  eventModes.reduce(
    (acc, status) => {
      acc[status.status] = status;
      return acc;
    },
    {} as Record<EventStatus, EventStatusInfo>,
  );
