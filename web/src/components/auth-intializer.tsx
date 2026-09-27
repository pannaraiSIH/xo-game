"use client";

import { useAuthStore } from "@/stores/auth-store";
import { useEffect } from "react";

export function AuthInitializer() {
  const fetchProfile = useAuthStore((state) => state.fetchProfile);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return null;
}
