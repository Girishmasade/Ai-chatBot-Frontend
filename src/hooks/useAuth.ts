import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import {
  setCredentials,
  logout as logoutAction,
  updateCurrentUser,
} from "../redux/slice/authSlice";
import {
  useRegisterMutation,
  useLoginMutation,
  useVerifyOtpMutation,
  useResendOtpMutation,
  useLogoutMutation,
} from "../redux/api/authApi";
import { useUpdateUserProfileMutation } from "../redux/api/userApi";
import { useLazyGetWalletBalanceQuery } from "../redux/api/tokenApi";
import type { AuthUser } from "../types";

/**
 * Central auth hook that bridges RTK Query backend API calls with Redux
 * global auth state. All auth-related actions should go through this hook.
 *
 * NOTE: The old `User` type (with name, tier, credits, etc.) is still used
 * by some pages that rely on mock data. This hook maps the backend AuthUser
 * to a backwards-compatible shape where needed.
 */
export function useAuth() {
  const dispatch = useDispatch();
  const { currentUser, isAuthenticated, accessToken } = useSelector(
    (state: RootState) => state.auth
  );

  // ── Backend API mutations ───────────────────────────────────────────
  const [registerMutation, registerState] = useRegisterMutation();
  const [loginMutation, loginState] = useLoginMutation();
  const [verifyOtpMutation, verifyOtpState] = useVerifyOtpMutation();
  const [resendOtpMutation, resendOtpState] = useResendOtpMutation();
  const [logoutMutation] = useLogoutMutation();
  const [updateProfileMutation] = useUpdateUserProfileMutation();
  const [triggerGetWallet] = useLazyGetWalletBalanceQuery();

  // ── Auth actions ────────────────────────────────────────────────────

  /** Register a new account — sends OTP to email */
  const register = async (username: string, email: string) => {
    const result = await registerMutation({ username, email }).unwrap();
    return result;
  };

  /** Login with email — sends OTP to email */
  const login = async (email: string) => {
    const result = await loginMutation({ email }).unwrap();
    return result;
  };

  /** Verify OTP — on success, auth state is auto-set via extraReducers */
  const verifyOtp = async (email: string, otp: string) => {
    const result = await verifyOtpMutation({ email, otp }).unwrap();
    return result;
  };

  /** Resend OTP to email */
  const resendOtp = async (email: string) => {
    const result = await resendOtpMutation({ email }).unwrap();
    return result;
  };

  /** Logout — calls backend + clears local state */
  const logout = async () => {
    try {
      await logoutMutation().unwrap();
    } catch {
      // Even if the backend call fails, clear local state
    }
    dispatch(logoutAction());
  };

  /** Update profile name */
  const updateName = async (newName: string) => {
    try {
      await updateProfileMutation({ username: newName }).unwrap();
      dispatch(updateCurrentUser({ username: newName }));
    } catch (e) {
      console.error("Update name failed:", e);
      throw e;
    }
  };

  /** Refresh credits from token wallet */
  const refreshCredits = async () => {
    if (!currentUser?.id) return;
    try {
      const result = await triggerGetWallet(currentUser.id, true).unwrap();
      if (result?.data?.wallet) {
        // Wallet balance is available — consumers can use useGetWalletBalanceQuery directly
        console.log("Wallet balance refreshed:", result.data.wallet.balance);
      }
    } catch (e) {
      console.error("Failed to refresh credits:", e);
    }
  };

  /** Manually set credentials (e.g. from OAuth callback) */
  const setAuth = (accessToken: string, user: AuthUser) => {
    dispatch(setCredentials({ accessToken, user }));
  };

  // ── Backward-compatible user shape ──────────────────────────────────
  // Some pages (Dashboard, Profile, etc.) still expect the old `User` type
  // with fields like `name`, `tier`, `credits`, etc. This maps the AuthUser.
  const compatUser = currentUser
    ? {
        id: currentUser.id,
        name: currentUser.username,
        email: currentUser.email,
        role: (currentUser.role === "admin" ? "Administrator" : "User") as "User" | "Administrator" | "Developer",
        tier: "free" as const,
        credits: currentUser.role === "admin" ? 0 : 200,
        joined: new Date().toISOString().split("T")[0],
        status: "active" as const,
      }
    : {
        id: "",
        name: "Guest",
        email: "",
        role: "User" as const,
        tier: "free" as const,
        credits: 200,
        joined: "",
        status: "active" as const,
      };

  return {
    // State
    isAuthenticated,
    currentUser: compatUser,
    authUser: currentUser, // raw backend user
    accessToken,

    // Auth actions
    register,
    login,
    verifyOtp,
    resendOtp,
    logout,
    setAuth,

    // Profile actions
    updateName,
    refreshCredits,

    // Mutation states (for loading/error indicators)
    registerState,
    loginState,
    verifyOtpState,
    resendOtpState,

    // Legacy compatibility — upgrade just dispatches locally for now
    upgrade: async (tier: "free" | "basic" | "pro" | "enterprise", creditsToAdd: number) => {
      // This will be wired to createUserSubscription when backend plans are seeded
      console.log("Upgrade requested:", tier, creditsToAdd);
    },
  };
}
