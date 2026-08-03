import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Mail,
  Lock,
  ArrowRight,
  Shield,
  Sparkles,
  Smartphone,
  Fingerprint,
  RefreshCw,
  Key,
  UserCheck,
  Zap,
  Info,
  CheckCircle,
  AlertTriangle,
  Send,
  User,
  Github,
  Chrome,
  Facebook,
} from "lucide-react";
import { env } from "../config/envImport";

interface AuthPageProps {
  onLoginSuccess: (email: string, name: string) => void;
  onBackToLanding: () => void;
}

// ── Hooks ────────────────────────────────────────────────────────────────────
import {
  useRegisterMutation,
  useLoginMutation,
  useVerifyOtpMutation,
  useResendOtpMutation,
} from "../redux/api/authApi";
import { useGetConfigQuery } from "../redux/api/apiSlice";

export default function AuthPage({ onLoginSuccess, onBackToLanding }: AuthPageProps) {
  const { data: configData } = useGetConfigQuery();
  const branding = configData?.branding || (configData as any)?.data?.branding;

  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  // OTP flow states
  const [otpSent, setOtpSent] = useState(false);
  const [userInputOtp, setUserInputOtp] = useState("");
  const [timer, setTimer] = useState(60);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // RTK Query mutations
  const [registerMutation, { isLoading: isRegistering }] = useRegisterMutation();
  const [loginMutation, { isLoading: isLoggingIn }] = useLoginMutation();
  const [verifyOtpMutation, { isLoading: isVerifying }] = useVerifyOtpMutation();
  const [resendOtpMutation, { isLoading: isResending }] = useResendOtpMutation();

  const sendingOtp = isRegistering || isLoggingIn;
  const verifyingOtp = isVerifying;

  // Countdown timer logic for OTP
  useEffect(() => {
    let interval: any = null;
    if (otpSent && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0 && interval) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [otpSent, timer]);

  // Social OAuth URLs (redirect to backend)
  const BACKEND_URL = env.API_URL;
  const socialProviders = [
    {
      name: "Google",
      url: `${BACKEND_URL}/api/v1/auth/google`,
      icon: Chrome,
      color: "hover:border-red-500/30 hover:text-red-400",
    },
    {
      name: "GitHub",
      url: `${BACKEND_URL}/api/v1/auth/github`,
      icon: Github,
      color: "hover:border-zinc-400/30 hover:text-zinc-300",
    },
    {
      name: "Facebook",
      url: `${BACKEND_URL}/api/v1/auth/facebook`,
      icon: Facebook,
      color: "hover:border-blue-500/30 hover:text-blue-500",
    },
  ];

  // Send OTP — calls real backend
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || (isSignup && !name.trim())) {
      setErrorMessage("Please complete all required fields.");
      return;
    }

    setErrorMessage("");
    setSuccessMessage("");

    try {
      if (isSignup) {
        // Register → backend sends OTP email automatically
        const result = await registerMutation({ username: name, email }).unwrap();
        if (result.success) {
          const devOtp = (result.data as any)?.otp;
          setSuccessMessage(devOtp ? `OTP: ${devOtp} (Dev Mode)` : (result.message || "Account created. OTP sent to your email."));
          setOtpSent(true);
          setTimer(60);
        } else {
          setErrorMessage(result.message || "Registration failed.");
        }
      } else {
        // Login → backend sends OTP email
        const result = await loginMutation({ email }).unwrap();
        if (result.success) {
          const devOtp = (result.data as any)?.otp;
          setSuccessMessage(devOtp ? `OTP: ${devOtp} (Dev Mode)` : (result.message || "OTP sent to your email."));
          setOtpSent(true);
          setTimer(60);
        } else {
          setErrorMessage(result.message || "Login failed.");
        }
      }
    } catch (err: any) {
      const apiError = err?.data?.message || err?.message || "Something went wrong.";
      setErrorMessage(apiError);
    }
  };

  // Verify OTP — calls real backend
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (userInputOtp.length !== 6) {
      setErrorMessage("Please enter the complete 6-digit code.");
      return;
    }

    setErrorMessage("");

    try {
      const result = await verifyOtpMutation({ email, otp: userInputOtp }).unwrap();
      if (result.success && result.data) {
        setSuccessMessage("Verifying cryptographic signature... Access Granted!");
        // Auth state is auto-set via extraReducers in authSlice
        setTimeout(() => {
          onLoginSuccess(result.data.user.email, result.data.user.username);
        }, 800);
      } else {
        setErrorMessage(result.message || "OTP verification failed.");
      }
    } catch (err: any) {
      const apiError = err?.data?.message || err?.message || "Invalid OTP code.";
      setErrorMessage(apiError);
    }
  };

  // Resend OTP — calls real backend
  const handleResendOtp = async () => {
    if (timer > 0 || isResending) return;

    setErrorMessage("");
    try {
      const result = await resendOtpMutation({ email }).unwrap();
      if (result.success) {
        setTimer(60);
        const devOtp = (result.data as any)?.otp;
        setSuccessMessage(devOtp ? `OTP: ${devOtp} (Dev Mode)` : "OTP resent successfully.");
        setUserInputOtp("");
      } else {
        setErrorMessage(result.message || "Failed to resend OTP.");
      }
    } catch (err: any) {
      const apiError = err?.data?.message || err?.message || "Failed to resend OTP.";
      setErrorMessage(apiError);
    }
  };

  // Toggle Login/Signup and reset OTP state
  const toggleMode = () => {
    setIsSignup(!isSignup);
    setOtpSent(false);
    setUserInputOtp("");
    setErrorMessage("");
    setSuccessMessage("");
  };

  return (
    <div className="min-h-screen w-full flex bg-[#090909] relative text-white  overflow-hidden font-sans">
      
      {/* Background vector elements and high-contrast ambient orbs */}
      <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(to_right,#111111_1px,transparent_1px),linear-gradient(to_bottom,#111111_1px,transparent_1px)] bg-[size:40px_40px] opacity-20 pointer-events-none" />
      <div className="absolute top-[10%] left-[10%] w-96 h-96 bg-amber-500/[0.02] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] right-[10%] w-96 h-96 bg-amber-500/[0.02] rounded-full blur-[120px] pointer-events-none" />

      {/* Main Split Screen Container */}
      <div className="w-full flex flex-col lg:flex-row relative z-10">

        {/* 1. ANIMATION COMPONENT - Position changes depending on isSignup */}
        <div
          className={`hidden lg:flex flex-1 flex-col justify-between p-12 bg-[#0C0C0C] border-zinc-900 relative overflow-hidden transition-all duration-700 ${
            isSignup 
              ? "order-1 border-r border-[#1F1F1F]" 
              : "order-2 border-l border-[#1F1F1F]"
          }`}
        >
          {/* Subtle Ambient light grids */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-500/[0.005] to-transparent pointer-events-none" />

          {/* Top Logo */}
          <div className="flex items-center gap-3">
            {branding?.mainLogo || branding?.logoImage ? (
              <img 
                src={branding.mainLogo || branding.logoImage} 
                alt="Brand Logo" 
                className="h-9 max-w-[140px] object-contain" 
              />
            ) : (
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
                <span className="text-black font-black text-sm tracking-tighter">GC</span>
              </div>
            )}
            <span className="text-sm font-bold tracking-wider text-white uppercase">
              {branding?.appName || branding?.logoName || "GoChat AI Workspace"}
            </span>
          </div>

          {/* Central Cosmic Interactive Animations */}
          <div className="relative flex-1 flex flex-col items-center justify-center my-10">
            {/* Spinning Cryptographic Rings */}
            <div className="relative w-80 h-80 flex items-center justify-center">
              
              {/* Outer Ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border border-dashed border-zinc-800 rounded-full"
              >
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-amber-500/40 rounded-full blur-[1px]" />
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-amber-500/40 rounded-full blur-[1px]" />
              </motion.div>

              {/* Inner Ring */}
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute inset-8 border border-zinc-800/60 rounded-full"
              >
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-amber-500/60 rounded-full" />
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-amber-500/60 rounded-full" />
              </motion.div>

              {/* Glowing core orb */}
              <motion.div
                animate={{
                  scale: [1, 1.05, 1],
                  opacity: [0.8, 0.95, 0.8]
                }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute w-44 h-44 rounded-full bg-gradient-to-tr from-amber-500/20 via-amber-500/[0.03] to-transparent border border-amber-500/20 flex flex-col items-center justify-center p-4 text-center shadow-[0_0_50px_rgba(245,158,11,0.03)]"
              >
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 mb-2">
                  <Fingerprint className="w-6 h-6 animate-pulse" />
                </div>
                <p className="text-[10px] font-bold text-white uppercase tracking-wider">
                  {otpSent ? "Verification active" : "Handshake ready"}
                </p>
                <p className="text-[8px] text-zinc-500 font-mono mt-0.5 uppercase tracking-widest">
                  {otpSent ? "waiting for OTP code" : "awaiting credentials"}
                </p>
              </motion.div>

              {/* Floating orbiting satellite modules */}
              <motion.div
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-6 left-10 p-2.5 bg-[#121212]/90 border border-zinc-800 rounded-xl flex items-center gap-2"
              >
                <div className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                <div className="text-left">
                  <p className="text-[8px] font-bold text-white uppercase">Secured port</p>
                  <p className="text-[7px] text-zinc-500 font-mono">TLS_1.3 // AES_256</p>
                </div>
              </motion.div>

              <motion.div
                animate={{
                  y: [0, 10, 0],
                }}
                transition={{ duration: 6, delay: 1, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-6 right-10 p-2.5 bg-[#121212]/90 border border-zinc-800 rounded-xl flex items-center gap-2"
              >
                <Zap className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
                <div className="text-left">
                  <p className="text-[8px] font-bold text-white uppercase">System load</p>
                  <p className="text-[7px] text-zinc-500 font-mono">NODE_HEALTH // 98%</p>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Bottom Telemetry Handshake Logs */}
          <div className="space-y-2 text-left">
            <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest font-mono">
              Workspace connection status
            </span>
            <div className="bg-[#121212] border border-zinc-900 rounded-xl p-3.5 font-mono text-[9px] text-zinc-500 space-y-1">
              <p className="flex items-center justify-between">
                <span>&gt; CONNECTION_STABILITY_SECURED</span>
                <span className="text-emerald-500 font-bold">OK</span>
              </p>
              <p className="flex items-center justify-between">
                <span>&gt; COGNITIVE_SUITE_TUNNELS</span>
                <span className="text-amber-500 font-bold">12_ACTIVE</span>
              </p>
              <p className="flex items-center justify-between">
                <span>&gt; GEO_VERIFIED_ACCESS</span>
                <span className="text-zinc-400">US_PACIFIC</span>
              </p>
              {otpSent && (
                <p className="text-amber-500 font-bold animate-pulse">
                  &gt; VERIFICATION_OTP_NODE_DISPATCHED_SUCCESSFULLY
                </p>
              )}
            </div>
          </div>
        </div>

        {/* 2. FORM COMPONENT - Position changes depending on isSignup */}
        <div
          className={`flex-1 flex flex-col justify-between p-8 md:p-16 min-h-screen relative overflow-y-auto custom-scrollbar transition-all duration-700 ${
            isSignup ? "order-2" : "order-1"
          }`}
        >
          {/* Back button */}
          <button
            id="auth-btn-back"
            onClick={onBackToLanding}
            className="w-fit text-xs text-zinc-500 hover:text-white transition flex items-center gap-1.5 uppercase tracking-widest font-bold border border-zinc-900 bg-[#0F0F0F] rounded-xl px-3.5 py-2 cursor-pointer hover:border-zinc-800"
          >
            ← Back to Landing
          </button>

          {/* Form Shell */}
          <div className="w-full max-w-md mx-auto my-auto space-y-8 py-10">
            <div className="space-y-2.5 text-left">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-[9px] font-bold text-amber-500 uppercase tracking-widest font-mono">
                {isSignup ? <Sparkles className="w-3 h-3" /> : <Shield className="w-3 h-3" />}
                {isSignup ? "New Account Setup" : "Secure Workspace Gateway"}
              </div>
              <h2 className="text-2xl font-extrabold text-white tracking-tight leading-snug">
                {isSignup ? "Create VIP Developer Identity" : "Enter Administrative Workspace"}
              </h2>
              <p className="text-xs text-zinc-500 leading-relaxed">
                {isSignup
                  ? "Initialize your private workspace nodes. Complete secure OTP verification to start generating."
                  : "Sign in securely via OTP (One-Time Password) validation to synchronize your strategic workspace."}
              </p>
            </div>

            {/* Error & Success Messages */}
            {errorMessage && (
              <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-3.5 flex items-start gap-2.5 text-xs text-rose-400 text-left">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3.5 flex items-start gap-2.5 text-xs text-emerald-400 text-left">
                <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* OTP FLOW CONTROLLER */}
            <AnimatePresence mode="wait">
              {!otpSent ? (
                /* STEP 1: INPUT EMAIL (AND NAME IF SIGNUP) */
                <motion.form
                  key="step-email"
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 15 }}
                  onSubmit={handleSendOtp}
                  className="space-y-5"
                >
                  {isSignup && (
                    <div className="space-y-2 text-left">
                      <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-zinc-500" /> Full Name
                      </label>
                      <input
                        id="auth-signup-name"
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Dev Coder"
                        className="w-full bg-[#111111] border border-[#242424] focus:border-amber-500/40 focus:outline-none rounded-xl p-3.5 text-xs text-white transition placeholder-zinc-700"
                        disabled={sendingOtp}
                      />
                      <p className="text-[9px] text-zinc-600">Minimum 6 characters required</p>
                    </div>
                  )}

                  <div className="space-y-2 text-left">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-zinc-500" /> Email Address
                    </label>
                    <input
                      id="auth-email-field"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="devcoderm13@gmail.com"
                      className="w-full bg-[#111111] border border-[#242424] focus:border-amber-500/40 focus:outline-none rounded-xl p-3.5 text-xs text-white transition placeholder-zinc-700 font-mono"
                      disabled={sendingOtp}
                    />
                  </div>

                  <button
                    id="auth-btn-send-otp"
                    type="submit"
                    disabled={sendingOtp || !email.trim() || (isSignup && !name.trim())}
                    className="w-full py-4 text-xs font-bold text-black bg-amber-500 hover:bg-amber-400 disabled:bg-[#151515] disabled:text-zinc-600 rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-amber-500/10 cursor-pointer"
                  >
                    {sendingOtp ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        {isSignup ? "Creating account..." : "Sending OTP..."}
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        {isSignup ? "Register & Send OTP" : "Send Verification OTP"}
                      </>
                    )}
                  </button>

                  {/* Social Login Divider */}
                  <div className="relative py-4">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-zinc-900" />
                    </div>
                    <div className="relative flex justify-center text-[9px]">
                      <span className="bg-[#090909] px-3 text-zinc-600 uppercase tracking-widest font-bold">
                        Or continue with
                      </span>
                    </div>
                  </div>

                  {/* Social OAuth Buttons */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {socialProviders.map((provider) => {
                      const Icon = provider.icon;
                      return (
                        <a
                          key={provider.name}
                          href={provider.url}
                          id={`auth-btn-social-${provider.name.toLowerCase()}`}
                          className={`flex items-center justify-center gap-2 py-3 bg-[#111111] border border-[#242424] rounded-xl text-xs font-bold text-zinc-400 transition cursor-pointer ${provider.color}`}
                        >
                          <Icon className="w-4 h-4" />
                          {provider.name}
                        </a>
                      );
                    })}
                  </div>
                </motion.form>
              ) : (
                /* STEP 2: VERIFY OTP (6-digit) */
                <motion.form
                  key="step-otp"
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  onSubmit={handleVerifyOtp}
                  className="space-y-6"
                >
                  <div className="space-y-2.5 text-left bg-[#121215]/80 border border-zinc-900 rounded-2xl p-4">
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      Verification code has been dispatched to <strong className="text-white font-mono">{email}</strong>.
                      Check your email inbox (and spam folder).
                    </p>
                    <button
                      id="auth-btn-change-email"
                      type="button"
                      onClick={() => { setOtpSent(false); setSuccessMessage(""); }}
                      className="text-[10px] text-amber-500 font-bold uppercase tracking-wider hover:underline"
                    >
                      Change Email Address
                    </button>
                  </div>

                  <div className="space-y-3 text-left">
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-zinc-500" /> Enter 6-Digit Security OTP
                    </label>
                    <div className="relative">
                      <input
                        id="auth-otp-input"
                        type="text"
                        maxLength={6}
                        required
                        value={userInputOtp}
                        onChange={(e) => setUserInputOtp(e.target.value.replace(/\D/g, ""))}
                        placeholder="••••••"
                        className="w-full bg-[#111111] border border-[#242424] focus:border-amber-500/40 focus:outline-none rounded-xl p-4 text-center text-xl font-bold tracking-[0.8em] text-amber-500 transition placeholder-zinc-800"
                        disabled={verifyingOtp}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-500">
                      Code expires in: <strong className="text-zinc-300 font-mono">{timer}s</strong>
                    </span>
                    <button
                      id="auth-btn-resend"
                      type="button"
                      onClick={handleResendOtp}
                      disabled={timer > 0 || isResending}
                      className={`font-bold uppercase tracking-wider text-[10px] ${
                        timer > 0 || isResending
                          ? "text-zinc-600 cursor-not-allowed"
                          : "text-amber-500 hover:text-amber-400 hover:underline cursor-pointer"
                      }`}
                    >
                      {isResending ? "Resending..." : "Resend OTP Code"}
                    </button>
                  </div>

                  <button
                    id="auth-btn-verify-submit"
                    type="submit"
                    disabled={verifyingOtp || userInputOtp.length !== 6}
                    className="w-full py-4 text-xs font-bold text-black bg-amber-500 hover:bg-amber-400 disabled:bg-[#151515] disabled:text-zinc-600 rounded-xl transition flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/10 cursor-pointer"
                  >
                    {verifyingOtp ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Verifying OTP...
                      </>
                    ) : (
                      <>
                        <UserCheck className="w-4 h-4" />
                        Verify & Access Workspace
                      </>
                    )}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>

            {/* Switch between login & signup */}
            <div className="pt-6 border-t border-zinc-900 flex justify-center text-xs">
              <span className="text-zinc-500">
                {isSignup ? "Already have a designated workspace?" : "Need a designated workspace?"}
              </span>
              <button
                id="auth-btn-toggle-mode"
                onClick={toggleMode}
                className="text-amber-500 hover:text-amber-400 font-bold ml-1.5 hover:underline"
              >
                {isSignup ? "Sign In Instead" : "Create Identity Node"}
              </button>
            </div>
          </div>

          {/* Core system footer branding */}
          <div className="text-center md:text-left text-[10px] text-zinc-600 font-mono uppercase tracking-widest pt-8 border-t border-zinc-900/60">
            Secure Cryptoport Gateway // © 2026 GoChat AI Core
          </div>
        </div>

      </div>
    </div>
  );
}
