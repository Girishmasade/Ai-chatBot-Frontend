import { apiSlice } from "../backendApi/apiBackendConnectivity";
import type { ApiResponse, AuthUser } from "../../types";

export const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ── GET /api/v1/user/get-profile/:userId ──────────────────────────
    getUserProfile: builder.query<ApiResponse<{ user: AuthUser }>, string>({
      query: (userId) => `/user/get-profile/${userId}`,
      providesTags: (_result, _error, userId) => [
        { type: "User", id: userId },
        "User",
      ],
    }),

    // ── PUT /api/v1/user/update-profile ──────────────────────────────
    updateUserProfile: builder.mutation<
      ApiResponse<{ data: Partial<AuthUser> }>,
      { username?: string; avatar?: string } | FormData
    >({
      query: (body) => ({
        url: "/user/update-profile",
        method: "PUT",
        body,
        // If FormData is passed, do NOT set Content-Type — browser sets multipart boundary
        ...(body instanceof FormData ? {} : {}),
      }),
      invalidatesTags: ["User"],
    }),

    // ── DELETE /api/v1/user/delete-profile ────────────────────────────
    deleteUserProfile: builder.mutation<ApiResponse, void>({
      query: () => ({
        url: "/user/delete-profile",
        method: "DELETE",
      }),
      invalidatesTags: ["User", "Auth"],
    }),
  }),
});

export const {
  useGetUserProfileQuery,
  useLazyGetUserProfileQuery,
  useUpdateUserProfileMutation,
  useDeleteUserProfileMutation,
} = userApi;
