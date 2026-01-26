import { create } from "zustand";
import { api } from "utils/api";
import { InviteStatus } from "@/types/enums";

interface GuestStore {
  guests: Guest[];
  setGuests: (guests: Guest[]) => void;
  addGuest: (eventId: string, guest: CreateGuestDto) => Promise<void>;
  updateGuest: (
    eventId: string,
    guestId: string,
    updateData: UpdateGuestDto,
  ) => Promise<Guest>;
  removeGuest: (
    eventId: string,
    guestId: string,
  ) => Promise<unknown | undefined>;
  markInviteStatusAs: (guestId: string, status: InviteStatus) => void;
}

export const useGuestStore = create<GuestStore>((set, get) => ({
  guests: [],
  setGuests: (guests) => set({ guests }),
  addGuest: async (eventId, guest) => {
    const response = await api.post(`/events/${eventId}/guests`, guest);
    const newGuest = response.data;
    set((state) => ({
      guests: [...state.guests, newGuest],
    }));
  },
  updateGuest: async (eventId, guestId, updateData) => {
    const { name, email } = updateData;
    const response = await api.patch(`/events/${eventId}/guests/${guestId}`, {
      name,
      email,
    });
    const updatedGuest = response.data;
    set((state) => ({
      guests: state.guests.map((guest) =>
        guest.id !== guestId ? guest : updatedGuest,
      ),
    }));
    return updatedGuest;
  },
  removeGuest: async (eventId, guestId) => {
    const guestsSnapshot = get().guests;
    set({ guests: guestsSnapshot.filter(({ id }) => guestId !== id) });

    try {
      await api.delete(`/events/${eventId}/guests/${guestId}`);
    } catch (err: unknown) {
      set({ guests: guestsSnapshot });
      return err;
    }
  },

  markInviteStatusAs: (guestId: string, status: InviteStatus) => {
    set((state) => ({
      guests: state.guests.map((guest) =>
        guest.id === guestId ? { ...guest, inviteStatus: status } : guest,
      ),
    }));
  },
}));
