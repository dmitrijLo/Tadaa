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
  interests: InterestOption[];
  noInterest: InterestOption[];
  assignedRecipient?: Guest;
}

interface GuestStatsResponse {
  totalGuests: number;
  accepted: number;
  denied: number;
  open: number;
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

interface EventResponse {
  id: string;
  name: string;
  description: string;
  budget: number;
  currency: string;
  eventMode: EventMode;
  drawRule: DrawRule;
  eventDate: Date;
  invitationDate: Date;
  draftDate: Date;
  status: EventStatus;
}

type CreateGuestDto = Pick<Guest, "name" | "email">;

type UpdateGuestDto = Partial<Guest>;

type CreateEventDto = Pick<
  Event,
  | "name"
  | "description"
  | "budget"
  | "eventMode"
  | "drawRule"
  | "eventDate"
  | "invitationDate"
  | "draftDate"
>;

type UpdateEventDto = Partial<CreateEventDto>;

interface GiftSuggestion {
  name: string;
  description: string;
  estimatedPrice: string;
  category: string;
}
