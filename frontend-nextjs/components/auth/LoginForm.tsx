"use client";

import { useRouter } from "next/navigation";

import { useForm, Controller } from "react-hook-form";
import { Button, Input, Form, App } from "antd";
import { useAuthStore } from "@/stores/useAuthStore";

type FormData = {
  email: string;
  password: string;
};

export default function LoginForm() {
  const { message } = App.useApp();
  const router = useRouter();
  const loginUser = useAuthStore((state) => state.login);
  const loading = useAuthStore((state) => state.loading);
  const error = useAuthStore((state) => state.error);
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
  } = useForm<FormData>({
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: FormData) => {
    try {
      await loginUser(data.email, data.password);
      message.success("Login erfolgreich!");
      reset();
      setTimeout(() => router.push("/dashboard"), 2000);
    } catch (err: any) {
      message.error(err.message || "Login fehlgeschlagen");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* FULL NAME */}
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
            minLength: { value: 8, message: "Mindestens 8 Zeichen" },
          }}
          render={({ field }) => (
            <Input.Password {...field} placeholder="Passwort" size="large" />
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
        {loading ? "Anmeldung läuft..." : "Anmelden"}
      </Button>
    </form>
  );
}
