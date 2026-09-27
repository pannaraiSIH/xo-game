"use client";

import { Spinner } from "@/components/ui/spinner";
import { useAuthStore } from "@/stores/auth-store";

export default function Home() {
  const { user, isAuthenticated, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="min-h-dvh grid place-content-center">
        <Spinner />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <p>Not signed in</p>;
  }

  return null;
}
