"use client";

import { useRouter } from "next/navigation";

import { useForm, Controller } from "react-hook-form";
import { Button, Input, Form, message } from "antd";
import { useAuthStore } from "@/stores/useAuthStore";

type FormData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export default function RegisterForm() {
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
      message.success("Registration successful!");
      reset();
      setTimeout(() => router.push("/login"), 2000);
    } catch (err: any) {
      message.error(err.message || "Registration failed");
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
            required: "Name is required",
            minLength: { value: 2, message: "Min 2 chars" },
          }}
          render={({ field }) => (
            <Input {...field} placeholder="Full Name" size="large" />
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
            required: "Email is required",
            pattern: { value: /^\S+@\S+$/i, message: "Invalid email" },
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
            required: "Password is required",
            minLength: { value: 8, message: "Min 8 chars" },
          }}
          render={({ field }) => (
            <Input.Password {...field} placeholder="Password" size="large" />
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
            required: "Please confirm your password",
            validate: (value) =>
              value === getValues("password") || "Passwords do not match",
          }}
          render={({ field }) => (
            <Input.Password
              {...field}
              placeholder="Confirm Password"
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
        {loading ? "Registering..." : "Register"}
      </Button>
    </form>
  );
}
