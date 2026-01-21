"use client";

import { useAuthStore } from "@/stores/useAuthStore";
import { Button } from "antd";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const logout = useAuthStore((state) => state.logout);
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };
  return (
    <Button type="primary" onClick={handleLogout}>
      Logout
    </Button>
  );
}
