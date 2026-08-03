import { env } from "@/src/config/envImport";
import { createApi, fetchBaseQuery, type BaseQueryFn, type FetchArgs, type FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { updateAccessToken, logout } from "../slice/authSlice";
import type { RootState } from "../store";

const BACKEND_URL = env.API_URL;

const baseQuery = fetchBaseQuery({
  baseUrl: BACKEND_URL + "/api/v1",
  credentials: "include", // send cookies (refresh token)
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState)?.auth?.accessToken;
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
  
  // Read any new access token the backend sent back via header
  if (result.meta?.response) {
    const newAccessToken = result.meta.response.headers.get("x-access-token");
    if (newAccessToken) {
      api.dispatch(updateAccessToken(newAccessToken));
    }
  }

  // On 401, retry the request once — the backend silentRefresh middleware
  // will use the httpOnly refresh cookie to issue a fresh access token
  if (result.error && result.error.status === 401) {
    const retryResult = await baseQuery(args, api, extraOptions);

    if (retryResult.meta?.response) {
      const refreshedToken = retryResult.meta.response.headers.get("x-access-token");
      if (refreshedToken) {
        api.dispatch(updateAccessToken(refreshedToken));
      }
    }

    if (retryResult.error && retryResult.error.status === 401) {
      api.dispatch(logout());
    }

    return retryResult;
  }

  return result;
};

export const apiSlice = createApi({
  reducerPath: "backendApi",
  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "Auth",
    "User",
    "Otp",
    "Subscription",
    "UserSubscription",
    "TokenWallet",
    "TokenTransaction",
    "TokenPackage",
    "Admin",
  ] as const,
  endpoints: () => ({}),
});