import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slice/authSlice";
import { apiSlice as mockApiSlice } from "./api/apiSlice";
import { apiSlice as backendApiSlice } from "./backendApi/apiBackendConnectivity";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [mockApiSlice.reducerPath]: mockApiSlice.reducer,
    [backendApiSlice.reducerPath]: backendApiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(mockApiSlice.middleware)
      .concat(backendApiSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
