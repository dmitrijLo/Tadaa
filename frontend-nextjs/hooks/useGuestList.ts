import { useGuestStore } from "@/stores/useGuestsStore";
import { useMemo } from "react";
import { useShallow } from "zustand/shallow";

export const useGuestList = () => {
  const { guestsById, guestOrder, primaryLink, secondaryLink } = useGuestStore(
    useShallow(({ guestsById, guestOrder, primaryLink, secondaryLink }) => ({
      guestsById,
      guestOrder,
      primaryLink,
      secondaryLink,
    })),
  );

  const guestList = useMemo(() => {
    const list: (Guest & { isChild: boolean; hasChild: boolean })[] = [];

    for (const id of guestOrder) {
      if (primaryLink[id] || !guestsById[id]) continue;

      const [childId, hasChild] = secondaryLink[id]
        ? [secondaryLink[id], true]
        : ["", false];

      list.push({
        ...guestsById[id],
        isChild: false,
        hasChild: !!(childId && guestsById[childId]),
      });

      const childGuest = hasChild ? guestsById[childId] : undefined;
      if (childGuest) {
        list.push({ ...childGuest, isChild: true, hasChild: false });
      }
    }

    return list;
  }, [guestsById, guestOrder, primaryLink, secondaryLink]);

  return guestList;
};
