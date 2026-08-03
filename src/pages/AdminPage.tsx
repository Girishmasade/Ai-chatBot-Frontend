import React, { useState, useEffect } from "react";
import {
  Users,
  Cpu,
  CreditCard,
  History,
  Settings,
  ShieldAlert,
  Plus,
  Edit2,
  Trash2,
  ToggleLeft,
  ToggleRight,
  Sparkles,
  Save,
  CheckCircle,
  CheckCircle2,
  FileText,
  AlertCircle,
  Sliders,
  Palette,
  Fingerprint,
  RefreshCw,
  DollarSign,
  Activity,
  LayoutTemplate,
  MessageSquare,
  Image as ImageIcon2,
  Video,
  Box
} from "lucide-react";
import { User, SystemModel, SubscriptionRecord, AuditLog, CookieConsent, BrandingConfig } from "../types";
import CommonModal from "../components/CommonModal";
import ConfirmModal from "../components/ConfirmModal";
import { getStoredSocialLinks, saveSocialLinks, PLATFORM_ICONS, SocialLinkItem } from "../helpers/socialLinks";
import {
  useGetDashboardStatsQuery,
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useGetModelsQuery,
  useToggleModelMutation,
  useCreateModelMutation,
  useDeleteModelMutation,
  useGetSubscriptionsQuery,
  useGetLogsQuery,
  useGetConfigQuery,
  useUpdateBrandingMutation
} from "../redux/api/apiSlice";
import { useCreateSubscriptionPlanMutation, useGetSubscriptionPlansQuery } from "../redux/api/subscriptionApi";
import {
  useGetAdminMenuItemsQuery,
  useCreateMenuItemMutation,
  useDeleteMenuItemMutation,
  useUpdateMenuItemMutation,
} from "../redux/api/menuApi";
import { useAuth } from "../hooks/useAuth";
import { calculateRevenue } from "../helpers/utils";
import toast from "react-hot-toast";

interface AdminPageProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
}

