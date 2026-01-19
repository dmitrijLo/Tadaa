import {
  CheckOutlined,
  CloseOutlined,
  EditOutlined,
  HolderOutlined,
  LinkOutlined,
  MailOutlined,
  PlusOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { api } from "@/utils/api";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import styles from "./Guest.module.css";
import { Tag, Button, Input, message } from "antd";
import { AxiosError } from "axios";

const STATUS_TAG: Record<string, string> = {
  default: "cyan",
  invited: "geekblue",
  opened: "gold",
  accepted: "green",
  denied: "volcano",
};

interface GuestRowProps {
  eventId: string;
  guest?: Guest; // EditMode wenn vorhanden, ansonsten CreateMode
  onGuestAdded?: (guest: Guest) => void;
}

export default function GuestRow({
  eventId,
  guest,
  onGuestAdded,
}: GuestRowProps) {
  const isExistent = !!guest;
  const [inEditMode, setInEditMode] = useState(!guest);
  const [isSaving, setIsSaving] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { isValid },
  } = useForm<CreateGuestDto>({
    mode: "onChange",
    defaultValues: { name: guest?.name || "", email: guest?.email || "" },
  });

  const handleOnEditClick = () => {
    setInEditMode(true);
  };

  const handleOnCancelClick = () => {
    setInEditMode(false);
    reset();
  };

  const handleCopyLink = async () => {
    if (!guest?.inviteToken) return;
    const url = `${window.location.origin}/invitation/${guest.inviteToken}`;
    await navigator.clipboard.writeText(url);
    message.success("Einladungs-Link kopiert!");
  };

  const onPatch = async (data: UpdateGuestDto) => {};

  const onSubmit = async (data: CreateGuestDto) => {
    if (isExistent) {
      // TODO: Logik fürs editieren
      // setErrorMsg(null);
      console.log("Edit Mode not implemented yet");
      return;
    }
    setIsSaving(true);

    try {
      const response = await api.post(`/events/${eventId}/guests`, data);
      message.success("Guest added!");

      if (onGuestAdded) {
        onGuestAdded(response.data);
      }

      reset();
    } catch (err: unknown) {
      console.error(err);
      if (err instanceof AxiosError) {
        message.error(err.response?.data?.message || "Fehler beim Speichern");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const containerClass = `${styles.card} ${!isExistent ? styles.addCard : ""}`;

  return (
    <div className={containerClass}>
      <form className={styles.formGrid} onSubmit={handleSubmit(onSubmit)}>
        {/* Drag Handle */}
        {isExistent && (
          <div className={`${styles.areaHandle} ${styles.dragHandle}`}>
            <HolderOutlined />
          </div>
        )}
        {/* Name Input -  */}
        <div className={`${styles.areaName} ${styles.inputWrapper}`}>
          <Controller
            name="name"
            control={control}
            rules={{
              required: "Name ist Pflicht",
              minLength: { value: 2, message: "Min. 2 Zeichen" },
            }}
            render={({ field, fieldState: { error } }) => (
              <>
                <Input
                  {...field}
                  placeholder="Name des Gastes"
                  prefix={<UserOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
                  status={error ? "error" : ""}
                  disabled={!inEditMode}
                  variant={isExistent ? "borderless" : "outlined"}
                  style={{ paddingLeft: isExistent ? 0 : 11 }}
                />
                {error && error.message && !isExistent && (
                  <span className={styles.errorText}>
                    {String(error.message)}
                  </span>
                )}
              </>
            )}
          />
        </div>
        {/* Email Input -  */}
        <div className={`${styles.areaEmail} ${styles.inputWrapper}`}>
          <Controller
            name="email"
            control={control}
            rules={{
              required: "Email ist Pflicht",
              pattern: { value: /^\S+@\S+$/i, message: "Ungültige Email" },
            }}
            render={({ field, fieldState: { error } }) => (
              <>
                <Input
                  {...field}
                  placeholder="email@example.de"
                  prefix={<MailOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
                  status={error ? "error" : ""}
                  disabled={!inEditMode}
                  variant={isExistent ? "borderless" : "outlined"}
                  style={{ paddingLeft: isExistent ? 0 : 11 }}
                />
                {error && error.message && !isExistent && (
                  <span className={styles.errorText}>
                    {String(error.message)}
                  </span>
                )}
              </>
            )}
          />
        </div>
        {/* Status Badge */}
        <div className={styles.areaStatus}>
          {isExistent && !inEditMode && (
            <Tag
              color={STATUS_TAG[guest.inviteStatus || "default"]}
              variant="solid"
            >
              {guest.inviteStatus}
            </Tag>
          )}
        </div>

        {/* Actions */}
        <div className={styles.areaActions}>
          {isExistent ? (
            inEditMode ? (
              <>
                <Button
                  type="text"
                  icon={<CheckOutlined style={{ color: "green" }} />}
                  onClick={handleSubmit(onPatch)}
                  loading={isSaving}
                />
                <Button
                  type="text"
                  icon={<CloseOutlined style={{ color: "volcano" }} />}
                  onClick={handleOnCancelClick}
                />
              </>
            ) : (
              <>
                <Button
                  type="text"
                  icon={<LinkOutlined />}
                  onClick={handleCopyLink}
                  title="Copy Invitation Link"
                />
                <Button
                  type="text"
                  icon={<EditOutlined />}
                  onClick={handleOnEditClick}
                />
              </>
            )
          ) : (
            <Button
              type="primary"
              htmlType="submit"
              disabled={!isValid}
              loading={isSaving}
              icon={<PlusOutlined />}
              block
            >
              Add
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
// <Button type="text" icon={<EditOutlined />} onClick={handleOnEditClick} />;
