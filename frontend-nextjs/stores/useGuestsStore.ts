import { create } from "zustand";
import { api } from "utils/api";
import { InviteStatus } from "@/types/enums";
import { immer } from "zustand/middleware/immer";

type GuestId = string;
type ParentId = string;

type GuestState = {
  excludeCouples: boolean;
  guestsById: Record<GuestId, Guest>;
  guestOrder: GuestId[];
  // Wer ist mein Parent? primaryLink[guesId] -> parentId
  primaryLink: Record<GuestId, ParentId | null>;
  // Wen habe ich als Child? secondaryLink[guestId] -> childId
  secondaryLink: Record<ParentId, GuestId | null>;
};

type GuestActions = {
  init: (guests: Guest[]) => void;
  addGuest: (eventId: string, guest: CreateGuestDto) => Promise<void>;
  updateGuest: (
    eventId: string,
    guestId: string,
    updateData: UpdateGuestDto,
  ) => Promise<CreateGuestDto>;
  removeGuest: (eventId: string, guestId: string) => Promise<unknown>;
  markInviteStatusAs: (guestId: string, status: InviteStatus) => void;
};

export const useGuestStore = create<GuestState & GuestActions>()(
  immer((set, get) => ({
    excludeCouples: false,
    guestsById: {},
    guestOrder: [],
    secondaryLink: {},
    primaryLink: {},

    init: (guests) =>
      set((state) => {
        for (const guest of guests) {
          state.guestsById[guest.id] = guest;
        }
        state.guestOrder = guests.map(({ id }) => id);
      }),

    addGuest: async (eventId, guest) => {
      const response = await api.post(`/events/${eventId}/guests`, guest);
      const newGuest = response.data;
      set((state) => {
        state.guestsById[newGuest.id] = newGuest;
        state.guestOrder.push(newGuest.id);
      });
    },

    updateGuest: async (eventId, guestId, updateData) => {
      const { name, email } = updateData;
      const response = await api.patch(`/events/${eventId}/guests/${guestId}`, {
        name,
        email,
      });
      const updatedGuest = response.data;
      set((state) => {
        state.guestsById[updatedGuest.id] = updatedGuest;
      });
      return updatedGuest;
    },

    removeGuest: async (eventId, guestId) => {
      const guestSnap = get().guestsById[guestId];
      const orderSnap = get().guestOrder;
      const parentId = get().primaryLink[guestId];
      const childId = get().secondaryLink[guestId];

      set((state) => {
        delete state.guestsById[guestId];
        state.guestOrder = state.guestOrder.filter((id) => guestId !== id);
        if (parentId) {
          delete state.primaryLink[guestId];
          delete state.secondaryLink[parentId];
        }
        if (childId) {
          delete state.secondaryLink[guestId];
          delete state.primaryLink[childId];
        }
      });

      try {
        await api.delete(`/events/${eventId}/guests/${guestId}`);
      } catch (err: unknown) {
        set((state) => {
          state.guestsById[guestId] = guestSnap;
          state.guestOrder = orderSnap;
          if (parentId) {
            state.primaryLink[guestId] = parentId;
            state.secondaryLink[parentId] = guestId;
          }
          if (childId) {
            state.secondaryLink[guestId] = childId;
            state.primaryLink[childId] = guestId;
          }
        });
        return err;
      }
    },

    markInviteStatusAs: (guestId: string, status: InviteStatus) =>
      set((state) => (state.guestsById[guestId].inviteStatus = status)),
  })),
);
