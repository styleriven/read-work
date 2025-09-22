import { type GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type NextAuthOptions,
  type DefaultSession,
} from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { IToken } from "@/types/token";
import { $fetch, $globalFetch } from "@/lib/axios";
import { IUser } from "@/types/user";
import UserRole from "@/enums/Role";
import { REQUEST_URLS_V1 } from "@/config/request-urls";
/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: DefaultSession["user"] & User;
    accessToken: IToken | null;
    refreshToken: IToken | null;
    error?: string;
  }

  interface User extends IUser {
    userRole: UserRole;
    userId: string | number;
  }
}

/**
 * Check if token is expired with configurable buffer time
 */
function isTokenExpired(token: IToken): boolean {
  const expires = token?.expires ? new Date(token.expires) : null;
  if (!expires || isNaN(expires.getTime())) {
    return true;
  }
  return (
    Math.floor(expires.getTime() / 1000) < Math.floor(Date.now() / 1000) + 300
  );
}

/**
 * Refresh access token with better error handling
 */
async function refreshAccessToken(token: any) {
  if (!token.refreshToken?.token) {
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }

  try {
    const response = await $globalFetch.post(REQUEST_URLS_V1.REFRESH_TOKEN, {
      refresh_token: token.refreshToken.token,
    });

    const refreshedTokens = response.data;

    if (!refreshedTokens?.tokens?.access || !refreshedTokens?.tokens?.refresh) {
      throw new Error("Invalid token response structure");
    }

    return {
      ...token,
      accessToken: refreshedTokens.tokens.access,
      refreshToken: refreshedTokens.tokens.refresh,
      error: undefined,
    };
  } catch (error: any) {
    console.error("Error refreshing access token:", {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    });

    // If refresh token is invalid or expired
    if (error.response?.status === 401 || error.response?.status === 403) {
      return {
        ...token,
        error: "RefreshAccessTokenError",
      };
    }

    // For network errors, keep the token and try again later
    return token;
  }
}

/**
 * Validate and normalize URL for redirects
 */
function validateRedirectUrl(url: string, baseUrl: string): string {
  try {
    // Handle relative URLs
    if (url.startsWith("/")) {
      return `${baseUrl}${url}`;
    }

    const urlObj = new URL(url);
    const baseUrlObj = new URL(baseUrl);

    // Only allow same origin redirects
    if (urlObj.origin === baseUrlObj.origin && !url.includes("/login")) {
      return url;
    }

    return baseUrl;
  } catch {
    return baseUrl;
  }
}

/**
 * NextAuth.js configuration
 */
export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      if (url.includes("login?callbackUrl")) {
        try {
          const callbackUrl = new URL(url).searchParams.get("callbackUrl");
          if (callbackUrl) {
            return validateRedirectUrl(callbackUrl, baseUrl);
          }
        } catch {}
      }

      return validateRedirectUrl(url, baseUrl);
    },

    async session({ session, token }) {
      if (token.error === "RefreshAccessTokenError") {
        session.error = "RefreshAccessTokenError";
      }
      session.accessToken = token?.accessToken as IToken;
      session.refreshToken = token?.refreshToken as IToken;
      if (session?.user && token?.user) {
        session.user = {
          ...token.user,
          userRole: token.user.role,
          userId: token.user.id,
        };
      }
      return session;
    },

    async jwt({ token, user, trigger, session }) {
      if (trigger === "update" && session) {
        return {
          ...token,
          accessToken: session?.accessToken,
          refreshToken: session?.refreshToken,
        };
      }

      if (user) {
        return {
          ...token,
          accessToken: user?.access,
          refreshToken: user?.refresh,
          user: {
            ...user,
            email: user?.email ?? null,
          },
        };
      }

      // Check if access token is still valid
      if (token.accessToken && !isTokenExpired(token.accessToken)) {
        return token;
      }

      // Try to refresh the token
      if (token.refreshToken) {
        return await refreshAccessToken(token);
      }
      return {
        ...token,
        error: "RefreshAccessTokenError",
      };
    },
  },
  providers: [
    // Google OAuth (commented out but ready to use)
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_CLIENT_ID!,
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    // }),

    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      type: "credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "Email",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Password",
        },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const response = await $globalFetch.post(REQUEST_URLS_V1.LOGIN, {
            email: credentials.email,
            password: credentials.password,
          });
          const userData = response?.data?.user;
          const tokens = response?.data?.tokens;
          if (!userData || !tokens) {
            return null;
          }

          return {
            ...userData,
            ...tokens,
          };
        } catch (error: any) {
          return null;
        }
      },
    }),

    CredentialsProvider({
      id: "token",
      name: "Token",
      type: "credentials",
      credentials: {
        user: {
          label: "User Data",
          type: "object",
        },
        tokens: {
          label: "Tokens",
          type: "object",
        },
      },
      async authorize(credentials) {
        if (!credentials?.user || !credentials?.tokens) {
          return null;
        }

        try {
          const userData = JSON.parse(credentials.user);
          const tokens = JSON.parse(credentials.tokens);

          // Verify that we have the required data
          if (!userData || !tokens?.access || !tokens?.refresh) {
            return null;
          }

          return {
            ...userData,
            access: tokens.access,
            refresh: tokens.refresh,
          };
        } catch (error: any) {
          console.error("Error in token provider:", error);
          return null;
        }
      },
    }),
  ],
};

/**
 * Wrapper for `getServerSession`
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
