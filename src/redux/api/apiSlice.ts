import { createApi, fetchBaseQuery, type BaseQueryFn, type FetchArgs, type FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { updateAccessToken, logout } from "../slice/authSlice";
import type {
  User,
  SystemModel,
  SubscriptionRecord,
  AuditLog,
  BrandingConfig,
  CookieConsent,
  AIAsset,
} from "../../types";

import { env } from "@/src/config/envImport";
import type { RootState } from "../store";

const baseQuery = fetchBaseQuery({
  baseUrl: env.API_URL + "/api/v1",
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    let token = (getState() as RootState)?.auth?.accessToken;
    if (!token) {
      try {
        const raw = localStorage.getItem("gochat_auth");
        if (raw) {
          token = JSON.parse(raw).accessToken;
        }
      } catch (e) {}
    }
    if (token) headers.set("Authorization", `Bearer ${token}`);
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
    // Retry the same request (cookies are sent automatically with credentials: "include")
    const retryResult = await baseQuery(args, api, extraOptions);

    if (retryResult.meta?.response) {
      const refreshedToken = retryResult.meta.response.headers.get("x-access-token");
      if (refreshedToken) {
        api.dispatch(updateAccessToken(refreshedToken));
      }
    }

    if (retryResult.error && retryResult.error.status === 401) {
      // Both access and refresh tokens are dead — force logout
      api.dispatch(logout());
    }

    return retryResult;
  }

  return result;
};

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithReauth,
  tagTypes: ["User", "Asset", "Model", "Subscription", "Log", "Config"],
  endpoints: (builder) => ({
    // ── Dashboard ─────────────────────────────────────────
    getDashboardStats: builder.query<any, void>({
      query: () => "/admin/dashboard",
      transformResponse: (res: any) => res.data?.data || res.data,
      providesTags: ["Config", "User", "Subscription", "Model"],
    }),

    // ── Users ────────────────────────────────────────────
    getUsers: builder.query<User[], void>({
      query: () => "/admin/users",
      transformResponse: (res: any) => res.data?.data || res.data,
      providesTags: ["User"],
    }),
    createUser: builder.mutation<{ success: boolean; user: User }, Partial<User>>({
      query: (body) => ({ url: "/admin/users", method: "POST", body }),
      invalidatesTags: ["User", "Log"],
    }),
    updateUser: builder.mutation<{ success: boolean; user?: User }, Partial<User>>({
      query: (body) => ({ url: `/admin/users/${body.id}`, method: "PUT", body }),
      invalidatesTags: ["User", "Log"],
    }),
    deleteUser: builder.mutation<{ success: boolean }, { id: string }>({
      query: ({ id }) => ({ url: `/admin/users/${id}`, method: "DELETE" }),
      invalidatesTags: ["User", "Log"],
    }),

    // ── Models ───────────────────────────────────────────
    getModels: builder.query<SystemModel[], void>({
      query: () => "/admin/models",
      transformResponse: (res: any) => res.data?.data || res.data,
      providesTags: ["Model"],
    }),
    toggleModel: builder.mutation<{ success: boolean }, { id: string }>({
      query: ({ id }) => ({ url: `/admin/models/${id}/toggle`, method: "PUT" }),
      invalidatesTags: ["Model", "Log"],
    }),
    createModel: builder.mutation<{ success: boolean; data: SystemModel }, Partial<SystemModel>>({
      query: (body) => ({ url: "/admin/models", method: "POST", body }),
      invalidatesTags: ["Model", "Log"],
    }),
    deleteModel: builder.mutation<{ success: boolean }, { id: string }>({
      query: ({ id }) => ({ url: `/admin/models/${id}`, method: "DELETE" }),
      invalidatesTags: ["Model", "Log"],
    }),

    // ── Subscriptions ────────────────────────────────────
    getSubscriptions: builder.query<SubscriptionRecord[], void>({
      query: () => "/admin/subscriptions",
      transformResponse: (res: any) => res.data?.data || res.data,
      providesTags: ["Subscription"],
    }),
    createSubscription: builder.mutation<void, Partial<SubscriptionRecord>>({
      query: (body) => ({ url: "/admin/subscriptions", method: "POST", body }),
      invalidatesTags: ["Subscription", "Log"],
    }),

    // ── Audit Logs ───────────────────────────────────────
    getLogs: builder.query<AuditLog[], void>({
      query: () => "/admin/logs",
      transformResponse: (res: any) => res.data?.data || res.data,
      providesTags: ["Log"],
    }),

    // ── Config / Branding ────────────────────────────────
    getConfig: builder.query<{ branding: BrandingConfig; cookieConsents: CookieConsent[] }, void>({
      query: () => "/admin/config",
      transformResponse: (res: any) => res.data?.data || res.data,
      providesTags: ["Config"],
    }),
    updateBranding: builder.mutation<{ success: boolean }, FormData | Partial<BrandingConfig>>({
      query: (body) => ({ url: "/admin/config/branding", method: "PUT", body }),
      invalidatesTags: ["Config", "Log"],
    }),

    // ── Cookie Consents ──────────────────────────────────
    logConsent: builder.mutation<{ success: boolean }, { user: string; categories: string[] }>({
      query: (body) => ({ url: "/admin/cookie-consent", method: "POST", body }),
      invalidatesTags: ["Config"],
    }),

    // ── User AI Assets ───────────────────────────────────
    getAssets: builder.query<AIAsset[], void>({
      query: () => "/admin/assets",
      transformResponse: (res: any) => res.data?.data || res.data,
      providesTags: ["Asset"],
    }),
    deleteAsset: builder.mutation<{ success: boolean }, { id: string }>({
      query: ({ id }) => ({ url: `/admin/assets/${id}`, method: "DELETE" }),
      invalidatesTags: ["Asset"],
    }),
    generateImage: builder.mutation<{ success: boolean; asset?: AIAsset }, FormData>({
      query: (body) => ({ url: "/ai-request/generate-image", method: "POST", body }),
      invalidatesTags: ["Asset"],
    }),
  }),
});

export const {
  useGetDashboardStatsQuery,
  useGetUsersQuery,
  useLazyGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useGetModelsQuery,
  useToggleModelMutation,
  useCreateModelMutation,
  useDeleteModelMutation,
  useGetSubscriptionsQuery,
  useGetLogsQuery,
  useGetConfigQuery,
  useUpdateBrandingMutation,
  useLogConsentMutation,
  useGetAssetsQuery,
  useDeleteAssetMutation,
  useGenerateImageMutation,
} = apiSlice;
