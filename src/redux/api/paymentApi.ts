import { apiSlice } from "../backendApi/apiBackendConnectivity";

// We'll use string literals for itemType for type safety without importing server code.

export interface CreateOrderRequest {
  itemType: "SUBSCRIPTION" | "TOKEN_PACKAGE";
  itemId: string;
}

export interface CreateOrderResponse {
  success: boolean;
  message: string;
  data: {
    orderId: string;
    amount: number;
    currency: string;
    transactionId: string;
  };
}

export interface VerifyPaymentRequest {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface VerifyPaymentResponse {
  success: boolean;
  message: string;
  data: {
    status: string;
  };
}

export const paymentApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation<CreateOrderResponse, CreateOrderRequest>({
      query: (data) => ({
        url: "/payment/create-order",
        method: "POST",
        body: data,
      }),
    }),
    verifyPayment: builder.mutation<VerifyPaymentResponse, VerifyPaymentRequest>({
      query: (data) => ({
        url: "/payment/verify",
        method: "POST",
        body: data,
      }),
      // We invalidate UserSubscription and TokenWallet so the UI refreshes
      // automatically when a payment succeeds.
      invalidatesTags: ["UserSubscription", "TokenWallet"],
    }),
  }),
  overrideExisting: false,
});

export const { useCreateOrderMutation, useVerifyPaymentMutation } = paymentApi;
