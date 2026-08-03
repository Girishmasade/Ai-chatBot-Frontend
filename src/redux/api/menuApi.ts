import { apiSlice } from "../backendApi/apiBackendConnectivity";
import type { ApiResponse } from "../../types";

export interface MenuItem {
  id: string;
  label: string;
  icon: string;
  target: string;
  visible: "User Menu" | "Admin Menu";
  order?: number;
  isActive?: boolean;
  parentId?: string;
}

export const menuApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ── GET /api/v1/menu/user ─────────────────────────────────
    // User-side dynamic sidebar menu items
    getUserMenuItems: builder.query<ApiResponse<{ data: MenuItem[] }>, void>({
      query: () => "/menu/user",
      providesTags: ["Admin"],
    }),

    // ── GET /api/v1/menu/admin ────────────────────────────────
    // Admin menu management items list
    getAdminMenuItems: builder.query<ApiResponse<{ data: MenuItem[] }>, void>({
      query: () => "/menu/admin",
      providesTags: ["Admin"],
    }),

    // ── POST /api/v1/menu/create ──────────────────────────────
    createMenuItem: builder.mutation<
      ApiResponse<{ data: MenuItem }>,
      Partial<MenuItem>
    >({
      query: (body) => ({
        url: "/menu/create",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Admin"],
    }),

    // ── PUT /api/v1/menu/:id ──────────────────────────────────
    updateMenuItem: builder.mutation<
      ApiResponse<{ data: MenuItem }>,
      { id: string; data: Partial<MenuItem> }
    >({
      query: ({ id, data }) => ({
        url: `/menu/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Admin"],
    }),

    // ── DELETE /api/v1/menu/:id ───────────────────────────────
    deleteMenuItem: builder.mutation<ApiResponse<{ success: boolean }>, string>({
      query: (id) => ({
        url: `/menu/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Admin"],
    }),
  }),
});

export const {
  useGetUserMenuItemsQuery,
  useGetAdminMenuItemsQuery,
  useCreateMenuItemMutation,
  useUpdateMenuItemMutation,
  useDeleteMenuItemMutation,
} = menuApi;