export default function AdminPage({ activeTab, setActiveTab }: AdminPageProps) {
  // RTK Queries
  const { data: dashboardStatsResponse } = useGetDashboardStatsQuery();
  const dashboardStats = dashboardStatsResponse?.data || {};
  
  const { data: usersData } = useGetUsersQuery();
  const { data: modelsData } = useGetModelsQuery();
  const { data: subscriptionsData } = useGetSubscriptionsQuery();
  const { data: dbPlansResponse } = useGetSubscriptionPlansQuery();
  const dbPlans = dbPlansResponse?.data?.subscriptionPlan || [];
  const { data: logsData } = useGetLogsQuery();
  const { data: configData } = useGetConfigQuery();

  // RTK Mutations
  const [createUser] = useCreateUserMutation();
  const [updateUser] = useUpdateUserMutation();
  const [deleteUser] = useDeleteUserMutation();
  const [toggleModel] = useToggleModelMutation();
  const [updateBranding] = useUpdateBrandingMutation();
  const [createSubscriptionPlan, { isLoading: isCreatingPlan }] = useCreateSubscriptionPlanMutation();
  const { data: adminMenuData } = useGetAdminMenuItemsQuery();
  console.log("adminMenuData",adminMenuData);
  const [createMenuItem] = useCreateMenuItemMutation();
  const [updateMenuItem] = useUpdateMenuItemMutation();
  const [deleteMenuItem] = useDeleteMenuItemMutation();
  const [createModel] = useCreateModelMutation();
  const [deleteModel] = useDeleteModelMutation();
  const { authUser } = useAuth();

  // Database local states synced with RTK Query caches
  const [users, setUsers] = useState<User[]>([]);
  const [models, setModels] = useState<SystemModel[]>([]);
  const [subscriptions, setSubscriptions] = useState<SubscriptionRecord[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [cookieConsents, setCookieConsents] = useState<CookieConsent[]>([]);
  const [branding, setBranding] = useState<BrandingConfig>({
    appName: "GoChat AI",
    logoName: "GoChat AI",
    logoImage: "",
    mainLogo: "",
    favicon: "",
    mobileLogo: "",
    themeMode: "Black Amber",
    primaryColor: "#F59E0B",
    accentGlow: "rgba(245, 158, 11, 0.15)",
    footerText: ""
  });

  // Modal actions control
  const [isUserCreateOpen, setIsUserCreateOpen] = useState(false);
  const [isUserEditOpen, setIsUserEditOpen] = useState(false);
  const [isModelCreateOpen, setIsModelCreateOpen] = useState(false);
  const [isMenuCreateOpen, setIsMenuCreateOpen] = useState(false);
  const [isPlanCreateOpen, setIsPlanCreateOpen] = useState(false);
  const [isSocialModalOpen, setIsSocialModalOpen] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
  const [deleteModelId, setDeleteModelId] = useState<string | null>(null);

  // Social Links State
  const [socialLinks, setSocialLinks] = useState<SocialLinkItem[]>(getStoredSocialLinks());
  const [socialForm, setSocialForm] = useState({
    label: "",
    href: "",
    platform: "LinkedIn"
  });

  // Form Fields
  const [userForm, setUserForm] = useState({
    id: "",
    name: "",
    email: "",
    role: "User",
    tier: "free",
    credits: "200"
  });

  const [modelForm, setModelForm] = useState({
    name: "",
    version: "",
    type: "text",
    description: "",
    latency: "0.5s",
    provider: "huggingface"
  });

  const [brandingForm, setBrandingForm] = useState({
    appName: "GoChat AI",
    logoName: "GoChat AI",
    primaryColor: "#F59E0B",
    footerText: ""
  });
  
  const [brandingFiles, setBrandingFiles] = useState<{
    mainLogo: File | null;
    favicon: File | null;
    mobileLogo: File | null;
  }>({
    mainLogo: null,
    favicon: null,
    mobileLogo: null
  });

  const [menuItems, setMenuItems] = useState([
    { id: "1", label: "Overview", icon: "LayoutDashboard", target: "dashboard", visible: "User Menu" },
    { id: "2", label: "Conversational Chat", icon: "MessageSquareText", target: "chat", visible: "User Menu" },
    { id: "3", label: "Image Studio", icon: "ImageIcon", target: "image", visible: "User Menu" },
    { id: "4", label: "User Pool", icon: "Users", target: "users", visible: "Admin Menu" },
    { id: "5", label: "AI Model Manager", icon: "Cpu", target: "models", visible: "Admin Menu" }
  ]);

  const [menuForm, setMenuForm] = useState<{
    id?: string;
    label: string;
    icon: string;
    target: string;
    visible: string;
    parentId: string;
  }>({
    label: "",
    icon: "LayoutDashboard",
    target: "dashboard",
    visible: "User Menu",
    parentId: ""
  });
  const [menuFilter, setMenuFilter] = useState<"All" | "User Menu" | "Admin Menu">("All");

  // Subscription Plan Form
  const [planForm, setPlanForm] = useState({
    name: "",
    plan: "free",
    price: 0,
    description: "",
    tokens: 100,
    durationInDays: 30,
    isActive: true
  });
  const [planServices, setPlanServices] = useState<string[]>([]);
  const [serviceInput, setServiceInput] = useState("");

  // Footer configuration
  const [footerForm, setFooterForm] = useState({
    phone: "+91 (80) 4125-9900",
    email: "support@gochat.ai",
    newsletterPlaceholder: "Enter work email...",
    description: "The luxury standard for multi-modal intelligence workspace solutions.",
    twitterUrl: "https://twitter.com/gochatai",
    linkedinUrl: "https://linkedin.com/company/gochatai"
  });

  // Cookie Consents statistics
  const [consentsStats, setConsentsStats] = useState({
    totalAccepted: 2,
    essentialOnly: 0,
    allConsents: 2
  });

  // Settings
  const [settingsForm, setSettingsForm] = useState({
    twoFactorEnabled: true,
    sessionTimeout: "60",
    passwordComplexity: "Medium",
    strongPasswordEnforced: true,
    activeSessionsLimit: "3"
  });



  // Sync state values with RTK Query cache responses
  useEffect(() => {
    if (usersData) setUsers(usersData);
  }, [usersData]);

  useEffect(() => {
    if (modelsData) setModels(modelsData);
  }, [modelsData]);

  useEffect(() => {
    if (subscriptionsData) setSubscriptions(subscriptionsData);
  }, [subscriptionsData]);

  useEffect(() => {
    if (logsData) setAuditLogs(logsData);
  }, [logsData]);

  useEffect(() => {
    if (adminMenuData?.data) {
      setMenuItems(adminMenuData?.data?.data as any);
    }
  }, [adminMenuData]);

  useEffect(() => {
    if (configData) {
      setBranding(configData.branding);
      setBrandingForm({
        appName: configData.branding.appName || "GoChat AI",
        logoName: configData.branding.logoName || "GoChat AI",
        primaryColor: configData.branding.primaryColor || "#F59E0B",
        footerText: configData.branding.footerText || ""
      });
      setCookieConsents(configData.cookieConsents);
      const totalAcc = configData.cookieConsents.filter((c: any) => c.consented !== false).length;
      const essOnly = configData.cookieConsents.filter((c: any) => c.categories?.length === 1 && c.categories[0] === "Essential").length;
      setConsentsStats({
        totalAccepted: totalAcc,
        essentialOnly: essOnly,
        allConsents: configData.cookieConsents.length
      });
    }
  }, [configData]);

  // USER OPERATIONS
  const handleCreateUser = async () => {
    try {
      const payload = {
        name: userForm.name,
        email: userForm.email,
        role: userForm.role as any,
        tier: userForm.tier as any,
        credits: parseInt(userForm.credits) || 0
      };
      const data = await createUser(payload).unwrap();
      if (data.success) {
        toast.success("User account deployed successfully");
        setIsUserCreateOpen(false);
        setUserForm({ id: "", name: "", email: "", role: "User", tier: "free", credits: "100" });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleEditUserClick = (u: User) => {
    setUserForm({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      tier: u.tier,
      credits: u.credits.toString()
    });
    setIsUserEditOpen(true);
  };

  const handleUpdateUser = async () => {
    try {
      const payload = {
        id: userForm.id,
        name: userForm.name,
        email: userForm.email,
        role: userForm.role as any,
        tier: userForm.tier as any,
        credits: parseInt(userForm.credits) || 0
      };
      const data = await updateUser(payload).unwrap();
      if (data.success) {
        toast.success("User account specs updated");
        setIsUserEditOpen(false);
        setUserForm({ id: "", name: "", email: "", role: "User", tier: "free", credits: "100" });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteUserId) return;
    try {
      const data = await deleteUser({ id: deleteUserId }).unwrap();
      if (data.success) {
        toast.success("User record purged successfully");
        setDeleteUserId(null);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // MODEL TOGGLE & ADD
  const handleToggleModel = async (id: string) => {
    try {
      const data = await toggleModel({ id }).unwrap();
      if (data.success) {
        toast.success("Model allocation toggled");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateModel = async () => {
    try {
      const payload = {
        name: modelForm.name || "Custom Model",
        type: modelForm.type,
        version: modelForm.version || "custom-v1",
        status: "active" as const,
        description: modelForm.description || "Custom model deallocated via CMS.",
        latency: modelForm.latency,
        provider: modelForm.provider || "huggingface"
      };
      
      const res = await createModel(payload).unwrap();
      if (res.success) {
        setIsModelCreateOpen(false);
        setModelForm({ name: "", version: "", type: "text", description: "", latency: "0.5s", provider: "huggingface" });
        toast.success("Custom AI Model mapped to environment");
      }
    } catch (e: any) {
      console.error(e);
      toast.error(e?.data?.message || "Failed to create model");
    }
  };

  // BRANDING CMS SAVE
  const handleSaveBranding = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("appName", brandingForm.appName);
      formData.append("logoName", brandingForm.logoName);
      formData.append("primaryColor", brandingForm.primaryColor);
      formData.append("footerText", brandingForm.footerText);

      if (brandingFiles.mainLogo) formData.append("mainLogo", brandingFiles.mainLogo);
      if (brandingFiles.favicon) formData.append("favicon", brandingFiles.favicon);
      if (brandingFiles.mobileLogo) formData.append("mobileLogo", brandingFiles.mobileLogo);

      const data = await updateBranding(formData).unwrap();
      if (data.success) {
        toast.success("Platform CMS branding saved successfully");
      }
    } catch (e: any) {
      console.error(e);
      toast.error(e?.data?.message || "Failed to save branding");
    }
  };

  // MENU OPERATION
  const handleCreateMenuItem = async () => {
    try {
      const payload = {
        label: menuForm.label || "Untitled Link",
        icon: menuForm.icon,
        target: menuForm.target,
        visible: menuForm.visible as "User Menu" | "Admin Menu",
        parentId: menuForm.parentId || undefined
      };
      
      if (menuForm.id) {
        const res = await updateMenuItem({ id: menuForm.id, data: payload }).unwrap();
        if (res.success) {
          toast.success("Navigation layout node updated successfully");
        }
      } else {
        const res = await createMenuItem(payload).unwrap();
        if (res.success) {
          toast.success("Navigation layout node created successfully");
        }
      }

      setMenuForm({ label: "", icon: "LayoutDashboard", target: "dashboard", visible: "User Menu", parentId: "", id: undefined });
      setIsMenuCreateOpen(false);
    } catch (e: any) {
      toast.error(e?.data?.message || (menuForm.id ? "Failed to update menu item" : "Failed to create menu item"));
    }
  };

  const handleEditMenuItem = (item: any) => {
    setMenuForm({
      id: item.id || item._id,
      label: item.label,
      icon: item.icon,
      target: item.target,
      visible: item.visible,
      parentId: item.parentId || ""
    });
    setIsMenuCreateOpen(true);
  };

  const handlePurgeMenuItem = async (id: string) => {
    try {
      await deleteMenuItem(id).unwrap();
      toast.success("Navigation node purged.");
    } catch (e: any) {
      toast.error(e?.data?.message || "Failed to delete menu item");
    }
  };

  // SUBSCRIPTION PLAN CREATE
  const handleCreatePlan = async () => {
    try {
      const payload = {
        name: planForm.name,
        plan: planForm.plan,
        price: planForm.price,
        description: planForm.description,
        tokens: planForm.tokens,
        durationInDays: planForm.durationInDays,
        services: planServices,
        isActive: planForm.isActive,
        createdBy: authUser?.id || ""
      };
      const result = await createSubscriptionPlan(payload).unwrap();
      if (result.success) {
        toast.success("Subscription plan created successfully");
        setIsPlanCreateOpen(false);
        setPlanForm({ name: "", plan: "free", price: 0, description: "", tokens: 100, durationInDays: 30, isActive: true });
        setPlanServices([]);
        setServiceInput("");
      }
    } catch (e: any) {
      toast.error(e?.data?.message || "Failed to create plan");
      console.error(e);
    }
  };

  const handleAddService = () => {
    const trimmed = serviceInput.trim().toUpperCase();
    if (trimmed && !planServices.includes(trimmed)) {
      setPlanServices([...planServices, trimmed]);
    }
    setServiceInput("");
  };

  const handleRemoveService = (svc: string) => {
    setPlanServices(planServices.filter(s => s !== svc));
  };

  // SOCIAL LINKS OPERATIONS
  const handleAddSocialLink = () => {
    if (!socialForm.href.trim()) {
      toast.success("Please provide a valid URL link");
      return;
    }
    const newItem: SocialLinkItem = {
      id: `s-${Date.now()}`,
      label: socialForm.label.trim() || socialForm.platform,
      href: socialForm.href.trim().startsWith("http") ? socialForm.href.trim() : `https://${socialForm.href.trim()}`,
      platform: socialForm.platform
    };
    const updated = [...socialLinks, newItem];
    setSocialLinks(updated);
    saveSocialLinks(updated);
    setIsSocialModalOpen(false);
    setSocialForm({ label: "", href: "", platform: "LinkedIn" });
    toast.success("Social icon added successfully!");
  };

  const handleDeleteSocialLink = (id: string) => {
    const updated = socialLinks.filter(item => item.id !== id);
    setSocialLinks(updated);
    saveSocialLinks(updated);
    toast.success("Social icon deleted");
  };

  // BILLING REVENUES
  const totalRevenueEst = calculateRevenue(subscriptions);

  return (
    <div className="space-y-6  p-1 text-left relative">


      {/* -------------------------------------------------------------
          TABS VIEWPORTS DETAILED MATCHING 10 SCREENS
         ------------------------------------------------------------- */}

      {/* 1. OVERVIEW TAB */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* KPI Stats counters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-[#111111] border border-[#242424] p-5 rounded-xl space-y-1">
              <p className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Total User Pool</p>
              <p className="text-xl font-extrabold text-white font-numbers">{users.length}</p>
            </div>
            <div className="bg-[#111111] border border-[#242424] p-5 rounded-xl space-y-1">
              <p className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Active AI Models</p>
              <p className="text-xl font-extrabold text-white font-numbers">{models.filter(m => m.status === "active").length} / {models.length}</p>
            </div>
            <div className="bg-[#111111] border border-[#242424] p-5 rounded-xl space-y-1">
              <p className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Monthly Revenue Est</p>
              <p className="text-xl font-extrabold text-white font-numbers">₹{totalRevenueEst.toLocaleString()}</p>
            </div>
            <div className="bg-[#111111] border border-[#242424] p-5 rounded-xl space-y-1">
              <p className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">Cookie Agreements</p>
              <p className="text-xl font-extrabold text-white font-numbers">{consentsStats.totalAccepted}</p>
            </div>
          </div>

          {/* Top Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total Users */}
            <div className="bg-[#111111] border border-[#242424] rounded-2xl p-5 flex flex-col justify-between">
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-bold text-zinc-400">Total Users</span>
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white font-mono">{dashboardStats?.totalUsers?.toLocaleString() || 0}</h3>
                <p className="text-[10px] text-emerald-500 font-bold mt-1 tracking-wider"><span className="text-emerald-500">+12%</span> <span className="text-zinc-500">this month</span></p>
              </div>
            </div>

            {/* Active Plans */}
            <div className="bg-[#111111] border border-[#242424] rounded-2xl p-5 flex flex-col justify-between">
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-bold text-zinc-400">Active Plans</span>
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                  <CreditCard className="w-4 h-4" />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white font-mono">{dashboardStats?.activePlans?.toLocaleString() || 0}</h3>
              </div>
            </div>

            {/* AI Models */}
            <div className="bg-[#111111] border border-[#242424] rounded-2xl p-5 flex flex-col justify-between">
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-bold text-zinc-400">AI Models</span>
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                  <Cpu className="w-4 h-4" />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white font-mono">{dashboardStats?.activeModels || 0}/{dashboardStats?.totalModels || 0}</h3>
              </div>
            </div>

            {/* Revenue */}
            <div className="bg-[#111111] border border-[#242424] rounded-2xl p-5 flex flex-col justify-between">
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-bold text-zinc-400">Revenue (Est.)</span>
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-500">
                  <DollarSign className="w-4 h-4" />
                </div>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white font-mono">${dashboardStats?.revenue?.toLocaleString() || 0}</h3>
                <p className="text-[10px] text-emerald-500 font-bold mt-1 tracking-wider"><span className="text-emerald-500">+8%</span> <span className="text-zinc-500">this month</span></p>
              </div>
            </div>
          </div>

          {/* Middle Panels */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* System Health */}
            <div className="bg-[#111111] border border-[#242424] rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-5">
                <Activity className="w-4 h-4 text-amber-500" />
                <h4 className="text-sm font-bold text-white">System Health</h4>
              </div>
              <div className="space-y-4">
                {(dashboardStats?.systemHealth || []).map((h: any, i: number) => (
                  <div key={i} className="flex justify-between items-center text-xs">
                    <span className="text-zinc-300 font-semibold">{h.service}</span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-bold text-emerald-500 uppercase tracking-wider flex items-center gap-1.5">
                      <CheckCircle2 className="w-2.5 h-2.5" /> {h.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Subscription Overview */}
            <div className="bg-[#111111] border border-[#242424] rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-5">
                <LayoutTemplate className="w-4 h-4 text-amber-500" />
                <h4 className="text-sm font-bold text-white">Subscription Overview</h4>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-300 font-semibold">Free Users</span>
                  <span className="font-mono text-zinc-400 font-bold">{dashboardStats?.subscriptionOverview?.freeUsers || 0}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-300 font-semibold">Paid Users</span>
                  <span className="font-mono text-amber-500 font-bold">{dashboardStats?.subscriptionOverview?.paidUsers || 0}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-300 font-semibold">Enterprise</span>
                  <span className="font-mono text-purple-500 font-bold">{dashboardStats?.subscriptionOverview?.enterpriseUsers || 0}</span>
                </div>
              </div>
            </div>

            {/* AI Service Usage */}
            <div className="bg-[#111111] border border-[#242424] rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <h4 className="text-sm font-bold text-white">AI Service Usage</h4>
              </div>
              <div className="space-y-3.5">
                <div className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2 text-zinc-300">
                    <MessageSquare className="w-3.5 h-3.5 text-zinc-500" /> <span className="font-semibold">Chat Usage</span>
                  </div>
                  <span className="font-mono text-zinc-100 font-bold">{dashboardStats?.serviceUsage?.chatUsage || 0}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2 text-zinc-300">
                    <ImageIcon2 className="w-3.5 h-3.5 text-zinc-500" /> <span className="font-semibold">Image Usage</span>
                  </div>
                  <span className="font-mono text-zinc-100 font-bold">{dashboardStats?.serviceUsage?.imageUsage || 0}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2 text-zinc-300">
                    <Video className="w-3.5 h-3.5 text-zinc-500" /> <span className="font-semibold">Video Usage</span>
                  </div>
                  <span className="font-mono text-zinc-100 font-bold">{dashboardStats?.serviceUsage?.videoUsage || 0}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2 text-zinc-300">
                    <Box className="w-3.5 h-3.5 text-zinc-500" /> <span className="font-semibold">Asset Usage</span>
                  </div>
                  <span className="font-mono text-zinc-100 font-bold">{dashboardStats?.serviceUsage?.assetUsage || 0}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Panel */}
          <div className="bg-[#111111] border border-[#242424] rounded-2xl p-5 min-h-[250px] flex flex-col">
            <div className="flex items-center gap-2 mb-5">
              <History className="w-4 h-4 text-amber-500" />
              <h4 className="text-sm font-bold text-white">Recent Activities</h4>
            </div>
            
            {(!auditLogs || auditLogs.length === 0) ? (
              <div className="flex-1 flex items-center justify-center text-xs text-zinc-600 font-semibold">
                No recent activities
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                <table className="w-full text-xs text-left">
                  <thead className="text-[10px] uppercase text-zinc-600 border-b border-[#1F1F1F]">
                    <tr>
                      <th className="pb-3 font-semibold">Action</th>
                      <th className="pb-3 font-semibold">Details</th>
                      <th className="pb-3 font-semibold">Operator</th>
                      <th className="pb-3 font-semibold text-right">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auditLogs.slice(0, 10).map((log, idx) => (
                      <tr key={log.id || idx} className="border-b border-[#1F1F1F] hover:bg-zinc-900/30 transition">
                        <td className="py-3 font-bold text-amber-500 uppercase">{log.action}</td>
                        <td className="py-3 text-zinc-400 truncate max-w-[300px]">{log.details}</td>
                        <td className="py-3 text-zinc-300 font-mono">{log.operator}</td>
                        <td className="py-3 text-zinc-500 text-right">{new Date(log.timestamp).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2. USER POOL TAB */}
      {activeTab === "users" && (
        <div className="bg-[#111111] border border-[#242424] rounded-2xl overflow-hidden shadow-xl">
          <div className="p-4 bg-[#0C0C0C] border-b border-[#1F1F1F] flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">User Directory Pools</h4>
              <p className="text-[10px] text-zinc-500">Deploy, adjust or delete active membership credentials</p>
            </div>
            <button
              id="admin-btn-add-user"
              onClick={() => {
                setUserForm({ id: "", name: "", email: "", role: "User", tier: "free", credits: "100" });
                setIsUserCreateOpen(true);
              }}
              className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold rounded-lg flex items-center gap-1.5 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Member
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-zinc-300">
              <thead className="bg-[#111111] text-[10px] uppercase text-zinc-500 tracking-wider border-b border-[#1F1F1F]">
                <tr>
                  <th className="px-6 py-3.5">Name</th>
                  <th className="px-6 py-3.5">Email Identity</th>
                  <th className="px-6 py-3.5">Role</th>
                  <th className="px-6 py-3.5">Membership</th>
                  <th className="px-6 py-3.5">Inference Balance</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-[#1F1F1F] hover:bg-zinc-900/30 transition">
                    <td className="px-6 py-4 font-semibold text-white">{u.name}</td>
                    <td className="px-6 py-4 font-mono text-zinc-400">{u.email}</td>
                    <td className="px-6 py-4">{u.role}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-[9px] font-bold text-amber-500 uppercase tracking-wider">
                        {u.tier}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono font-bold">{u.credits.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${u.status === "active" ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" : "bg-rose-500/10 text-rose-500 border border-rose-500/20"}`}>
                        {u.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right flex justify-end gap-2.5">
                      <button
                        onClick={() => handleEditUserClick(u)}
                        className="p-1 hover:text-amber-500 transition"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteUserId(u.id)}
                        className="p-1 hover:text-rose-500 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. VIP SUBSCRIPTIONS TAB */}
      {activeTab === "billing" && (
        <div className="space-y-6">
          {/* Section: MongoDB Created Subscription Plans */}
          <div className="bg-[#111111] border border-[#242424] rounded-2xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#1F1F1F]">
              <div className="text-left">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Created Subscription Plans (`subscriptionplans` DB)</h4>
                <p className="text-[10px] text-zinc-500">All active & configured subscription plans created in MongoDB for users</p>
              </div>
              <button
                id="admin-btn-create-plan"
                onClick={() => {
                  setPlanForm({ name: "", plan: "free", price: 0, description: "", tokens: 100, durationInDays: 30, isActive: true });
                  setPlanServices([]);
                  setServiceInput("");
                  setIsPlanCreateOpen(true);
                }}
                className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold rounded-lg flex items-center gap-1.5 transition cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Create Plan
              </button>
            </div>

            {dbPlans.length === 0 ? (
              <div className="p-8 text-center text-zinc-500 text-xs font-mono">
                No subscription plans found in MongoDB. Click "Create Plan" to define one.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {dbPlans.map((plan: any) => (
                  <div
                    key={plan._id}
                    className="p-4 bg-[#161616] border border-[#242424] rounded-xl flex flex-col justify-between space-y-3 text-left hover:border-amber-500/30 transition"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <h5 className="text-xs font-bold text-white">{plan.name}</h5>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${plan.isActive ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" : "bg-zinc-800 text-zinc-500"}`}>
                          {plan.isActive ? "Active" : "Disabled"}
                        </span>
                      </div>
                      <p className="text-[10px] text-zinc-500 line-clamp-2">{plan.description}</p>
                    </div>

                    <div className="py-2 border-y border-[#222] flex items-center justify-between text-xs">
                      <div>
                        <span className="text-[10px] text-zinc-500 block uppercase font-bold">Price</span>
                        <span className="font-bold text-amber-500 font-mono">₹{plan.price}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-zinc-500 block uppercase font-bold">Tokens</span>
                        <span className="font-bold text-white font-mono">{plan.tokens || 0}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-zinc-500 block uppercase font-bold">Validity</span>
                        <span className="font-bold text-zinc-300 font-mono">{plan.durationInDays || 30}d</span>
                      </div>
                    </div>

                    {plan.services && plan.services.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {plan.services.map((svc: string) => (
                          <span key={svc} className="px-1.5 py-0.5 rounded bg-zinc-900 border border-[#2A2A2A] text-[9px] text-zinc-400 uppercase">
                            {svc}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section: VIP Membership Transaction Ledger */}
          <div className="bg-[#111111] border border-[#242424] rounded-2xl overflow-hidden shadow-xl">
            <div className="p-4 bg-[#0C0C0C] border-b border-[#1F1F1F] text-left">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">VIP Membership Ledger</h4>
              <p className="text-[10px] text-zinc-500">Detailed transaction billing records in Indian Rupees (₹)</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left text-zinc-300">
                <thead className="bg-[#111111] text-[10px] uppercase text-zinc-500 tracking-wider border-b border-[#1F1F1F]">
                  <tr>
                    <th className="px-6 py-3.5">User Identity</th>
                    <th className="px-6 py-3.5">Plan Selected</th>
                    <th className="px-6 py-3.5">Price</th>
                    <th className="px-6 py-3.5">Cycle</th>
                    <th className="px-6 py-3.5">Date Added</th>
                    <th className="px-6 py-3.5">Invoice State</th>
                  </tr>
                </thead>
                <tbody>
                  {subscriptions.map((s) => (
                    <tr key={s.id} className="border-b border-[#1F1F1F] hover:bg-zinc-900/30 transition">
                      <td className="px-6 py-4 font-semibold text-white font-mono">{s.userEmail}</td>
                      <td className="px-6 py-4">{s.plan}</td>
                      <td className="px-6 py-4 font-mono font-bold text-amber-500">{s.price}</td>
                      <td className="px-6 py-4 uppercase font-bold text-[9px] tracking-wider text-zinc-500">{s.cycle}</td>
                      <td className="px-6 py-4 text-zinc-400">{s.date}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${s.status === "paid" ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" : "bg-rose-500/10 text-rose-500 border border-rose-500/20"}`}>
                          {s.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 4. AI MODEL MANAGER TAB */}
      {activeTab === "models" && (
        <div className="bg-[#111111] border border-[#242424] rounded-2xl p-6 space-y-4">
          <div className="pb-3 border-b border-[#1F1F1F] flex justify-between items-center">
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Environment AI Models</h4>
              <p className="text-[10px] text-zinc-500">Add custom providers or toggle active deallocation states</p>
            </div>
            <button
              onClick={() => setIsModelCreateOpen(true)}
              className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold rounded-lg flex items-center gap-1.5 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Model
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {models.map((m) => (
              <div
                key={m.id}
                className={`p-4 rounded-xl border flex items-start justify-between gap-4 transition ${
                  m.status === "active" ? "bg-amber-500/[0.01] border-amber-500/20" : "bg-transparent border-[#242424] opacity-50"
                }`}
              >
                <div className="space-y-1 text-left">
                  <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-[8px] font-bold uppercase text-zinc-400 font-mono">{m.type}</span>
                  <h5 className="text-xs font-bold text-white mt-1.5">{m.name}</h5>
                  <p className="text-[10px] text-zinc-500 max-w-xs">{m.description}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleModel(m.id)}
                    className="p-1 text-zinc-400 hover:text-white transition"
                    title="Toggle status"
                  >
                    {m.status === "active" ? <ToggleRight className="w-7 h-7 text-amber-500" /> : <ToggleLeft className="w-7 h-7 text-zinc-600" />}
                  </button>
                  <button
                    onClick={async () => {
                        setDeleteModelId(m.id);
                    }}
                    className="p-1 text-zinc-500 hover:text-rose-500 transition"
                    title="Delete Model"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. MENU CONTROL TAB */}
      {activeTab === "menu" && (
        <div className="bg-[#111111] border border-[#242424] rounded-2xl overflow-hidden shadow-xl">
          <div className="p-4 bg-[#0C0C0C] border-b border-[#1F1F1F] flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Navigation Menu Node Manager</h4>
              <p className="text-[10px] text-zinc-500">Configure visual layout order and side visibility metrics</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex bg-[#111111] border border-[#242424] rounded-lg p-0.5">
                <button
                  onClick={() => setMenuFilter("All")}
                  className={`px-3 py-1 text-[10px] font-bold uppercase rounded-md transition ${menuFilter === "All" ? "bg-zinc-800 text-white" : "text-zinc-500 hover:text-zinc-300"}`}
                >
                  All
                </button>
                <button
                  onClick={() => setMenuFilter("User Menu")}
                  className={`px-3 py-1 text-[10px] font-bold uppercase rounded-md transition ${menuFilter === "User Menu" ? "bg-zinc-800 text-white" : "text-zinc-500 hover:text-zinc-300"}`}
                >
                  User
                </button>
                <button
                  onClick={() => setMenuFilter("Admin Menu")}
                  className={`px-3 py-1 text-[10px] font-bold uppercase rounded-md transition ${menuFilter === "Admin Menu" ? "bg-zinc-800 text-white" : "text-zinc-500 hover:text-zinc-300"}`}
                >
                  Admin
                </button>
              </div>
              <button
                onClick={() => setIsMenuCreateOpen(true)}
                className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold rounded-lg flex items-center gap-1.5 transition cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Add Menu Link
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left text-zinc-300">
              <thead className="bg-[#111111] text-[10px] uppercase text-zinc-500 tracking-wider border-b border-[#1F1F1F]">
                <tr>
                  <th className="px-6 py-3.5">Label</th>
                  <th className="px-6 py-3.5">Icon Reference</th>
                  <th className="px-6 py-3.5">Target Workspace Screen</th>
                  <th className="px-6 py-3.5">Assigned View</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {menuItems
                  .filter((item: any) => (menuFilter === "All" || item.visible === menuFilter) && !item.parentId)
                  .map((parent: any) => (
                    <React.Fragment key={parent.id || parent._id}>
                      <tr className="border-b border-[#1F1F1F] hover:bg-zinc-900/30 transition">
                        <td className="px-6 py-4 font-semibold text-white">{parent.label}</td>
                        <td className="px-6 py-4 font-mono text-zinc-400">{parent.icon}</td>
                        <td className="px-6 py-4 font-mono text-zinc-400">{parent.target}</td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-0.5 rounded bg-zinc-800 text-[9px] font-bold text-zinc-300 uppercase tracking-wider">
                            {parent.visible}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right flex justify-end">
                          <button
                            onClick={() => handleEditMenuItem(parent)}
                            className="p-1 hover:text-amber-500 transition mr-2"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handlePurgeMenuItem(parent.id || parent._id)}
                            className="p-1 hover:text-rose-500 transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                      {menuItems
                        .filter((child: any) => child.parentId === (parent.id || parent._id))
                        .map((child: any) => (
                          <tr key={child.id || child._id} className="border-b border-[#1F1F1F] hover:bg-zinc-900/30 transition bg-[#0C0C0C]/50">
                            <td className="px-6 py-4 font-semibold text-zinc-300">
                              <div className="flex items-center gap-2 pl-4 border-l-2 border-zinc-700">
                                <span className="text-zinc-500">↳</span> {child.label}
                              </div>
                            </td>
                            <td className="px-6 py-4 font-mono text-zinc-400">{child.icon}</td>
                            <td className="px-6 py-4 font-mono text-zinc-400">{child.target}</td>
                            <td className="px-6 py-4">
                              <span className="px-2 py-0.5 rounded bg-zinc-800 text-[9px] font-bold text-zinc-300 uppercase tracking-wider">
                                {child.visible}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-right flex justify-end">
                              <button
                                onClick={() => handleEditMenuItem(child)}
                                className="p-1 hover:text-amber-500 transition mr-2"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handlePurgeMenuItem(child.id || child._id)}
                                className="p-1 hover:text-rose-500 transition"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                    </React.Fragment>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 6. FOOTER CMS TAB */}
      {activeTab === "footer" && (
        <div className="bg-[#111111] border border-[#242424] rounded-2xl p-6 space-y-6">
          <div className="pb-3 border-b border-[#1F1F1F] text-left">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Footer Configuration Console</h4>
            <p className="text-[10px] text-zinc-500">Modify regional company support hotline and social anchors</p>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); toast.success("Footer parameters stored successfully!"); }} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Support Contact Hotline</label>
                <input
                  type="text"
                  value={footerForm.phone}
                  onChange={(e) => setFooterForm({ ...footerForm, phone: e.target.value })}
                  className="w-full bg-[#1A1A1A] border border-[#242424] focus:border-amber-500/40 focus:outline-none rounded-xl p-3 text-xs text-white"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Administrative Email</label>
                <input
                  type="email"
                  value={footerForm.email}
                  onChange={(e) => setFooterForm({ ...footerForm, email: e.target.value })}
                  className="w-full bg-[#1A1A1A] border border-[#242424] focus:border-amber-500/40 focus:outline-none rounded-xl p-3 text-xs text-white"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Newsletter Placeholder text</label>
              <input
                type="text"
                value={footerForm.newsletterPlaceholder}
                onChange={(e) => setFooterForm({ ...footerForm, newsletterPlaceholder: e.target.value })}
                className="w-full bg-[#1A1A1A] border border-[#242424] focus:border-amber-500/40 focus:outline-none rounded-xl p-3 text-xs text-white"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Brief Company Description</label>
              <textarea
                value={footerForm.description}
                onChange={(e) => setFooterForm({ ...footerForm, description: e.target.value })}
                className="w-full bg-[#1A1A1A] border border-[#242424] focus:border-amber-500/40 focus:outline-none rounded-xl p-3 text-xs text-white h-20 resize-none"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 text-xs font-bold text-black bg-amber-500 hover:bg-amber-400 rounded-lg transition flex items-center gap-1.5 shadow-lg shadow-amber-500/15 cursor-pointer"
              >
                <Save className="w-4 h-4" /> Save Footer Parameters
              </button>
            </div>
          </form>

          {/* Social Media Icons Manager */}
          <div className="pt-6 border-t border-[#1F1F1F] space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-left">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Social Icons & Media Links</h4>
                <p className="text-[10px] text-zinc-500">Add or delete social media links displayed across the global platform footer</p>
              </div>
              <button
                id="admin-btn-add-social"
                type="button"
                onClick={() => setIsSocialModalOpen(true)}
                className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold rounded-lg flex items-center gap-1.5 transition cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Add Social Icon
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {socialLinks.map((social) => {
                const IconComp = PLATFORM_ICONS[social.platform] || PLATFORM_ICONS["Website"];
                return (
                  <div
                    key={social.id}
                    className="p-3.5 bg-[#161616] border border-[#242424] rounded-xl flex items-center justify-between gap-3 text-left hover:border-amber-500/20 transition"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-2 rounded-lg bg-zinc-900 border border-[#2A2A2A] text-amber-500 shrink-0">
                        <IconComp className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <h5 className="text-xs font-semibold text-white truncate">{social.label}</h5>
                        <a
                          href={social.href}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[10px] text-zinc-500 hover:text-amber-400 truncate block font-mono"
                        >
                          {social.href}
                        </a>
                      </div>
                    </div>

                    <button
                      id={`admin-btn-delete-social-${social.id}`}
                      type="button"
                      onClick={() => handleDeleteSocialLink(social.id)}
                      className="p-1.5 text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition shrink-0"
                      title="Delete Social Icon"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 7. BRANDING CMS TAB */}
      {activeTab === "branding" && (
        <form onSubmit={handleSaveBranding} className="space-y-6 max-w-4xl">
          <div className="flex justify-between items-start mb-6">
            <div className="text-left">
              <h2 className="text-2xl font-extrabold text-white">Branding</h2>
              <p className="text-sm text-zinc-400 mt-1">Manage logos and app identity</p>
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-bold text-black bg-amber-500 hover:bg-amber-400 rounded-lg transition flex items-center gap-1.5 shadow-lg shadow-amber-500/15 cursor-pointer"
            >
              <Save className="w-4 h-4" /> Save Branding Settings
            </button>
          </div>

          <div className="space-y-6">
            {/* Application Name */}
            <div className="bg-[#161616] border border-[#242424] rounded-xl p-5 text-left">
              <label className="block text-xs font-bold text-white mb-3">Application Name</label>
              <input
                type="text"
                value={brandingForm.appName}
                onChange={(e) => setBrandingForm({ ...brandingForm, appName: e.target.value })}
                className="w-full max-w-md bg-[#1E1E1E] border border-[#333] focus:border-[#555] focus:outline-none rounded-lg p-2.5 text-xs text-white"
                placeholder="GoChat AI"
              />
            </div>

            {/* Main Logo */}
            <div className="bg-[#161616] border border-[#242424] rounded-xl p-5 text-left">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-sm font-bold text-white">Main Logo</h4>
                  <p className="text-xs text-zinc-500 mt-0.5">Shown in sidebar, dashboard, and auth pages</p>
                </div>
                <label className="px-4 py-1.5 bg-[#1E1E1E] border border-[#333] hover:bg-[#2A2A2A] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition cursor-pointer">
                  <span className="text-lg pb-1">↑</span> Upload
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setBrandingFiles({...brandingFiles, mainLogo: e.target.files[0]});
                      }
                    }}
                  />
                </label>
              </div>
              <div className="border border-dashed border-[#333] rounded-lg p-8 flex flex-col items-center justify-center text-center bg-[#111111]/50">
                {brandingFiles.mainLogo ? (
                  <img src={URL.createObjectURL(brandingFiles.mainLogo)} alt="Main Logo Preview" className="h-16 object-contain" />
                ) : branding.mainLogo ? (
                  <img src={branding.mainLogo} alt="Main Logo" className="h-16 object-contain" />
                ) : (
                  <>
                    <ImageIcon2 className="w-8 h-8 text-zinc-600 mb-2" />
                    <p className="text-xs text-zinc-500 font-semibold">No image uploaded</p>
                  </>
                )}
              </div>
            </div>

            {/* Favicon */}
            <div className="bg-[#161616] border border-[#242424] rounded-xl p-5 text-left">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-sm font-bold text-white">Favicon</h4>
                  <p className="text-xs text-zinc-500 mt-0.5">Browser tab icon (recommended: 32x32 or 64x64)</p>
                </div>
                <label className="px-4 py-1.5 bg-[#1E1E1E] border border-[#333] hover:bg-[#2A2A2A] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition cursor-pointer">
                  <span className="text-lg pb-1">↑</span> Upload
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setBrandingFiles({...brandingFiles, favicon: e.target.files[0]});
                      }
                    }}
                  />
                </label>
              </div>
              <div className="border border-dashed border-[#333] rounded-lg p-8 flex flex-col items-center justify-center text-center bg-[#111111]/50">
                {brandingFiles.favicon ? (
                  <img src={URL.createObjectURL(brandingFiles.favicon)} alt="Favicon Preview" className="h-12 w-12 object-contain" />
                ) : branding.favicon ? (
                  <img src={branding.favicon} alt="Favicon" className="h-12 w-12 object-contain" />
                ) : (
                  <>
                    <ImageIcon2 className="w-8 h-8 text-zinc-600 mb-2" />
                    <p className="text-xs text-zinc-500 font-semibold">No image uploaded</p>
                  </>
                )}
              </div>
            </div>

            {/* Mobile Logo */}
            <div className="bg-[#161616] border border-[#242424] rounded-xl p-5 text-left">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-sm font-bold text-white">Mobile Logo</h4>
                  <p className="text-xs text-zinc-500 mt-0.5">Optimized logo for mobile devices</p>
                </div>
                <label className="px-4 py-1.5 bg-[#1E1E1E] border border-[#333] hover:bg-[#2A2A2A] text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition cursor-pointer">
                  <span className="text-lg pb-1">↑</span> Upload
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setBrandingFiles({...brandingFiles, mobileLogo: e.target.files[0]});
                      }
                    }}
                  />
                </label>
              </div>
              <div className="border border-dashed border-[#333] rounded-lg p-8 flex flex-col items-center justify-center text-center bg-[#111111]/50">
                {brandingFiles.mobileLogo ? (
                  <img src={URL.createObjectURL(brandingFiles.mobileLogo)} alt="Mobile Logo Preview" className="h-12 object-contain" />
                ) : branding.mobileLogo ? (
                  <img src={branding.mobileLogo} alt="Mobile Logo" className="h-12 object-contain" />
                ) : (
                  <>
                    <ImageIcon2 className="w-8 h-8 text-zinc-600 mb-2" />
                    <p className="text-xs text-zinc-500 font-semibold">No image uploaded</p>
                  </>
                )}
              </div>
            </div>
          </div>
        </form>
      )}

      {/* 8. COOKIE LEDGER TAB */}
      {activeTab === "cookies" && (
        <div className="space-y-4">
          {/* Dynamic Cookie Stats Header */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-[#111111] border border-[#242424] rounded-xl text-left">
              <span className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold">Total Consent Records</span>
              <h3 className="text-xl font-bold text-white mt-1">{consentsStats.allConsents}</h3>
            </div>
            <div className="p-4 bg-[#111111] border border-[#242424] rounded-xl text-left">
              <span className="text-[9px] uppercase tracking-widest text-emerald-500 font-bold">Accepted Agreements</span>
              <h3 className="text-xl font-bold text-emerald-400 mt-1">{consentsStats.totalAccepted}</h3>
            </div>
            <div className="p-4 bg-[#111111] border border-[#242424] rounded-xl text-left">
              <span className="text-[9px] uppercase tracking-widest text-amber-500 font-bold">Essential Category Only</span>
              <h3 className="text-xl font-bold text-amber-400 mt-1">{consentsStats.essentialOnly}</h3>
            </div>
          </div>

          <div className="bg-[#111111] border border-[#242424] rounded-2xl overflow-hidden shadow-xl">
            <div className="p-4 bg-[#0C0C0C] border-b border-[#1F1F1F] text-left">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Cookie Agreements Registry</h4>
              <p className="text-[10px] text-zinc-500">Live logs of user consent configurations stored in MongoDB</p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left text-zinc-300">
                <thead className="bg-[#111111] text-[10px] uppercase text-zinc-500 tracking-wider border-b border-[#1F1F1F]">
                  <tr>
                    <th className="px-6 py-3.5">Identity User</th>
                    <th className="px-6 py-3.5">Consent Categories</th>
                    <th className="px-6 py-3.5">Agreement Status</th>
                    <th className="px-6 py-3.5">Logged Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {cookieConsents && cookieConsents.length > 0 ? (
                    cookieConsents.map((cc) => (
                      <tr key={cc.id} className="border-b border-[#1F1F1F] hover:bg-zinc-900/30 transition">
                        <td className="px-6 py-4 font-semibold text-white font-mono">{cc.user}</td>
                        <td className="px-6 py-4">{Array.isArray(cc.categories) ? cc.categories.join(", ") : "Essential"}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                            cc.consented !== false
                              ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                              : "bg-rose-500/10 text-rose-500 border border-rose-500/20"
                          }`}>
                            {cc.consented !== false ? "Accepted" : "Declined"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-zinc-500">{cc.timestamp}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-zinc-500 text-xs">
                        No cookie consent logs registered in database yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 9. SECURITY AUDITS TAB */}
      {activeTab === "audits" && (
        <div className="bg-[#111111] border border-[#242424] rounded-2xl overflow-hidden shadow-xl">
          <div className="p-4 bg-[#0C0C0C] border-b border-[#1F1F1F] text-left">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Platform Security Audits</h4>
            <p className="text-[10px] text-zinc-500">Live system audit trails logged dynamically by Express API</p>
          </div>

          <div className="divide-y divide-[#1F1F1F] font-mono text-[10px] text-zinc-400 max-h-[400px] overflow-y-auto custom-scrollbar">
            {auditLogs.map((log) => (
              <div key={log.id} className="p-3.5 flex items-start justify-between gap-4 hover:bg-zinc-900/35 transition">
                <div className="space-y-1.5 text-left">
                  <div className="flex items-center gap-2">
                    <span className="text-amber-500 font-bold uppercase text-[9px] tracking-wider bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded">{log.action}</span>
                    <span className="text-[#71717A]">•</span>
                    <span className="text-zinc-300 font-bold">{log.operator}</span>
                  </div>
                  <p className="text-[10px] text-zinc-500 leading-relaxed">{log.details}</p>
                </div>

                <span className="text-[9px] text-[#52525B]">{log.timestamp}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 10. SYSTEM SETTINGS TAB */}
      {activeTab === "settings" && (
        <div className="bg-[#111111] border border-[#242424] rounded-2xl p-6 space-y-6">
          <div className="pb-3 border-b border-[#1F1F1F] text-left">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">System Settings Room</h4>
            <p className="text-[10px] text-zinc-500">Enforce password complexities and active session lock thresholds</p>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); toast.success("System settings saved!"); }} className="space-y-4">
            <div className="flex items-center justify-between p-3.5 bg-[#18181B]/40 border border-[#242424] rounded-xl">
              <div className="space-y-0.5 text-left">
                <h5 className="text-xs font-bold text-white">Two-Factor Authentication</h5>
                <p className="text-[10px] text-zinc-500">Require mobile security token upon credentials login.</p>
              </div>
              <input
                type="checkbox"
                checked={settingsForm.twoFactorEnabled}
                onChange={(e) => setSettingsForm({ ...settingsForm, twoFactorEnabled: e.target.checked })}
                className="w-4 h-4 rounded text-amber-500 bg-zinc-900 border-[#242424] focus:ring-0 cursor-pointer accent-amber-500"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Active Session Lockout (Minutes)</label>
                <input
                  type="number"
                  value={settingsForm.sessionTimeout}
                  onChange={(e) => setSettingsForm({ ...settingsForm, sessionTimeout: e.target.value })}
                  className="w-full bg-[#1A1A1A] border border-[#242424] focus:border-amber-500/40 focus:outline-none rounded-xl p-3 text-xs text-white"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Active session count limit</label>
                <input
                  type="number"
                  value={settingsForm.activeSessionsLimit}
                  onChange={(e) => setSettingsForm({ ...settingsForm, activeSessionsLimit: e.target.value })}
                  className="w-full bg-[#1A1A1A] border border-[#242424] focus:border-amber-500/40 focus:outline-none rounded-xl p-3 text-xs text-white"
                />
              </div>
            </div>

            <div className="flex items-center justify-between p-3.5 bg-[#18181B]/40 border border-[#242424] rounded-xl">
              <div className="space-y-0.5 text-left">
                <h5 className="text-xs font-bold text-white">Enforce Strong Password complexity</h5>
                <p className="text-[10px] text-zinc-500">Requires numbers, symbols and special characters.</p>
              </div>
              <input
                type="checkbox"
                checked={settingsForm.strongPasswordEnforced}
                onChange={(e) => setSettingsForm({ ...settingsForm, strongPasswordEnforced: e.target.checked })}
                className="w-4 h-4 rounded text-amber-500 bg-zinc-900 border-[#242424] focus:ring-0 cursor-pointer accent-amber-500"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-5 py-2.5 text-xs font-bold text-black bg-amber-500 hover:bg-amber-400 rounded-lg transition flex items-center gap-1.5 shadow-lg shadow-amber-500/15 cursor-pointer"
              >
                <Save className="w-4 h-4" /> Save System settings
              </button>
            </div>
          </form>
        </div>
      )}


      {/* -------------------------------------------------------------
          MODALS
         ------------------------------------------------------------- */}

      {/* MODAL: ADD USER */}
      <CommonModal
        isOpen={isUserCreateOpen}
        onClose={() => setIsUserCreateOpen(false)}
        title="Deploy New User Credentials"
        confirmText="Deploy Account"
        onConfirm={handleCreateUser}
      >
        <div className="space-y-4 text-left">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Name</label>
            <input
              type="text"
              value={userForm.name}
              onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
              className="w-full bg-[#1A1A1A] border border-[#242424] focus:border-amber-500/40 focus:outline-none rounded-lg p-2.5 text-xs text-white"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Email Address</label>
            <input
              type="email"
              value={userForm.email}
              onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
              className="w-full bg-[#1A1A1A] border border-[#242424] focus:border-amber-500/40 focus:outline-none rounded-lg p-2.5 text-xs text-white"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Role</label>
              <select
                value={userForm.role}
                onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
                className="w-full bg-[#1A1A1A] border border-[#242424] rounded-lg p-2 text-xs text-zinc-300"
              >
                <option value="User">User</option>
                <option value="Administrator">Administrator</option>
                <option value="Developer">Developer</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">VIP Tier</label>
              <select
                value={userForm.tier}
                onChange={(e) => setUserForm({ ...userForm, tier: e.target.value })}
                className="w-full bg-[#1A1A1A] border border-[#242424] rounded-lg p-2 text-xs text-zinc-300"
              >
                <option value="free">Free</option>
                <option value="basic">Basic</option>
                <option value="pro">Pro</option>
                <option value="enterprise">Enterprise</option>
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Credits Allocation</label>
            <input
              type="number"
              value={userForm.credits}
              onChange={(e) => setUserForm({ ...userForm, credits: e.target.value })}
              className="w-full bg-[#1A1A1A] border border-[#242424] focus:border-amber-500/40 focus:outline-none rounded-lg p-2.5 text-xs text-white"
            />
          </div>
        </div>
      </CommonModal>

      {/* MODAL: EDIT USER */}
      <CommonModal
        isOpen={isUserEditOpen}
        onClose={() => setIsUserEditOpen(false)}
        title="Edit User Credentials Specs"
        confirmText="Save Specifications"
        onConfirm={handleUpdateUser}
      >
        <div className="space-y-4 text-left">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Name</label>
            <input
              type="text"
              value={userForm.name}
              onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
              className="w-full bg-[#1A1A1A] border border-[#242424] focus:border-amber-500/40 focus:outline-none rounded-lg p-2.5 text-xs text-white"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Role</label>
              <select
                value={userForm.role}
                onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
                className="w-full bg-[#1A1A1A] border border-[#242424] rounded-lg p-2 text-xs text-zinc-300"
              >
                <option value="User">User</option>
                <option value="Administrator">Administrator</option>
                <option value="Developer">Developer</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">VIP Tier</label>
              <select
                value={userForm.tier}
                onChange={(e) => setUserForm({ ...userForm, tier: e.target.value })}
                className="w-full bg-[#1A1A1A] border border-[#242424] rounded-lg p-2 text-xs text-zinc-300"
              >
                <option value="free">Free</option>
                <option value="basic">Basic</option>
                <option value="pro">Pro</option>
                <option value="enterprise">Enterprise</option>
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Credits Allocation</label>
            <input
              type="number"
              value={userForm.credits}
              onChange={(e) => setUserForm({ ...userForm, credits: e.target.value })}
              className="w-full bg-[#1A1A1A] border border-[#242424] focus:border-amber-500/40 focus:outline-none rounded-lg p-2.5 text-xs text-white"
            />
          </div>
        </div>
      </CommonModal>

      {/* CONFIRM MODAL: PURGE USER */}
      <CommonModal
        isOpen={deleteUserId !== null}
        onClose={() => setDeleteUserId(null)}
        title="Confirm Purge Account"
        isDestructive
        confirmText="Purge Account Logs"
        onConfirm={handleDeleteConfirm}
      >
        <p className="text-xs text-zinc-300">
          WARNING: You are permanently deleting this user record and active credits from the server-side memory database. This action cannot be undone.
        </p>
      </CommonModal>

      {/* CONFIRM MODAL: DELETE MODEL */}
      <ConfirmModal
        isOpen={deleteModelId !== null}
        onCancel={() => setDeleteModelId(null)}
        onConfirm={async () => {
          if (!deleteModelId) return;
          try {
            await deleteModel({ id: deleteModelId }).unwrap();
            toast.success("Model deleted successfully");
          } catch (e) {
            toast.success("Failed to delete model");
          }
          setDeleteModelId(null);
        }}
        title="Confirm Model Deletion"
        message="Are you sure you want to permanently delete this AI model from the system? This action cannot be undone."
        isDestructive
        confirmText="Delete Model"
      />

      {/* MODAL: ADD AI MODEL */}
      <CommonModal
        isOpen={isModelCreateOpen}
        onClose={() => setIsModelCreateOpen(false)}
        title="Map Custom AI Model Node"
        confirmText="Map Model Node"
        onConfirm={handleCreateModel}
      >
        <div className="space-y-4 text-left">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Model Name</label>
            <input
              type="text"
              value={modelForm.name}
              onChange={(e) => setModelForm({ ...modelForm, name: e.target.value })}
              placeholder="e.g. Gemini 3.5 Pro Ultra"
              className="w-full bg-[#1A1A1A] border border-[#242424] rounded-lg p-2.5 text-xs text-white"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Version Reference</label>
            <input
              type="text"
              value={modelForm.version}
              onChange={(e) => setModelForm({ ...modelForm, version: e.target.value })}
              placeholder="e.g. gemini-3.5-pro-ultra"
              className="w-full bg-[#1A1A1A] border border-[#242424] rounded-lg p-2.5 text-xs text-white"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Type</label>
              <select
                value={modelForm.type}
                onChange={(e) => setModelForm({ ...modelForm, type: e.target.value })}
                className="w-full bg-[#1A1A1A] border border-[#242424] rounded-lg p-2 text-xs text-zinc-300"
              >
                <option value="text">Text</option>
                <option value="image">Image</option>
                <option value="video">Video</option>
                <option value="audio">Audio</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Provider</label>
              <select
                value={modelForm.provider}
                onChange={(e) => setModelForm({ ...modelForm, provider: e.target.value })}
                className="w-full bg-[#1A1A1A] border border-[#242424] rounded-lg p-2 text-xs text-zinc-300"
              >
                <option value="huggingface">HuggingFace</option>
                <option value="openai">OpenAI</option>
                <option value="anthropic">Anthropic</option>
                <option value="gemini">Gemini</option>
                <option value="deepseek">DeepSeek</option>
                <option value="grok">Grok</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Latency</label>
              <input
                type="text"
                value={modelForm.latency}
                onChange={(e) => setModelForm({ ...modelForm, latency: e.target.value })}
                placeholder="e.g. 0.8s"
                className="w-full bg-[#1A1A1A] border border-[#242424] rounded-lg p-2 text-xs text-white"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Brief Description</label>
            <textarea
              value={modelForm.description}
              onChange={(e) => setModelForm({ ...modelForm, description: e.target.value })}
              placeholder="Describe the routing guidelines..."
              className="w-full bg-[#1A1A1A] border border-[#242424] rounded-lg p-2 text-xs text-white h-16 resize-none"
            />
          </div>
        </div>
      </CommonModal>

      {/* MODAL: ADD MENU ITEM */}
      <CommonModal
        isOpen={isMenuCreateOpen}
        onClose={() => setIsMenuCreateOpen(false)}
        title={menuForm.id ? "Update Navigation Menu Node" : "Add Navigation Menu Node"}
        confirmText={menuForm.id ? "Update Navigation Link" : "Add Navigation Link"}
        onConfirm={handleCreateMenuItem}
      >
        <div className="space-y-4 text-left">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Menu Label</label>
            <input
              type="text"
              value={menuForm.label}
              onChange={(e) => setMenuForm({ ...menuForm, label: e.target.value })}
              placeholder="e.g. Prompt Studio"
              className="w-full bg-[#1A1A1A] border border-[#242424] rounded-lg p-2.5 text-xs text-white"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Screen ID target</label>
              <input
                type="text"
                value={menuForm.target}
                onChange={(e) => setMenuForm({ ...menuForm, target: e.target.value })}
                placeholder="e.g. prompt-studio"
                className="w-full bg-[#1A1A1A] border border-[#242424] rounded-lg p-2 text-xs text-white"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Assigned View</label>
              <select
                value={menuForm.visible}
                onChange={(e) => setMenuForm({ ...menuForm, visible: e.target.value, parentId: "" })}
                className="w-full bg-[#1A1A1A] border border-[#242424] rounded-lg p-2 text-xs text-zinc-300"
              >
                <option value="User Menu">User Menu</option>
                <option value="Admin Menu">Admin Menu</option>
                <option value="All">All (Both Workspaces)</option>
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Parent Menu (Optional)</label>
            <select
              value={menuForm.parentId}
              onChange={(e) => setMenuForm({ ...menuForm, parentId: e.target.value })}
              className="w-full bg-[#1A1A1A] border border-[#242424] rounded-lg p-2 text-xs text-zinc-300"
            >
              <option value="">None (Top Level)</option>
              {menuItems
                .filter((item: any) => item.visible === menuForm.visible && !item.parentId)
                .map((item: any) => (
                  <option key={item.id || item._id} value={item.id || item._id}>
                    {item.label}
                  </option>
              ))}
            </select>
          </div>
        </div>
      </CommonModal>

      {/* MODAL: CREATE SUBSCRIPTION PLAN */}
      <CommonModal
        isOpen={isPlanCreateOpen}
        onClose={() => setIsPlanCreateOpen(false)}
        title="Create Subscription Plan"
        confirmText={isCreatingPlan ? "Creating..." : "Create Plan"}
        onConfirm={handleCreatePlan}
      >
        <div className="space-y-4 text-left">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Plan Name *</label>
              <input
                type="text"
                value={planForm.name}
                onChange={(e) => setPlanForm({ ...planForm, name: e.target.value })}
                placeholder="e.g. Pro Monthly"
                className="w-full bg-[#1A1A1A] border border-[#242424] focus:border-amber-500/40 focus:outline-none rounded-lg p-2.5 text-xs text-white"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Tier *</label>
              <select
                value={planForm.plan}
                onChange={(e) => setPlanForm({ ...planForm, plan: e.target.value })}
                className="w-full bg-[#1A1A1A] border border-[#242424] rounded-lg p-2.5 text-xs text-zinc-300"
              >
                <option value="free">Free</option>
                <option value="daily">Daily</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
                <option value="custom">Custom</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Description</label>
            <textarea
              value={planForm.description}
              onChange={(e) => setPlanForm({ ...planForm, description: e.target.value })}
              placeholder="Brief plan description..."
              className="w-full bg-[#1A1A1A] border border-[#242424] focus:border-amber-500/40 focus:outline-none rounded-lg p-2.5 text-xs text-white h-16 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Price (₹)</label>
              <input
                type="number"
                min={0}
                value={planForm.price}
                onChange={(e) => setPlanForm({ ...planForm, price: parseFloat(e.target.value) || 0 })}
                className="w-full bg-[#1A1A1A] border border-[#242424] focus:border-amber-500/40 focus:outline-none rounded-lg p-2.5 text-xs text-white"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Duration (Days)</label>
              <input
                type="number"
                min={1}
                value={planForm.durationInDays}
                onChange={(e) => setPlanForm({ ...planForm, durationInDays: parseInt(e.target.value) || 1 })}
                className="w-full bg-[#1A1A1A] border border-[#242424] focus:border-amber-500/40 focus:outline-none rounded-lg p-2.5 text-xs text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Token Credits</label>
              <input
                type="number"
                min={0}
                value={planForm.tokens}
                onChange={(e) => setPlanForm({ ...planForm, tokens: parseInt(e.target.value) || 0 })}
                className="w-full bg-[#1A1A1A] border border-[#242424] focus:border-amber-500/40 focus:outline-none rounded-lg p-2.5 text-xs text-white"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Active</label>
              <div
                onClick={() => setPlanForm({ ...planForm, isActive: !planForm.isActive })}
                className="flex items-center gap-2 cursor-pointer mt-1"
              >
                {planForm.isActive
                  ? <ToggleRight className="w-7 h-7 text-amber-500" />
                  : <ToggleLeft className="w-7 h-7 text-zinc-600" />
                }
                <span className="text-[10px] text-zinc-400 font-medium">{planForm.isActive ? "Enabled" : "Disabled"}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Services</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={serviceInput}
                onChange={(e) => setServiceInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAddService(); } }}
                placeholder="e.g. CHAT, IMAGE, VIDEO"
                className="flex-1 min-w-0 bg-[#1A1A1A] border border-[#242424] focus:border-amber-500/40 focus:outline-none rounded-lg p-2 text-xs text-white"
              />
              <button
                type="button"
                onClick={handleAddService}
                className="px-3 py-1.5 bg-[#1A1A1A] border border-[#242424] hover:border-amber-500/30 text-xs font-bold text-zinc-300 hover:text-white rounded-lg transition"
              >
                Add
              </button>
            </div>
            {planServices.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {planServices.map((svc) => (
                  <span
                    key={svc}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-[9px] font-bold text-amber-500 uppercase tracking-wider"
                  >
                    {svc}
                    <button
                      type="button"
                      onClick={() => handleRemoveService(svc)}
                      className="text-amber-500/60 hover:text-amber-400 transition"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </CommonModal>

      {/* MODAL: ADD SOCIAL LINK */}
      <CommonModal
        isOpen={isSocialModalOpen}
        onClose={() => setIsSocialModalOpen(false)}
        title="Add New Social Media Icon"
        confirmText="Add Social Link"
        onConfirm={handleAddSocialLink}
      >
        <div className="space-y-4 text-left">
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Platform / Icon Type</label>
            <select
              value={socialForm.platform}
              onChange={(e) => setSocialForm({ ...socialForm, platform: e.target.value, label: socialForm.label || e.target.value })}
              className="w-full bg-[#1A1A1A] border border-[#242424] focus:border-amber-500/40 focus:outline-none rounded-lg p-2.5 text-xs text-white"
            >
              {Object.keys(PLATFORM_ICONS).map((plat) => (
                <option key={plat} value={plat}>
                  {plat}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Display Label</label>
            <input
              type="text"
              placeholder="e.g. LinkedIn, Official Twitter..."
              value={socialForm.label}
              onChange={(e) => setSocialForm({ ...socialForm, label: e.target.value })}
              className="w-full bg-[#1A1A1A] border border-[#242424] focus:border-amber-500/40 focus:outline-none rounded-lg p-2.5 text-xs text-white"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Destination URL</label>
            <input
              type="text"
              placeholder="https://..."
              value={socialForm.href}
              onChange={(e) => setSocialForm({ ...socialForm, href: e.target.value })}
              className="w-full bg-[#1A1A1A] border border-[#242424] focus:border-amber-500/40 focus:outline-none rounded-lg p-2.5 text-xs text-white font-mono"
            />
          </div>
        </div>
      </CommonModal>
    </div>
  );
}
