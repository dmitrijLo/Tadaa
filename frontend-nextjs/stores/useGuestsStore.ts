import { create } from "zustand";
import { api } from "utils/api";
import { InviteStatus } from "@/types/enums";
import { immer } from "zustand/middleware/immer";

type GuestId = string;
type ParentId = string;
type GuestPosition = "top" | "middle" | "bottom";

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
    optimistic: boolean,
  ) => Promise<CreateGuestDto>;
  removeGuest: (eventId: string, guestId: string) => Promise<unknown>;
  markInviteStatusAs: (guestId: string, status: InviteStatus) => void;
  setDraggedGuestId: (guestId: string) => void;
  moveGuest: (draggedId: string, targetId: string, pos: GuestPosition) => void;
  handleGuestDrop: (
    eventId: string,
    draggedId: string,
    targetId: string,
    pos: GuestPosition,
  ) => Promise<void>;
};

export const useGuestStore = create<GuestState & GuestActions>()(
  immer((set, get) => ({
    excludeCouples: false,
    guestsById: {},
    guestOrder: [],
    secondaryLink: {},
    primaryLink: {},
    draggedGuestId: "",

    init: (guests) => {
      const guestsById: Record<string, Guest> = {};
      const primaryLink: Record<string, string> = {};
      const secondaryLink: Record<string, string> = {};
      const rootGuests: Guest[] = [];

      for (const guest of guests) {
        guestsById[guest.id] = guest;
        if (guest.parentId) {
          primaryLink[guest.id] = guest.parentId;
          secondaryLink[guest.parentId] = guest.id;
        } else {
          rootGuests.push(guest);
        }
      }

      rootGuests.sort((a, b) => {
        const indexA = a.orderIndex ?? Number.MAX_SAFE_INTEGER;
        const indexB = b.orderIndex ?? Number.MAX_SAFE_INTEGER;
        return indexA - indexB;
      });

      set({
        guestsById,
        primaryLink,
        secondaryLink,
        guestOrder: rootGuests.map((g) => g.id),
      });
    },

    addGuest: async (eventId, guest) => {
      const response = await api.post(`/events/${eventId}/guests`, guest);
      const newGuest = response.data;
      set((state) => {
        state.guestsById[newGuest.id] = newGuest;
        state.guestOrder.push(newGuest.id);
      });
    },

    updateGuest: async (eventId, guestId, updateData, optimistic = true) => {
      const guestSnapshot = { ...get().guestsById[guestId] };
      if (optimistic) {
        set((state) => {
          if (state.guestsById[guestId])
            Object.assign(state.guestsById[guestId], updateData);
        });
      }

      try {
        const response = await api.patch(
          `/events/${eventId}/guests/${guestId}`,
          updateData,
        );

        const updatedGuest = response.data;
        set((state) => {
          const currentGuest = state.guestsById[updatedGuest.id];
          state.guestsById[updatedGuest.id] = {
            ...currentGuest,
            ...updatedGuest,
          };
        });
        return updatedGuest;
      } catch (error) {
        console.error("Update failed", error);
        if (optimistic) {
          set((state) => {
            if (guestSnapshot) state.guestsById[guestId] = guestSnapshot;
          });
        }
        throw error;
      }
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

    handleGuestDrop: async (eventId, draggedId, targetId, pos) => {
      const state = get();
      const guestOrderSnap = [...state.guestOrder];
      const primaryLinkSnap = { ...state.primaryLink };
      const secondaryLinkSnap = { ...state.secondaryLink };

      const { moveGuest, updateGuest } = get();
      moveGuest(draggedId, targetId, pos);
      const newState = get();
      const newParentId = newState.primaryLink[draggedId] || null;
      const newOrderIndex = newState.guestOrder.indexOf(draggedId) || null;

      try {
        await updateGuest(
          eventId,
          draggedId,
          {
            parentId: newParentId,
            orderIndex: newOrderIndex,
          },
          false,
        );
      } catch (error) {
        console.error("Move failed on server, rolling back UI...", error);
        set((state) => {
          state.guestOrder = guestOrderSnap;
          state.primaryLink = primaryLinkSnap;
          state.secondaryLink = secondaryLinkSnap;
        });
      }
    },
  })),
);
