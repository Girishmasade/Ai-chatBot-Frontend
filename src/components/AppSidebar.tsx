import React, { useState } from "react";
import {
  LayoutDashboard,
  MessageSquareText,
  Image as ImageIcon,
  Tv as VideoIcon,
  BriefcaseBusiness,
  CreditCard,
  User as UserIcon,
  ShieldAlert,
  Globe,
  LogOut,
  ChevronRight,
  Sliders,
  Cpu,
  FolderHeart,
  Users,
  FileText,
  Palette,
  Fingerprint,
  History,
  Settings
} from "lucide-react";
import { ActiveScreen, User } from "../types";

import { useGetUserMenuItemsQuery, useGetAdminMenuItemsQuery } from "../redux/api/menuApi";
import { useGetConfigQuery } from "../redux/api/apiSlice";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard,
  MessageSquareText,
  ImageIcon,
  Tv: VideoIcon,
  VideoIcon,
  Sliders,
  Cpu,
  FolderHeart,
  BriefcaseBusiness,
  CreditCard,
  Settings,
  User: UserIcon,
  UserIcon,
};

interface AppSidebarProps {
  activeScreen: ActiveScreen;
  setActiveScreen: (screen: ActiveScreen) => void;
  currentUser: User;
  onLogout: () => void;
  adminActiveTab: string;
  setAdminActiveTab: (tab: any) => void;
  isAdminWorkspace: boolean;
  setIsAdminWorkspace: (val: boolean) => void;
}

