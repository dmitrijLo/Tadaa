import { InviteStatus } from "@/types/enums";

export type InviteStatusInfo = {
  status: InviteStatus;
  name: string;
  color: string;
};

export const inviteStatusesMock: readonly InviteStatusInfo[] = [
  {
    status: InviteStatus.ERROR,
    name: "Fehler",
    color: "red",
  },
  {
    status: InviteStatus.DRAFT,
    name: "Entwurf",
    color: "cyan",
  },
  {
    status: InviteStatus.INVITED,
    name: "Eingeladen",
    color: "geekblue",
  },
  {
    status: InviteStatus.OPENED,
    name: "Geöffnet",
    color: "gold",
  },
  {
    status: InviteStatus.ACCEPTED,
    name: "Angenommen",
    color: "green",
  },
  {
    status: InviteStatus.DENIED,
    name: "Abgelehnt",
    color: "volcano",
  },
] as const;

export const inviteStatusByStatus: Readonly<
  Record<InviteStatus, InviteStatusInfo>
> = inviteStatusesMock.reduce(
  (acc, status) => {
    acc[status.status] = status;
    return acc;
  },
  {} as Record<InviteStatus, InviteStatusInfo>,
);
