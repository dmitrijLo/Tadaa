import {
  CheckOutlined,
  CloseOutlined,
  MailOutlined,
  PlusOutlined,
  UserOutlined,
} from "@ant-design/icons";
import styles from "./Guest.module.css";
import { Button, Input } from "antd";
import { Controller, useForm } from "react-hook-form";
import { useState } from "react";

interface GuestRowFormProps {
  eventId: string;
  initialData?: Guest; // EditMode wenn vorhanden, ansonsten CreateMode
  onSave: (data: CreateGuestDto) => Promise<void>;
  onCancel: () => void;
}

export default function GuestForm({
  initialData,
  onSave,
  onCancel,
}: GuestRowFormProps) {
  const hasData = !!initialData;
  const [isSaving, setIsSaving] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { isValid },
  } = useForm<CreateGuestDto>({
    mode: "onChange",
    defaultValues: {
      name: initialData?.name || "",
      email: initialData?.email || "",
    },
  });

  const onSubmit = async (guestData: CreateGuestDto) => {
    setIsSaving(true);
    try {
      await onSave(guestData);
      if (!hasData) reset();
    } catch (err: unknown) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const containerClass = `${styles.card} ${!hasData ? styles.addCard : ""}`;

  return (
    <div className={containerClass}>
      <form className={styles.formGrid} onSubmit={handleSubmit(onSubmit)}>
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
                  variant={hasData ? "borderless" : "outlined"}
                  style={{ paddingLeft: hasData ? 0 : 11 }}
                />
                {error && error.message && !hasData && (
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
                  variant={hasData ? "borderless" : "outlined"}
                  style={{ paddingLeft: hasData ? 0 : 11 }}
                />
                {error && error.message && !hasData && (
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
          {hasData ? (
            <>
              <Button
                type="text"
                icon={<CheckOutlined style={{ color: "green" }} />}
                onClick={handleSubmit(onSubmit)}
                loading={isSaving}
              />
              <Button
                type="text"
                icon={<CloseOutlined style={{ color: "volcano" }} />}
                onClick={onCancel}
              />
            </>
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
