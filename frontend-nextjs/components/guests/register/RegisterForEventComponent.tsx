"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button, Input, Form, Card, App, Result } from "antd";
import { UserOutlined, MailOutlined } from "@ant-design/icons";
import { registerGuestForEvent } from "@/utils/api";

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
  const [registered, setRegistered] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    defaultValues: { name: "", email: "" },
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    const result = await registerGuestForEvent(eventId, data);
    setLoading(false);

    if (result.error) {
      message.error(result.error);
    } else {
      message.success("Erfolgreich registriert!");
      setRegistered(true);
      reset();
    }
  };

  if (registered) {
    return (
      <Card>
        <Result
          status="success"
          title="Erfolgreich registriert!"
          subTitle="Du wirst per E-Mail informiert, sobald es losgeht."
        />
      </Card>
    );
  }

  return (
    <Card title="Für Event registrieren">
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
