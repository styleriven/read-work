"use client";
import { signIn, useSession } from "next-auth/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { $fetch, $globalFetch } from "@/lib/axios";
import { REQUEST_URLS_V1 } from "@/config/request-urls";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

function AuthProviderHelper({ children }: React.PropsWithChildren) {
  const { update, data: session, status } = useSession();
  const isRefreshingRef = useRef(false);
  const router = useRouter();
  const [ready, setReady] = useState(false);

  const { mutateAsync: refreshTokenMutate } = useMutation({
    mutationFn: (refreshToken: string) =>
      $globalFetch
        .post(REQUEST_URLS_V1.REFRESH_TOKEN, {
          refresh_token: refreshToken,
        })
        .then((res) => res.data),
    retry: 1,
  });

  const fetchAccessToken = useCallback(
    async (refreshToken: string) => {
      if (isRefreshingRef.current) return;

      isRefreshingRef.current = true;
      try {
        const data = await refreshTokenMutate(refreshToken);
        if (data?.tokens) {
          await update({
            ...session,
            accessToken: data.tokens.access,
            refreshToken: data.tokens.refresh,
          });
          return data.tokens;
        } else {
          signIn();
        }
      } catch (error) {
        signIn();
      } finally {
        isRefreshingRef.current = false;
      }
    },
    [refreshTokenMutate, session, update]
  );

  useEffect(() => {
    if (status === "loading") return;
    if (session?.error === "RefreshAccessTokenError") {
      signIn();
      return;
    }

    const requestInterceptor = $fetch.interceptors.request.use(
      (config) => {
        const token = session?.accessToken?.token;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        } else {
          signIn();
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseInterceptor = $fetch.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config;
        const status = error.response?.status;
        if (
          status === 401 &&
          !prevRequest?._retry &&
          session?.refreshToken?.token
        ) {
          prevRequest._retry = true;

          try {
            const tokens = await fetchAccessToken(session.refreshToken.token);
            if (tokens?.access) {
              prevRequest.headers.Authorization = `Bearer ${tokens.access.token}`;
              return $fetch(prevRequest);
            } else {
              signIn();
            }
          } catch (refreshError) {
            signIn();
            return Promise.reject(error);
          }
        }

        if (status === 429) {
          const retryAfter = parseInt(
            error.response.headers["retry-after"] || "60"
          );
          const delay = Math.min(retryAfter * 1000, 300000);

          await new Promise((resolve) => setTimeout(resolve, delay));
          return $fetch(prevRequest);
        }

        return Promise.reject(error);
      }
    );
    setReady(true);

    return () => {
      $fetch.interceptors.response.eject(responseInterceptor);
      $fetch.interceptors.request.eject(requestInterceptor);
    };
  }, [session, status, fetchAccessToken, router, update]);

  if (!ready) {
    return null;
  }

  return <>{children}</>;
}

export default AuthProviderHelper;
