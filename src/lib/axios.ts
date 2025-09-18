import axios from "axios";
import { getServerSession } from "next-auth";
import { authOptions } from "./server/auth";
export const $globalFetch = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
});

export const $fetch = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const $serverFetch = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

$serverFetch.interceptors.request.use(
  async (config) => {
    if (typeof window === "undefined") {
      const session = await getServerSession(authOptions);
      if (session?.accessToken?.token) {
        config.headers.Authorization = `Bearer ${session.accessToken.token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

$serverFetch.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status;

    if (status === 429) {
      const retryAfter = parseInt(
        error.response.headers["retry-after"] || "60"
      );
      const delay = Math.min(retryAfter * 1000, 300000);

      await new Promise((resolve) => setTimeout(resolve, delay));
      return $serverFetch(error.config);
    }

    return Promise.reject(error);
  }
);
