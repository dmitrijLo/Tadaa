import { CreateGuestDto, Guest } from "@/types/guest";
import {
  EditOutlined,
  HolderOutlined,
  MailOutlined,
  PlusOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { api } from "@/utils/api";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import styles from "./Guest.module.css";
import { Button, Input, message } from "antd";
import { AxiosError } from "axios";

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
        {/* Name Input */}
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
                  disabled={isExistent}
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
        {/* Email Input */}
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
                  disabled={isExistent}
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
        {/* Actions */}
        <div className={styles.areaActions}>
          {isExistent ? (
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => console.log("Edit clicked")}
            />
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
