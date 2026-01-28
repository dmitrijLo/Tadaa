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
  draggedGuestId: GuestId;
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
  setDraggedGuestId: (guestId: string) => void;
  moveGuest: (
    draggedId: string,
    targetId: string,
    pos: "top" | "middle" | "bottom",
  ) => void;
};

export const useGuestStore = create<GuestState & GuestActions>()(
  immer((set, get) => ({
    excludeCouples: false,
    guestsById: {},
    guestOrder: [],
    secondaryLink: {},
    primaryLink: {},
    draggedGuestId: "",

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

    markInviteStatusAs: (guestId, status) =>
      set((state) => {
        state.guestsById[guestId].inviteStatus = status;
      }),

    setDraggedGuestId: (guestId) =>
      set((state) => {
        state.draggedGuestId = guestId;
      }),

    moveGuest: (draggedId, targetId, pos) =>
      set((state) => {
        if (draggedId === targetId) return;
        const oldParentId = state.primaryLink[draggedId];
        const oldIndex = state.guestOrder.indexOf(draggedId);
        if (oldIndex !== -1) state.guestOrder.splice(oldIndex, 1);

        if (oldParentId) {
          delete state.primaryLink[draggedId];
          if (state.secondaryLink[oldParentId] === draggedId) {
            delete state.secondaryLink[oldParentId];
          }
        }

        if (pos === "middle") {
          if (state.primaryLink[targetId]) {
            state.guestOrder.push(draggedId);
            return;
          }

          const existingChild = state.secondaryLink[targetId];
          if (existingChild) {
            delete state.primaryLink[existingChild];
            state.guestOrder.push(existingChild);
          }
          state.primaryLink[draggedId] = targetId;
          state.secondaryLink[targetId] = draggedId;
        } else {
          let currTargetId = targetId;

          if (state.primaryLink[targetId])
            currTargetId = state.primaryLink[targetId];

          const targetIdx = state.guestOrder.indexOf(currTargetId);
          if (targetIdx === -1) {
            state.guestOrder.push(draggedId);
            return;
          }

          const insertIdx = pos === "top" ? targetIdx : targetIdx + 1;
          state.guestOrder.splice(insertIdx, 0, draggedId);
        }
      }),
  })),
);
