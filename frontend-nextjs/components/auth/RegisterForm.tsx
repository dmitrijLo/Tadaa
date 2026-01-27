"use client";

import { useRouter } from "next/navigation";

import { useForm, Controller } from "react-hook-form";
import { Button, Input, Form, App } from "antd";
import { useAuthStore } from "@/stores/useAuthStore";

type FormData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export default function RegisterForm() {
  const { message } = App.useApp();
  const router = useRouter();
  const registerUser = useAuthStore((state) => state.register);
  const loading = useAuthStore((state) => state.loading);
  const error = useAuthStore((state) => state.error);
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
  } = useForm<FormData>({
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  const onSubmit = async (data: FormData) => {
    try {
      await registerUser(data.email, data.name, data.password);
      message.success("Registrierung fehlgeschlagen");
      reset();
      setTimeout(() => router.push("/login"), 2000);
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Registrierung fehlgeschlagen";
      message.error(errorMessage);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* FULL NAME */}
      <Form.Item
        validateStatus={errors.name ? "error" : ""}
        help={errors.name?.message}
      >
        <Controller
          name="name"
          control={control}
          rules={{
            required: "Name ist erforderlich",
            minLength: { value: 2, message: "Min. 2 Zeichen" },
          }}
          render={({ field }) => (
            <Input {...field} placeholder="Vollständiger Name" size="large" />
          )}
        />
      </Form.Item>

      {/* EMAIL */}
      <Form.Item
        validateStatus={errors.email ? "error" : ""}
        help={errors.email?.message}
      >
        <Controller
          name="email"
          control={control}
          rules={{
            required: "Email ist erforderlich",
            pattern: { value: /^\S+@\S+$/i, message: "Ungültige Email" },
          }}
          render={({ field }) => (
            <Input {...field} placeholder="Email" size="large" />
          )}
        />
      </Form.Item>

      {/* PASSWORD */}
      <Form.Item
        validateStatus={errors.password ? "error" : ""}
        help={errors.password?.message}
      >
        <Controller
          name="password"
          control={control}
          rules={{
            required: "Passwort ist erforderlich",
            minLength: { value: 8, message: "Min. 8 Zeichen" },
          }}
          render={({ field }) => (
            <Input.Password {...field} placeholder="Passwort" size="large" />
          )}
        />
      </Form.Item>

      {/* CONFIRM PASSWORD */}
      <Form.Item
        validateStatus={errors.confirmPassword ? "error" : ""}
        help={errors.confirmPassword?.message}
      >
        <Controller
          name="confirmPassword"
          control={control}
          rules={{
            required: "Bitte bestätige dein Passwort",
            validate: (value) =>
              value === getValues("password") ||
              "Passwörter stimmen nicht überein",
          }}
          render={({ field }) => (
            <Input.Password
              {...field}
              placeholder="Passwort bestätigen"
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
        style={{ marginTop: "20px" }}
      >
        {loading ? "Registrieren..." : "Registrieren"}
      </Button>
    </form>
  );
}
