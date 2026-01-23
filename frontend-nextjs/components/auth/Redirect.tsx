"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/useAuthStore";

export function RedirectIfLoggedIn() {
  const { currentUser } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (currentUser) router.push("/dashboard");
  }, [currentUser, router]);

  return null;
}
