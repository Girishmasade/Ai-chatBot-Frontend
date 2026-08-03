import { apiSlice } from "../backendApi/apiBackendConnectivity";
import type {
  ApiResponse,
  TokenWallet,
  TokenTransaction,
  TokenPackage,
} from "../../types";

export const tokenApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ── GET /api/v1/token-wallet/:userId ──────────────────────────────
    getWalletBalance: builder.query<ApiResponse<{ wallet: TokenWallet }>, string>({
      query: (userId) => `/token-wallet/${userId}`,
      providesTags: (_result, _error, userId) => [
        { type: "TokenWallet", id: userId },
        "TokenWallet",
      ],
    }),

    // ── GET /api/v1/token-transaction/me ──────────────────────────────
    getMyTransactions: builder.query<
      ApiResponse<{ transactions: TokenTransaction[] }>,
      { page?: number; limit?: number } | void
    >({
      query: (params) => ({
        url: "/token-transaction/me",
        params: params || undefined,
      }),
      providesTags: ["TokenTransaction"],
    }),

    // ── GET /api/v1/token-transaction/:transactionId ─────────────────
    getTransactionById: builder.query<
      ApiResponse<{ transaction: TokenTransaction }>,
      string
    >({
      query: (transactionId) => `/token-transaction/${transactionId}`,
      providesTags: (_result, _error, transactionId) => [
        { type: "TokenTransaction", id: transactionId },
      ],
    }),

    // ── GET /api/v1/token-package/active ──────────────────────────────
    getActiveTokenPackages: builder.query<
      ApiResponse<{ packages: TokenPackage[] }>,
      void
    >({
      query: () => "/token-package/active",
      providesTags: ["TokenPackage"],
    }),
  }),
});

export const {
  useGetWalletBalanceQuery,
  useLazyGetWalletBalanceQuery,
  useGetMyTransactionsQuery,
  useLazyGetMyTransactionsQuery,
  useGetTransactionByIdQuery,
  useGetActiveTokenPackagesQuery,
} = tokenApi;
