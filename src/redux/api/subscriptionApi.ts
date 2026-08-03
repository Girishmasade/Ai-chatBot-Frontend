import { apiSlice } from "../backendApi/apiBackendConnectivity";
import type {
  ApiResponse,
  SubscriptionPlan,
  UserSubscription,
} from "../../types";

export const subscriptionApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ── GET /api/v1/subscription/get-subscription ─────────────────────
    // Admin endpoint — fetches all active subscription plans
    getSubscriptionPlans: builder.query<
      ApiResponse<{ subscriptionPlan: SubscriptionPlan[] }>,
      void
    >({
      query: () => "/subscription/get-plans",
      providesTags: ["Subscription"],
    }),

    // ── POST /api/v1/subscription/create-user-subscription/:planId ────
    createUserSubscription: builder.mutation<
      ApiResponse<{ userSubscription: UserSubscription; tokensCredited: number }>,
      string // planId
    >({
      query: (planId) => ({
        url: `/subscription/create-user-subscription/${planId}`,
        method: "POST",
      }),
      invalidatesTags: ["UserSubscription", "TokenWallet", "Subscription"],
    }),

    // ── GET /api/v1/subscription/get-user-subscription/:subscriptionId ─
    getUserSubscription: builder.query<
      ApiResponse<{ getSub: UserSubscription[] }>,
      string // subscriptionId
    >({
      query: (subscriptionId) =>
        `/subscription/get-user-subscription/${subscriptionId}`,
      providesTags: (_result, _error, subscriptionId) => [
        { type: "UserSubscription", id: subscriptionId },
        "UserSubscription",
      ],
    }),

    // ── PUT /api/v1/subscription/cancel-user-subscription/:subscriptionId
    cancelUserSubscription: builder.mutation<
      ApiResponse<{ subscription: UserSubscription }>,
      { subscriptionId: string; reason?: string }
    >({
      query: ({ subscriptionId, ...body }) => ({
        url: `/subscription/cancel-user-subscription/${subscriptionId}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["UserSubscription"],
    }),

    // ── POST /api/v1/subscription/create-subscription ──────────────────
    // Admin endpoint — creates a new subscription plan
    createSubscriptionPlan: builder.mutation<
      ApiResponse<{ createSubscription: SubscriptionPlan }>,
      {
        name: string;
        plan: string;
        price: number;
        description: string;
        tokens: number;
        durationInDays: number;
        services: string[];
        isActive: boolean;
        createdBy: string;
      }
    >({
      query: (body) => ({
        url: "/subscription/create-subscription",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Subscription"],
    }),
  }),
});

export const {
  useGetSubscriptionPlansQuery,
  useLazyGetSubscriptionPlansQuery,
  useCreateUserSubscriptionMutation,
  useGetUserSubscriptionQuery,
  useLazyGetUserSubscriptionQuery,
  useCancelUserSubscriptionMutation,
  useCreateSubscriptionPlanMutation,
} = subscriptionApi;
