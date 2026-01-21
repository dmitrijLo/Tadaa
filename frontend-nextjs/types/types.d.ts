enum EventStatus {
  CREATED = "created",
  INVITED = "invited",
  ASSIGNED = "assigned",
  DONE = "done",
}

enum EventMode {
  CLASSIC = "classic",
  SCRAP = "scrap",
  CUSTOM = "custom",
}

enum DrawRule {
  CHAIN = "chain",
  EXCHANGE = "exchange",
  PICK_ORDER = "pick-order",
}

enum InviteStatus {
  INVITED = "invited",
  OPENED = "opened",
  ACCEPTED = "accepted",
  DENIED = "denied",
}

interface InterestOption {
  id: string;
  name: string;
  usageCount: number;
  createdAt: Date;
  updatedAt: Date;
}

interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  hostedEvents: Event[];
}

interface Guest {
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
  interests: string[];
  noInterest: string[];
  assignedRecipient?: Guest;
}

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
  eventDate: Date;
  invitationDate: Date;
  draftDate: Date;
  createdAt: Date;
  updatedAt: Date;
  host: User;
  guests: Guest[];
}

type CreateGuestDto = Pick<Guest, "name" | "email">;

type UpdateGuestDto = Partial<Guest>;
