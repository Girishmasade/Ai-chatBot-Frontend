import React, { Suspense, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
  useParams,
  useOutlet
} from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Toaster } from "react-hot-toast";

// Types & Hooks
import { ActiveScreen } from "./types";
import { useAuth } from "./hooks/useAuth";

// Route Guards
import { PrivateRoute } from "./secure/PrivateRoute";

import { AdminRoute } from "./secure/AdminRoute";
import { PublicRoute } from "./secure/PublicRoute";

// Core Components (Eagerly Loaded)
import AppSidebar from "./components/AppSidebar";
import AppTopBar from "./components/AppTopBar";
import CookieBanner from "./components/CookieBanner";
import AppFooter from "./components/AppFooter";

// Lazy-loaded Main Pages
const LandingPage = React.lazy(() => import("./pages/LandingPage"));
const DashboardPage = React.lazy(() => import("./pages/DashboardPage"));
const ChatPage = React.lazy(() => import("./pages/ChatPage"));
const ImagePage = React.lazy(() => import("./pages/ImagePage"));
const VideoPage = React.lazy(() => import("./pages/VideoPage"));
const PromptStudioPage = React.lazy(() => import("./pages/PromptStudioPage"));
const ModelsListPage = React.lazy(() => import("./pages/ModelsListPage"));
const AssetsLibraryPage = React.lazy(() => import("./pages/AssetsLibraryPage"));
const BusinessPlanPage = React.lazy(() => import("./pages/BusinessPlanPage"));
const SubscriptionPage = React.lazy(() => import("./pages/SubscriptionPage"));
const UserSettingsPage = React.lazy(() => import("./pages/UserSettingsPage"));
const ProfilePage = React.lazy(() => import("./pages/ProfilePage"));
const AdminPage = React.lazy(() => import("./pages/AdminPage"));
const AuthPage = React.lazy(() => import("./pages/AuthPage"));


// Lazy-loaded Footer Pages (Handling Named Exports)
const TermsOfServicePage = React.lazy(() => import("./pages/FooterPages").then(m => ({ default: m.TermsOfServicePage })));
const PrivacyPolicyPage = React.lazy(() => import("./pages/FooterPages").then(m => ({ default: m.PrivacyPolicyPage })));
const AboutUsPage = React.lazy(() => import("./pages/FooterPages").then(m => ({ default: m.AboutUsPage })));
const ContactUsPage = React.lazy(() => import("./pages/FooterPages").then(m => ({ default: m.ContactUsPage })));

// Loading Fallback Component
const PageLoader = () => (
  <div className="flex-1 flex items-center justify-center min-h-[50vh] bg-transparent">
    <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

// ------------------------------------------------------------------
//  NAVIGATION HELPERS
// ------------------------------------------------------------------

function useScreenNavigate() {
  const navigate = useNavigate();
  return (screen: ActiveScreen) => {
    switch (screen) {
      case "landing":
        return navigate("/");
      case "auth":
        return navigate("/login");
      case "admin":
        return navigate("/admin/overview");
      default:
        return navigate(`/app/${screen}`);
    }
  };
}

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    const mainContainer = document.querySelector("main");
    if (mainContainer) {
      mainContainer.scrollTo({ top: 0, behavior: "auto" });
    }
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname]);

  return null;
}

// ------------------------------------------------------------------
//  PUBLIC ROUTE HANDLERS
// ------------------------------------------------------------------

function LandingRoute() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, setAuth } = useAuth();
  const goToScreen = useScreenNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    if (token) {
      try {
        const base64Url = token.split('.')[1];
        let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        // Pad with '=' to make the length a multiple of 4
        const pad = base64.length % 4;
        if (pad) {
          if (pad === 1) {
            throw new Error('InvalidLengthError: Input base64url string is the wrong length to determine padding');
          }
          base64 += new Array(5 - pad).join('=');
        }
        
        const jsonPayload = decodeURIComponent(
          window.atob(base64).split('').map(function(c) {
              return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
          }).join('')
        );
        const payload = JSON.parse(jsonPayload);
        
        const user = {
          id: payload.userId,
          username: payload.username,
          email: payload.email,
          role: payload.role as "user" | "admin",
          avatar: payload.avatar,
          isVerified: true,
        };

        setAuth(token, user);
        
        // Remove token from URL and go to dashboard
        navigate("/app/dashboard", { replace: true });
      } catch (e) {
        console.error("Failed to parse token", e);
      }
    }
  }, [location.search, navigate, setAuth]);

  return (
    <LandingPage
      onEnterApp={() => navigate(isAuthenticated ? "/app/dashboard" : "/login")}
      setActiveScreen={goToScreen}
    />
  );
}

function LoginRoute() {
  const navigate = useNavigate();

  return (
    <PublicRoute restricted={true}>
      <AuthPage
        onLoginSuccess={() => navigate("/app/dashboard")}
        onBackToLanding={() => navigate("/")}
      />
    </PublicRoute>
  );
}

// ------------------------------------------------------------------
//  WORKSPACE SHELL (Layout)
// ------------------------------------------------------------------

