"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button, Input, Form, Card, App, Result, Spin } from "antd";
import { UserOutlined, MailOutlined } from "@ant-design/icons";
import Link from "next/link";
import { registerGuestForEvent, getPublicEventInfo } from "@/utils/api";

type FormData = {
  name: string;
  email: string;
};

export default function RegisterForEventComponent({
  eventId,
}: {
  eventId: string;
}) {
  const { message } = App.useApp();
  const [loading, setLoading] = useState(false);
  const [guestId, setGuestId] = useState<string | null>(null);
  const [eventName, setEventName] = useState<string | null>(null);
  const [eventError, setEventError] = useState<string | null>(null);
  const [eventLoading, setEventLoading] = useState(true);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: { name: "", email: "" },
  });

  useEffect(() => {
    const fetchEvent = async () => {
      const result = await getPublicEventInfo(eventId);
      setEventLoading(false);
      if (result.error) {
        setEventError(result.error);
      } else if (result.data) {
        setEventName(result.data.name);
      }
    };
    fetchEvent();
  }, [eventId]);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    const result = await registerGuestForEvent(eventId, data);
    setLoading(false);

    if (result.error) {
      message.error(result.error);
    } else if (result.data) {
      message.success("Erfolgreich registriert!");
      setGuestId(result.data.id);
    }
  };

  if (eventLoading) {
    return (
      <Card>
        <Spin />
      </Card>
    );
  }

  if (eventError) {
    return (
      <Card>
        <Result status="error" title="Event nicht gefunden" />
      </Card>
    );
  }

  if (guestId) {
    return (
      <Card>
        <Result
          status="success"
          title="Erfolgreich registriert!"
          subTitle="Du wirst per E-Mail informiert, sobald es losgeht."
          extra={
            <Link href={`/guests/${guestId}`}>
              <Button type="primary" size="large">
                Zu deiner Seite
              </Button>
            </Link>
          }
        />
      </Card>
    );
  }

  return (
    <Card title={`Registrierung: ${eventName}`}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Form.Item
          validateStatus={errors.name ? "error" : ""}
          help={errors.name?.message}
        >
          <Controller
            name="name"
            control={control}
            rules={{
              required: "Name ist erforderlich",
              minLength: { value: 2, message: "Mindestens 2 Zeichen" },
            }}
            render={({ field }) => (
              <Input
                {...field}
                prefix={<UserOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
                placeholder="Dein Name"
                size="large"
              />
            )}
          />
        </Form.Item>

        <Form.Item
          validateStatus={errors.email ? "error" : ""}
          help={errors.email?.message}
        >
          <Controller
            name="email"
            control={control}
            rules={{
              required: "E-Mail ist erforderlich",
              pattern: { value: /^\S+@\S+$/i, message: "Ungültige E-Mail" },
            }}
            render={({ field }) => (
              <Input
                {...field}
                prefix={<MailOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
                placeholder="Deine E-Mail"
                size="large"
              />
            )}
          />
        </Form.Item>

        <Button
          type="primary"
          htmlType="submit"
          size="large"
          block
          loading={loading}
        >
          Registrieren
        </Button>
      </form>
    </Card>
  );
}
