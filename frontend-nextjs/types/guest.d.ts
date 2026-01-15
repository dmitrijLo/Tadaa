interface Event {
  id: string;
  hostId: string;
  name: string;
  description: string;
  budget: number;
  currency: string;
  status: EventStatus;
  eventMode: EventMode;
  drawRule: DrawRule;
  eventDate: Date | null;
  invitationDate: Date | null;
  draftDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

interface Assignment {
  id: string;
  eventId: string;
  giverGuestId: string;
  receiverGuestId: string;
  createdAt: Date;
}

export interface Guest {
  id: string;
  eventId: string;
  name: string;
  email: string;
  noteForGiver: string | null;
  declineMessage: string | null;
  inviteToken: string;
  inviteStatus: InviteStatus;
  receivedAt: Date | null;
  openedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  event: Event;
  givenAssignments?: Assignment[];
  receivedAssignments?: Assignment[];
}

export type CreateGuestDto = Pick<Guest, ["name", "email"]>;

export type UpdateGuestDto = Partial<Guest>;

interface InterestOption {
  id: string;
  name: string;
  usageCount: number;
}
