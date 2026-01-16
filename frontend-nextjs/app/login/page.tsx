"use client";

import LoginForm from "@/components/forms/LoginForm";
import { Typography } from "antd";

const { Title } = Typography;

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white p-8 rounded shadow">
        <Title className="text-2xl font-bold mb-6 text-center">Login</Title>
        <LoginForm />
      </div>
    </div>
  );
}
