import { apiSlice } from "../backendApi/apiBackendConnectivity";
import type { ApiResponse, AuthUser, VerifyOtpResponse } from "../../types";


export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ── POST /api/v1/auth/register ───────────────────────────────────
    register: builder.mutation<
      ApiResponse<{ id: string; username: string; email: string; isVerified: boolean }>,
      { username: string; email: string }
    >({
      query: (body) => ({
        url: "/auth/register",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Auth"],
    }),

    // ── POST /api/v1/auth/login ──────────────────────────────────────
    login: builder.mutation<ApiResponse, { email: string }>({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Auth"],
    }),

    // ── POST /api/v1/otp/send ────────────────────────────────────────
    sendOtp: builder.mutation<ApiResponse<{ otp?: string }>, { email: string }>({
      query: (body) => ({
        url: "/otp/send",
        method: "POST",
        body,
      }),
    }),

    // ── POST /api/v1/otp/verify ──────────────────────────────────────
    verifyOtp: builder.mutation<
      ApiResponse<VerifyOtpResponse>,
      { email: string; otp: string }
    >({
      query: (body) => ({
        url: "/otp/verify",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Auth", "User", "TokenWallet"],
    }),

    // ── POST /api/v1/otp/resend ──────────────────────────────────────
    resendOtp: builder.mutation<ApiResponse, { email: string }>({
      query: (body) => ({
        url: "/otp/resend",
        method: "POST",
        body,
      }),
    }),

    // ── POST /api/v1/auth/logout ─────────────────────────────────────
    logout: builder.mutation<ApiResponse, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      invalidatesTags: [
        "Auth",
        "User",
        "TokenWallet",
        "TokenTransaction",
        "Subscription",
        "UserSubscription",
      ],
    }),

    // ── POST /api/v1/auth/logout-all ─────────────────────────────────
    logoutAllDevices: builder.mutation<ApiResponse, void>({
      query: () => ({
        url: "/auth/logout-all",
        method: "POST",
      }),
      invalidatesTags: [
        "Auth",
        "User",
        "TokenWallet",
        "TokenTransaction",
        "Subscription",
        "UserSubscription",
      ],
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useSendOtpMutation,
  useVerifyOtpMutation,
  useResendOtpMutation,
  useLogoutMutation,
  useLogoutAllDevicesMutation,
} = authApi;