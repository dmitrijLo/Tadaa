"use client";
import {
  DeleteOutlined,
  EditOutlined,
  HolderOutlined,
  LinkOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { Button, message, Popconfirm, Tag } from "antd";
import styles from "./Guest.module.css";
import { useGuestStore } from "@/stores/useGuestsStore";
import { useRef, useState } from "react";
import { useShallow } from "zustand/shallow";
import { InviteStatus } from "@/types/enums";

const STATUS_TAG: Record<string, string> = {
  [InviteStatus.DRAFT]: "cyan",
  [InviteStatus.INVITED]: "geekblue",
  [InviteStatus.OPENED]: "gold",
  [InviteStatus.ACCEPTED]: "green",
  [InviteStatus.DENIED]: "volcano",
};

const getDropPosition = (e: React.DragEvent, element: HTMLElement) => {
  const rect = element.getBoundingClientRect();
  const hoverY = e.clientY - rect.top;
  const height = rect.height;

  if (hoverY < height * 0.25) return "top";
  if (hoverY > height * 0.75) return "bottom";
  return "middle";
};

interface GuestRowCardProps {
  guest: Guest;
  isChild: boolean;
  hasChild: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

export default function GuestRow({
  guest,
  isChild,
  hasChild,
  onEdit,
  onDelete,
}: GuestRowCardProps) {
  const { excludeCouples, draggedGuestId, setDraggedGuestId, handleGuestDrop } =
    useGuestStore(
      useShallow(
        ({
          excludeCouples,
          draggedGuestId,
          setDraggedGuestId,
          handleGuestDrop,
        }) => ({
          excludeCouples,
          draggedGuestId,
          setDraggedGuestId,
          handleGuestDrop,
        }),
      ),
    );
  const [dropPosition, setDropPosition] = useState<
    "top" | "middle" | "bottom" | null
  >(null);
  const rowRef = useRef<HTMLDivElement>(null);

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.effectAllowed = "move";
    setDraggedGuestId(guest.id);
  };

  const handleDragEnd = () => {
    setDraggedGuestId("");
    setDropPosition(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!rowRef.current || draggedGuestId === guest.id) return;
    const position = getDropPosition(e, rowRef.current);
    if (position !== dropPosition) setDropPosition(position);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setDropPosition(null);
    if (!rowRef.current || !draggedGuestId || draggedGuestId === guest.id)
      return;

    const position = getDropPosition(e, rowRef.current);

    if (position === "middle" && guest.inviteStatus !== InviteStatus.DRAFT)
      return;
    handleGuestDrop(guest.eventId, draggedGuestId, guest.id, position);
    setDraggedGuestId("");
  };

  const handleCopyLink = async () => {
    if (!guest?.id) return;
    const url = `${window.location.origin}/guests/${guest.id}`;
    await navigator.clipboard.writeText(url);
    message.success("Einladungs-Link kopiert!");
  };

  let dropClass = "";
  if (dropPosition === "top") dropClass = styles.dropTop;
  if (dropPosition === "middle") dropClass = styles.dropMiddle;
  if (dropPosition === "bottom") dropClass = styles.dropBottom;

  const indentStyle = isChild
    ? {
        marginLeft: "40px",
        width: "calc(100% - 40px)",
        position: "relative" as const,
      }
    : {};

  const showConnector = isChild && draggedGuestId !== guest.id;
  let spacingClass = "";
  if (hasChild) spacingClass = styles.parentOfCouple;
  if (isChild) {
    spacingClass = styles.childOfCouple;
    if (showConnector) spacingClass += ` ${styles.connector}`;
  }
  return (
    <div
      ref={rowRef}
      className={`${styles.card} ${dropClass} ${spacingClass}`}
      style={indentStyle}
      onDragOver={handleDragOver}
      onDragLeave={() => setDropPosition(null)}
      onDrop={handleDrop}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      draggable={excludeCouples && guest.inviteStatus === InviteStatus.DRAFT}
    >
      {isChild && !(draggedGuestId === guest.id) && (
        <div className={styles.connectionBadge}>
          <TeamOutlined />
        </div>
      )}
      <div className={styles.formGrid}>
        {excludeCouples && (
          <div className={`${styles.areaHandle} ${styles.dragHandle}`}>
            <HolderOutlined />
          </div>
        )}
        {/* Name Input -  */}
        <div className={`${styles.areaName} ${styles.inputWrapper}`}>
          <div className={styles.textDispplay}>{guest.name}</div>
        </div>
        {/* Email Input -  */}
        <div className={`${styles.areaEmail} ${styles.inputWrapper}`}>
          <div className={styles.textDispplay}>{guest.email}</div>
        </div>
        {/* Status Badge */}
        <div className={styles.areaStatus}>
          <Tag
            color={STATUS_TAG[guest.inviteStatus || "default"]}
            variant="solid"
          >
            {guest.inviteStatus}
          </Tag>
        </div>

        {/* Actions */}
        <div className={styles.areaActions}>
          <>
            <Button
              type="text"
              icon={<LinkOutlined />}
              onClick={handleCopyLink}
              title="Copy Invitation Link"
            />
            <Button type="text" icon={<EditOutlined />} onClick={onEdit} />
            <Popconfirm
              title="Remove Guest from Event"
              description="Are you sure to remove guest?"
              okText="Yes"
              cancelText="No"
              onConfirm={onDelete}
            >
              <Button danger type="text" icon={<DeleteOutlined />} />
            </Popconfirm>
          </>
        </div>
      </div>
    </div>
  );
}