function WorkspaceShell({ isAdminSection }: { isAdminSection: boolean }) {
  const location = useLocation();
  const navigate = useNavigate();
  const outlet = useOutlet();
  
  const { currentUser, logout, refreshCredits } = useAuth();
  const goToScreen = useScreenNavigate();

  const segments = location.pathname.split("/").filter(Boolean);
  const screenParam = segments[1] || (isAdminSection ? "overview" : "dashboard");
  
  const activeScreen: ActiveScreen = isAdminSection ? "admin" : (screenParam as ActiveScreen);
  const adminActiveTab = isAdminSection ? screenParam : "overview";

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-[#090909] text-white flex  overflow-hidden relative w-full">
      {/* Subtle Background Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-amber-500/[0.015] rounded-full blur-[100px] pointer-events-none" />

      <div className="flex w-full h-screen overflow-hidden">
        <AppSidebar
          activeScreen={activeScreen}
          setActiveScreen={goToScreen}
          currentUser={currentUser}
          onLogout={handleLogout}
          adminActiveTab={adminActiveTab}
          setAdminActiveTab={(tab) => navigate(`/admin/${tab}`)}
          isAdminWorkspace={isAdminSection}
          setIsAdminWorkspace={(val) => navigate(val ? "/admin/overview" : "/app/dashboard")}
        />

        <div className="flex-1 flex flex-col h-full bg-[#090909] overflow-hidden">
          <AppTopBar
            activeScreen={activeScreen}
            setActiveScreen={goToScreen}
            currentUser={currentUser}
            onRefreshCredits={refreshCredits}
          />

          <main className={`flex-1 ${activeScreen === "chat" ? "p-3 md:p-4 overflow-hidden flex flex-col h-full" : "p-6 md:p-8 overflow-y-auto"} custom-scrollbar relative`}>
            <AnimatePresence mode="wait" initial={false}>
              {outlet && (
                <motion.div
                  key={location.pathname}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className={activeScreen === "chat" ? "h-full flex flex-col" : "min-h-full flex flex-col justify-between"}
                >
                  <div className="flex-1 flex flex-col min-h-0">
                    <Suspense fallback={<PageLoader />}>
                      {outlet}
                    </Suspense>
                  </div>
                  {!isAdminSection && activeScreen !== "chat" && <AppFooter setActiveScreen={goToScreen} activeScreen={activeScreen} />}
                </motion.div>
              )}
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
}

// ------------------------------------------------------------------
//  WRAPPED USER & ADMIN ROUTES
// ------------------------------------------------------------------

function DashboardRoute() {
  const { currentUser } = useAuth();
  const goToScreen = useScreenNavigate();
  return <DashboardPage currentUser={currentUser} setActiveScreen={goToScreen} />;
}

function ProfileRoute() {
  const { currentUser, updateName } = useAuth();
  return <ProfilePage currentUser={currentUser} onUpdateName={updateName} />;
}

function SubscriptionRoute() {
  const { upgrade } = useAuth();
  return <SubscriptionPage onUpgrade={upgrade} />;
}

function AdminTabRoute() {
  const { tab } = useParams<{ tab: string }>();
  const navigate = useNavigate();
  return (
    <AdminPage
      activeTab={tab || "overview"}
      setActiveTab={(t: string) => navigate(`/admin/${t}`)}
    />
  );
}

import { useGetConfigQuery } from "./redux/api/apiSlice";

function BrandingSync() {
  const { data: configData } = useGetConfigQuery();
  const branding = configData?.branding || (configData as any)?.data?.branding;

  useEffect(() => {
    if (branding?.favicon) {
      let link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
      if (!link) {
        link = document.createElement("link");
        link.rel = "shortcut icon";
        document.getElementsByTagName("head")[0].appendChild(link);
      }
      link.href = branding.favicon;
    }
    if (branding?.appName || branding?.logoName) {
      document.title = branding.appName || branding.logoName;
    }
  }, [branding]);

  return null;
}

// ------------------------------------------------------------------
//  MAIN APP COMPONENT
// ------------------------------------------------------------------

export default function App() {
  return (
    <BrowserRouter>
      <BrandingSync />
      <ScrollToTop />
      <Toaster 
        position="top-right" 
        toastOptions={{
          style: {
            background: '#1A1A1A',
            color: '#fff',
            border: '1px solid #242424'
          }
        }} 
      />
      <CookieBanner />

      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingRoute />} />
          <Route path="/login" element={<LoginRoute />} />

          {/* User Workspace Routes */}
          <Route path="/app" element={<PrivateRoute><WorkspaceShell isAdminSection={false} /></PrivateRoute>}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<DashboardRoute />} />
            <Route path="chat" element={<ChatPage />} />
            <Route path="image" element={<ImagePage />} />
            <Route path="video" element={<VideoPage />} />
            <Route path="prompt-studio" element={<PromptStudioPage />} />
            <Route path="models-list" element={<ModelsListPage />} />
            <Route path="assets-library" element={<AssetsLibraryPage />} />
            <Route path="business-plan" element={<BusinessPlanPage />} />
            <Route path="subscription" element={<SubscriptionRoute />} />
            <Route path="settings" element={<UserSettingsPage />} />
            <Route path="profile" element={<ProfileRoute />} />
            <Route path="terms" element={<TermsOfServicePage />} />
            <Route path="privacy" element={<PrivacyPolicyPage />} />
            <Route path="about" element={<AboutUsPage />} />
            <Route path="contact" element={<ContactUsPage />} />
            <Route path="*" element={<Navigate to="dashboard" replace />} />
          </Route>

          {/* Admin Workspace Routes */}
          <Route path="/admin" element={
            <AdminRoute>
              <WorkspaceShell isAdminSection={true} />
            </AdminRoute>
          }>
            <Route index element={<Navigate to="overview" replace />} />
            <Route path=":tab" element={<AdminTabRoute />} />
          </Route>

          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
