import { useAuthStore } from "@/stores/auth-store";
import { UserProfile, UserScore, UserScores } from "@/types";
import { GameResult } from "@/types/enums";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface ApiResponse<T> {
  success?: boolean;
  data?: T;
}

class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function request<T = void>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (response.status === 401) {
    useAuthStore.getState().logout();
  }

  if (!response.ok) {
    throw new ApiError("Request failed", response.status);
  }

  let payload: ApiResponse<T> | undefined;
  try {
    payload = await response.json();
  } catch {
    throw new ApiError("Request failed", response.status);
  }

  return (payload?.data ?? (null as T)) as T;
}

export const api = {
  signIn(idToken: string) {
    return request("/auth/oath", {
      method: "POST",
      body: JSON.stringify({ idToken }),
    });
  },

  logout() {
    return request("/auth/", { method: "POST" });
  },

  getProfile() {
    return request<UserProfile>("/auth/profile", { method: "GET" });
  },

  createGameResult(result: GameResult) {
    return request<UserScore>("/game/result", {
      method: "POST",
      body: JSON.stringify({ result }),
    });
  },

  getCurrentScore() {
    return request<UserScore>("/game/score", { method: "GET" });
  },

  getUserScores(limit: number, page: number) {
    return request<UserScores[]>(
      `/game/user-scores?limit=${limit}&page=${page}`,
      { method: "GET" },
    );
  },
};