export default function AppSidebar({
  activeScreen,
  setActiveScreen,
  currentUser,
  onLogout,
  adminActiveTab,
  setAdminActiveTab,
  isAdminWorkspace,
  setIsAdminWorkspace,
}: AppSidebarProps) {
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({});

  const toggleMenu = (menuId: string) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [menuId]: !prev[menuId],
    }));
  };
  // Fetch dynamic user menu items from backend API
  const { data: menuResponse } = useGetUserMenuItemsQuery();
  const dynamicUserItems = menuResponse?.data?.data;

  // Scrolls the window (and any scrollable main-content container, if present)
  // back to the top whenever navigation happens. Without this, switching tabs
  // keeps whatever scroll position the previous screen was left at.
  const scrollContentToTop = () => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });

    const possibleContainers = [
      document.getElementById("main-content"),
      document.getElementById("app-main-content"),
      document.getElementById("main-scroll-area"),
      document.querySelector("main")
    ];

    possibleContainers.forEach((el) => {
      if (el) {
        el.scrollTo({ top: 0, left: 0, behavior: "auto" });
      }
    });
  };

  const navigateTo = (screen: ActiveScreen) => {
    setActiveScreen(screen);
    scrollContentToTop();
  };

  const navigateToAdminTab = (tabId: string) => {
    setActiveScreen("admin");
    setAdminActiveTab(tabId);
    scrollContentToTop();
  };

  // Default Fallback Navigation Items
  const defaultUserNavItems = [
    { id: "dashboard", label: "Overview", icon: LayoutDashboard },
    { id: "chat", label: "Conversational Chat", icon: MessageSquareText },
    { id: "image", label: "Image Studio", icon: ImageIcon },
    { id: "video", label: "Motion Studio", icon: VideoIcon },
    { id: "prompt-studio", label: "Prompt Engineer", icon: Sliders },
    { id: "models-list", label: "AI Models", icon: Cpu },
    { id: "assets-library", label: "My Assets", icon: FolderHeart },
    { id: "business-plan", label: "Business Plan AI", icon: BriefcaseBusiness },
    { id: "subscription", label: "VIP Membership", icon: CreditCard },
    { id: "settings", label: "Settings", icon: Settings },
    { id: "profile", label: "My Profile", icon: UserIcon }
  ];

  // Map dynamic menu items from API or fallback to default
  const userNavItems = dynamicUserItems !== undefined
    ? dynamicUserItems.map((item) => ({
        _id: item.id,
        id: item.target as ActiveScreen,
        label: item.label,
        icon: iconMap[item.icon] || LayoutDashboard,
        parentId: item.parentId,
      }))
    : defaultUserNavItems;

  const userRoots = userNavItems.filter((item: any) => !item.parentId);
  const userChildren = userNavItems.filter((item: any) => item.parentId);

  const { data: adminMenuResponse } = useGetAdminMenuItemsQuery(undefined, { skip: !isAdminWorkspace });
  // Map dynamic admin menu items from API or fallback to default
  const defaultAdminNavItems = [
    { id: "overview", label: "Dashboard Overview", icon: LayoutDashboard },
    { id: "users", label: "User Pool", icon: Users },
    { id: "billing", label: "VIP Subscriptions", icon: CreditCard },
    { id: "models", label: "AI Model Manager", icon: Cpu },
    { id: "menu", label: "Menu Control", icon: Sliders },
    { id: "footer", label: "Footer CMS", icon: FileText },
    { id: "branding", label: "Branding CMS", icon: Palette },
    { id: "cookies", label: "Cookie Ledger", icon: Fingerprint },
    { id: "audits", label: "Audit Records", icon: History },
    { id: "settings", label: "System Settings", icon: Settings }
  ];

  const adminMenuData = adminMenuResponse?.data?.data?.filter(
    (item: any) => item.visible === "Admin Menu" || item.visible === "All" || item.visible === "Both"
  );

  const adminNavItems = adminMenuData && adminMenuData.length > 0
    ? adminMenuData.map((item: any) => ({
        _id: item.id,
        id: item.target,
        label: item.label,
        icon: iconMap[item.icon] || LayoutDashboard,
        parentId: item.parentId,
      }))
    : defaultAdminNavItems;

  const adminRoots = adminNavItems.filter((item: any) => !item.parentId);
  const adminChildren = adminNavItems.filter((item: any) => item.parentId);

  const isAdminRole = currentUser.role === "Administrator" || currentUser.role === "admin";
  const isEmployee = isAdminRole || currentUser.role === "Developer";

  const { data: configData } = useGetConfigQuery();
  const branding = configData?.branding || (configData as any)?.data?.branding;

  return (
    <aside className="w-64 bg-[#111111] border-r border-[#242424] flex flex-col h-screen  shrink-0 z-20">
      {/* Brand Header */}
      <div className="p-4 border-b border-[#1F1F1F]">
        <div
          onClick={() => {
            setIsAdminWorkspace(false);
            navigateTo("landing");
          }}
          className="cursor-pointer group flex flex-col gap-2"
        >
          {branding?.mainLogo || branding?.logoImage ? (
            <div className="flex items-center justify-between gap-2">
              <img
                src={branding.mainLogo || branding.logoImage}
                alt="Platform Logo"
                className="h-8 max-w-[140px] object-contain object-left"
              />
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#1A1A1A] border border-[#262626] group-hover:border-amber-500/30 transition-colors">
                <span className={`w-1.5 h-1.5 rounded-full ${isAdminWorkspace ? "bg-rose-500 shadow-[0_0_6px_rgba(244,63,94,0.8)]" : "bg-amber-500 shadow-[0_0_6px_rgba(245,158,11,0.8)]"}`} />
                <span className="text-[8.5px] uppercase tracking-widest text-zinc-400 font-bold whitespace-nowrap">
                  {isAdminWorkspace ? "Admin Control" : "Platform Elite"}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="relative shrink-0">
                <div className="absolute inset-0 rounded-xl bg-amber-500/40 blur-lg opacity-0 group-hover:opacity-70 transition-opacity duration-300" />
                <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-amber-300 via-amber-500 to-amber-600 flex items-center justify-center shadow-[0_4px_20px_-2px_rgba(245,158,11,0.45)] ring-1 ring-amber-300/40 group-hover:scale-[1.06] group-hover:-rotate-1 transition-all duration-300">
                  <span className="text-black font-black text-xs tracking-tighter">GC</span>
                </div>
              </div>
              <div className="flex-1 min-w-0 text-left">
                <h1 className="text-sm font-bold tracking-tight leading-none truncate">
                  <span className="text-white">Go</span>
                  <span className="text-amber-500">Chat</span>
                  <span className="text-zinc-400 font-semibold"> AI</span>
                </h1>
                <div className="mt-1.5 inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#1A1A1A] border border-[#262626] group-hover:border-amber-500/30 transition-colors">
                  <span className={`w-1.5 h-1.5 rounded-full ${isAdminWorkspace ? "bg-rose-500 shadow-[0_0_6px_rgba(244,63,94,0.8)]" : "bg-amber-500 shadow-[0_0_6px_rgba(245,158,11,0.8)]"}`} />
                  <span className="text-[8.5px] uppercase tracking-widest text-zinc-400 font-bold whitespace-nowrap">
                    {isAdminWorkspace ? "Admin Control" : "Platform Elite"}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Core Navigation */}
      <nav className="flex-1 px-4 py-5 space-y-1 overflow-y-auto custom-scrollbar">
        <p className="text-[9px] uppercase tracking-widest text-[#52525B] font-bold px-3 mb-2.5 text-left">
          {isAdminWorkspace ? "Admin Control Room" : "Intelligence Workspace"}
        </p>

        {!isAdminWorkspace ? (
          // USER WORKSPACE NAVIGATION (DYNAMIC FROM BACKEND WITH NESTING)
          userRoots.map((item: any) => {
            const Icon = item.icon;
            const itemChildren = userChildren.filter((child: any) => child.parentId === item._id);
            const hasChildren = itemChildren.length > 0;
            const isExpanded = expandedMenus[item._id];
            const isActive = activeScreen === item.id;
            const isChildActive = hasChildren && itemChildren.some((child: any) => activeScreen === child.id);

            return (
              <div key={item._id || item.id} className="space-y-1">
                <button
                  id={`sidebar-item-${item.id}`}
                  onClick={() => {
                    if (hasChildren) {
                      toggleMenu(item._id);
                    } else {
                      navigateTo(item.id);
                    }
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition duration-200 group relative ${
                    isActive || isChildActive
                      ? "bg-amber-500/5 text-amber-500 border border-amber-500/10 shadow-[inset_0_1px_0_0_rgba(245,158,11,0.05)]"
                      : "text-zinc-400 hover:text-white hover:bg-zinc-900/50 border border-transparent"
                  }`}
                >
                  {(isActive || isChildActive) && (
                    <div className="absolute left-0 top-2 bottom-2 w-1 rounded-r-md bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.7)]" />
                  )}
                  <Icon className={`w-4 h-4 shrink-0 transition-transform ${isActive || isChildActive ? "text-amber-500" : "text-zinc-500 group-hover:text-zinc-300 group-hover:scale-105"}`} />
                  <span className="truncate">{item.label}</span>
                  {hasChildren ? (
                    <ChevronRight className={`w-3.5 h-3.5 ml-auto text-zinc-600 transition-transform ${isExpanded ? "rotate-90" : ""} group-hover:opacity-100`} />
                  ) : (
                    <ChevronRight className={`w-3.5 h-3.5 ml-auto text-zinc-600 transition-opacity ${isActive ? "opacity-100 text-amber-500/60" : "opacity-0 group-hover:opacity-100"}`} />
                  )}
                </button>
                
                {/* Render Children */}
                {hasChildren && isExpanded && (
                  <div className="pl-4 space-y-1 overflow-hidden transition-all duration-300">
                    <div className="border-l border-[#2A2A2A] pl-2 space-y-1">
                      {itemChildren.map((child: any) => {
                        const ChildIcon = child.icon;
                        const isChildCurrent = activeScreen === child.id;
                        return (
                          <button
                            key={child._id || child.id}
                            onClick={() => navigateTo(child.id)}
                            className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs font-medium transition duration-200 group ${
                              isChildCurrent
                                ? "text-amber-500 bg-amber-500/10"
                                : "text-zinc-400 hover:text-white hover:bg-zinc-900/50"
                            }`}
                          >
                            <ChildIcon className={`w-3.5 h-3.5 shrink-0 transition-transform ${isChildCurrent ? "text-amber-500" : "text-zinc-500 group-hover:scale-105"}`} />
                            <span className="truncate">{child.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          // ADMIN WORKSPACE NAVIGATION (DYNAMIC FROM BACKEND WITH NESTING)
          adminRoots.map((item: any) => {
            const Icon = item.icon;
            const itemChildren = adminChildren.filter((child: any) => child.parentId === item._id);
            const hasChildren = itemChildren.length > 0;
            const isExpanded = expandedMenus[item._id];
            const isActive = activeScreen === "admin" && adminActiveTab === item.id;
            const isChildActive = hasChildren && itemChildren.some((child: any) => activeScreen === "admin" && adminActiveTab === child.id);

            return (
              <div key={item._id || item.id} className="space-y-1">
                <button
                  id={`sidebar-admin-item-${item.id}`}
                  onClick={() => {
                    if (hasChildren) {
                      toggleMenu(item._id);
                    } else {
                      navigateToAdminTab(item.id);
                    }
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium transition duration-200 group relative ${
                    isActive || isChildActive
                      ? "bg-amber-500/5 text-amber-500 border border-amber-500/10"
                      : "text-rose-400/90 hover:text-rose-300 hover:bg-rose-950/10 border border-transparent"
                  }`}
                >
                  {(isActive || isChildActive) && (
                    <div className="absolute left-0 top-2 bottom-2 w-1 rounded-r-md bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.7)]" />
                  )}
                  <Icon className={`w-4 h-4 shrink-0 transition-transform ${isActive || isChildActive ? "text-amber-500" : "text-rose-500/80 group-hover:text-rose-400 group-hover:scale-105"}`} />
                  <span className="truncate">{item.label}</span>
                  {hasChildren ? (
                    <ChevronRight className={`w-3.5 h-3.5 ml-auto text-zinc-600 transition-transform ${isExpanded ? "rotate-90" : ""} group-hover:opacity-100`} />
                  ) : (
                    <ChevronRight className={`w-3.5 h-3.5 ml-auto text-zinc-600 transition-opacity ${isActive ? "opacity-100 text-amber-500/60" : "opacity-0 group-hover:opacity-100"}`} />
                  )}
                </button>
                
                {/* Render Children */}
                {hasChildren && isExpanded && (
                  <div className="pl-4 space-y-1 overflow-hidden transition-all duration-300">
                    <div className="border-l border-[#2A2A2A] pl-2 space-y-1">
                      {itemChildren.map((child: any) => {
                        const ChildIcon = child.icon;
                        const isChildCurrent = activeScreen === "admin" && adminActiveTab === child.id;
                        return (
                          <button
                            id={`sidebar-admin-item-${child.id}`}
                            key={child._id || child.id}
                            onClick={() => navigateToAdminTab(child.id)}
                            className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-[11px] font-medium transition group ${
                              isChildCurrent
                                ? "bg-amber-500/10 text-amber-500 font-bold"
                                : "text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/50"
                            }`}
                          >
                            <ChildIcon className={`w-3.5 h-3.5 shrink-0 ${isChildCurrent ? "text-amber-500" : "text-zinc-600 group-hover:text-zinc-400"}`} />
                            <span className="truncate">{child.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </nav>

      {/* Footer Profile Hub */}
      <div className="p-4 border-t border-[#1F1F1F] bg-[#0C0C0C]">
        {/* Workspace Mode Switcher (only for Admins/Developers) */}
        {isEmployee && (
          <div className="mb-3.5">
            {isAdminWorkspace ? (
              <button
                id="sidebar-btn-user-workspace"
                onClick={() => {
                  setIsAdminWorkspace(false);
                  navigateTo("dashboard");
                }}
                className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-black text-[10px] font-bold uppercase tracking-wider rounded-xl transition flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/15 cursor-pointer"
              >
                <Globe className="w-3.5 h-3.5" />
                User Side Workspace
              </button>
            ) : (
              <button
                id="sidebar-btn-admin-room"
                onClick={() => {
                  setIsAdminWorkspace(true);
                  navigateToAdminTab("overview");
                }}
                className="w-full py-2 bg-rose-950/20 hover:bg-rose-900/30 border border-rose-500/20 text-rose-400 text-[10px] font-bold uppercase tracking-wider rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                Admin Control Room
              </button>
            )}
          </div>
        )}

        <div className="flex items-center gap-3 px-2 py-1.5 rounded-xl">
          <div className="relative">
            <div className="w-8.5 h-8.5 rounded-lg bg-[#1D1D1D] border border-amber-500/20 flex items-center justify-center overflow-hidden">
              <span className="text-xs font-bold text-amber-500 uppercase">
                {currentUser.name[0]}
              </span>
            </div>
            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#0C0C0C]" />
          </div>
          <div className="flex-1 min-w-0 text-left">
            <h4 className="text-xs font-semibold text-white truncate">{currentUser.name}</h4>
            <p className="text-[9px] text-[#71717A] truncate uppercase font-semibold tracking-wider">
              {currentUser.tier} tier
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-3 pt-2 border-t border-[#1F1F1F]">
          <button
            id="sidebar-btn-landing"
            onClick={() => {
              setIsAdminWorkspace(false);
              navigateTo("landing");
            }}
            className="flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[10px] font-medium text-zinc-400 hover:text-white hover:bg-zinc-900 transition"
          >
            <Globe className="w-3 h-3" />
            Website
          </button>
          <button
            id="sidebar-btn-logout"
            onClick={onLogout}
            className="flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[10px] font-medium text-rose-500 hover:text-rose-400 hover:bg-rose-950/10 transition"
          >
            <LogOut className="w-3 h-3" />
            Exit
          </button>
        </div>
      </div>
    </aside>
  );
}