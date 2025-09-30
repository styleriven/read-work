export const REQUEST_URLS = {
  V1: {
    CHANGE_PASSWORD: "/v1/auth/change-password",
    FORGOT_PASSWORD: "/v1/auth/forgot-password",
    LOGIN: "/v1/auth/login",
    LOGOUT: "/v1/auth/logout",
    REFRESH_TOKEN: "/v1/auth/refresh-tokens",
    REGISTER: "/v1/auth/register",
    RESEND_VERIFY_EMAIL: "/v1/auth/resend-verify-email",
    SET_FORGOT_PASSWORD: "/v1/auth/set-forgot-password",
    VERIFY_EMAIL: "/v1/auth/verify-email",
    VERIFY_FORGOT_PASSWORD: "/v1/auth/verify-forgot-password",
    UPLOAD: "/v1/upload",
    USER: "/v1/user",
    CREATE_COMIC: "/v1/comic/create",
    CATEGORY: "/v1/category",
    MY_COMIC: "/v1/comic/my-comic",
    COMIC: "/v1/comic",
    SEARCH_COMICS: "/v1/comic/search",
    COMMENT: "/v1/comment",
  },
};

export const REQUEST_URLS_V1 = REQUEST_URLS.V1;

export const API_VERSIONS = Object.keys(REQUEST_URLS);
