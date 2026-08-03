import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { authApi } from "../api/authApi";
import type { AuthUser } from "../../types";

// ─── Persisted state helpers ─────────────────────────────────────────────────

const STORAGE_KEY = "gochat_auth";

interface PersistedAuth {
  accessToken: string;
  user: AuthUser;
}

function loadPersistedAuth(): PersistedAuth | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PersistedAuth;
  } catch {
    return null;
  }
}

function persistAuth(data: PersistedAuth): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function clearPersistedAuth(): void {
  localStorage.removeItem(STORAGE_KEY);
}

// ─── Slice state ─────────────────────────────────────────────────────────────

interface AuthState {
  accessToken: string | null;
  currentUser: AuthUser | null;
  isAuthenticated: boolean;
}

const persisted = loadPersistedAuth();

const initialState: AuthState = {
  accessToken: persisted?.accessToken ?? null,
  currentUser: persisted?.user ?? null,
  isAuthenticated: !!persisted?.accessToken,
};

// ─── Slice ───────────────────────────────────────────────────────────────────

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ accessToken: string; user: AuthUser }>
    ) => {
      state.accessToken = action.payload.accessToken;
      state.currentUser = action.payload.user;
      state.isAuthenticated = true;
      persistAuth(action.payload);
    },

    /** Update only the access token (e.g. after silent refresh) */
    updateAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
      if (state.currentUser) {
        persistAuth({
          accessToken: action.payload,
          user: state.currentUser,
        });
      }
    },

    /** Clear auth state on logout */
    logout: (state) => {
      state.accessToken = null;
      state.currentUser = null;
      state.isAuthenticated = false;
      clearPersistedAuth();
    },

    /** Partial update of the current user (e.g. after profile edit) */
    updateCurrentUser: (state, action: PayloadAction<Partial<AuthUser>>) => {
      if (state.currentUser) {
        state.currentUser = { ...state.currentUser, ...action.payload };
        if (state.accessToken) {
          persistAuth({
            accessToken: state.accessToken,
            user: state.currentUser,
          });
        }
      }
    },
  },

  extraReducers: (builder) => {
    // Auto-login when verifyOtp succeeds
    builder.addMatcher(
      authApi.endpoints.verifyOtp.matchFulfilled,
      (state, { payload }) => {
        if (payload.success && payload.data) {
          state.accessToken = payload.data.accessToken;
          state.currentUser = payload.data.user;
          state.isAuthenticated = true;
          persistAuth({
            accessToken: payload.data.accessToken,
            user: payload.data.user,
          });
        }
      }
    );

    // Auto-clear on logout mutation success
    builder.addMatcher(
      authApi.endpoints.logout.matchFulfilled,
      (state) => {
        state.accessToken = null;
        state.currentUser = null;
        state.isAuthenticated = false;
        clearPersistedAuth();
      }
    );

    builder.addMatcher(
      authApi.endpoints.logoutAllDevices.matchFulfilled,
      (state) => {
        state.accessToken = null;
        state.currentUser = null;
        state.isAuthenticated = false;
        clearPersistedAuth();
      }
    );
  },
});

export const { setCredentials, logout, updateCurrentUser, updateAccessToken } = authSlice.actions;
export default authSlice.reducer;
