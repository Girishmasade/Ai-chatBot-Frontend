import React, { useEffect } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import {
  Zap,
  TrendingUp,
  Image as ImageIcon,
  Clock,
  Tv,
  Sparkles,
  Flag,
  Activity,
  FileText
} from "lucide-react";
import { ActiveScreen, User } from "../types";
import { useGetAssetsQuery } from "../redux/api/apiSlice";
import { useLazyGetWalletBalanceQuery } from "../redux/api/tokenApi";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import { formatCredits } from "../helpers/utils";

interface DashboardPageProps {
  currentUser: User;
  setActiveScreen: (screen: ActiveScreen) => void;
}

function timeAgo(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (seconds < 60) return `Just now`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days !== 1 ? 's' : ''} ago`;
}

export default function DashboardPage({
  currentUser,
  setActiveScreen
}: DashboardPageProps) {
  const { data: assets = [], isLoading: loading } = useGetAssetsQuery();

  // Fetch real wallet balance from backend
  const authUser = useSelector((state: RootState) => state.auth.currentUser);
  const [triggerWallet, { data: walletData }] = useLazyGetWalletBalanceQuery();

  useEffect(() => {
    if (authUser?.id) {
      triggerWallet(authUser.id);
    }
  }, [authUser?.id, triggerWallet]);

  const stats = React.useMemo(() => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay()); // Sunday as start

    let chatsMonth = 0, chatsWeek = 0;
    let imagesTotal = 0, imagesWeek = 0;
    let videosTotal = 0, videosWeek = 0;

    // Initialize chart data for Mon-Sun
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const chartMap: Record<string, { chats: number; images: number }> = {};
    days.forEach(d => chartMap[d] = { chats: 0, images: 0 });

    const sortedAssets = [...assets].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    sortedAssets.forEach(asset => {
      const assetDate = new Date(asset.timestamp);
      const isThisMonth = assetDate >= startOfMonth;
      const isThisWeek = assetDate >= startOfWeek;
      const dayName = days[assetDate.getDay()];

      if (asset.type === 'chat') {
        if (isThisMonth) chatsMonth++;
        if (isThisWeek) { chatsWeek++; chartMap[dayName].chats++; }
      } else if (asset.type === 'image') {
        imagesTotal++;
        if (isThisWeek) { imagesWeek++; chartMap[dayName].images++; }
      } else if (asset.type === 'video') {
        videosTotal++;
        if (isThisWeek) videosWeek++;
      }
    });

    const dynamicChartData = [
      { name: "Mon", ...chartMap["Mon"] },
      { name: "Tue", ...chartMap["Tue"] },
      { name: "Wed", ...chartMap["Wed"] },
      { name: "Thu", ...chartMap["Thu"] },
      { name: "Fri", ...chartMap["Fri"] },
      { name: "Sat", ...chartMap["Sat"] },
      { name: "Sun", ...chartMap["Sun"] }
    ];

    const dynamicRecentActivity = sortedAssets.slice(0, 4).map((asset, i) => {
      let icon = Flag;
      let color = "text-amber-500";
      let bg = "bg-amber-500/10";
      
      if (asset.type === "image") { icon = ImageIcon; color = "text-blue-500"; bg = "bg-blue-500/10"; }
      else if (asset.type === "video") { icon = Tv; color = "text-purple-500"; bg = "bg-purple-500/10"; }
      else if (asset.type === "plan") { icon = FileText; color = "text-emerald-500"; bg = "bg-emerald-500/10"; }

      return {
        id: asset.id || i,
        action: asset.title || `Generated ${asset.type}`,
        type: asset.type.charAt(0).toUpperCase() + asset.type.slice(1),
        time: timeAgo(asset.timestamp),
        icon, color, bg
      };
    });

    return {
      chatsMonth, chatsWeek,
      imagesTotal, imagesWeek,
      videosTotal, videosWeek,
      dynamicChartData,
      dynamicRecentActivity
    };
  }, [assets]);

  const PLAN_MAX_CREDITS = {
    free: 100,
    basic: 1000,
    pro: 5000,
    enterprise: 100000
  };

  const walletBalance = walletData?.data?.wallet?.balance;
  const displayCredits = walletBalance ?? (currentUser.credits || 0);
  const totalCredits = PLAN_MAX_CREDITS[currentUser.tier] || 5000;
  const usedCredits = Math.max(0, totalCredits - displayCredits);
  const percentageUsed = Math.min(100, Math.round((usedCredits / totalCredits) * 100));
  const planName = currentUser.tier ? currentUser.tier.charAt(0).toUpperCase() + currentUser.tier.slice(1) + " Plan" : "Free Plan";

  return (
    <div className="space-y-6 p-1 text-left">
      
      {/* ROW 1: STATUS & BALANCE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Credit Balance (col-span-2) */}
        <div className="lg:col-span-2 bg-[#111111] border border-[#242424] rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Credit Balance</h3>
                <p className="text-[10px] text-zinc-500 uppercase tracking-wider">{planName}</p>
              </div>
            </div>
            <button 
              onClick={() => setActiveScreen("subscription")}
              className="text-xs font-bold text-amber-500 hover:text-amber-400 flex items-center gap-1.5 transition"
            >
              <TrendingUp className="w-3.5 h-3.5" /> Upgrade
            </button>
          </div>
          
          <div>
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-4xl font-extrabold text-white font-numbers tracking-tight">{formatCredits(usedCredits)}</span>
              <span className="text-xs font-semibold text-zinc-500">/ {formatCredits(totalCredits)} credits</span>
            </div>
            
            <div className="w-full bg-[#1F1F1F] rounded-full h-2 mb-2 relative overflow-hidden">
              <div 
                className="bg-amber-500 h-2 rounded-full" 
                style={{ width: `${percentageUsed}%` }}
              ></div>
            </div>
            
            <div className="flex justify-between items-center text-[10px] font-bold text-zinc-500">
              <span>{formatCredits(usedCredits)} used ({percentageUsed}%)</span>
              <span>{formatCredits(displayCredits)} remaining</span>
            </div>
          </div>
        </div>

        {/* Account Status (col-span-1) */}
        <div className="bg-[#111111] border border-[#242424] rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-4 h-4 text-amber-500" />
            <h3 className="text-sm font-bold text-white">Account Status</h3>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-bold text-emerald-500">Active</span>
          </div>

          <div className="flex-1 flex items-center justify-center relative my-6">
            {/* Animated Sphere / Globe placeholder */}
            <div className="w-24 h-24 rounded-full border border-amber-500/30 border-dashed animate-[spin_10s_linear_infinite] absolute"></div>
            <div className="w-20 h-20 rounded-full border border-amber-500/20 border-dotted animate-[spin_15s_linear_infinite_reverse] absolute"></div>
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-500/20 to-amber-600/5 shadow-[0_0_30px_rgba(245,158,11,0.2)]"></div>
          </div>

          <div className="flex justify-between items-center text-[10px] font-bold text-zinc-500 uppercase tracking-widest px-4 border-t border-[#1F1F1F] pt-4">
            <span>MODELS</span>
            <span>PLANS</span>
          </div>
        </div>
      </div>

      {/* ROW 2: 4 STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="bg-[#111111] border border-[#242424] p-5 rounded-2xl flex flex-col gap-3 relative overflow-hidden group">
          <div className="absolute top-4 right-4 text-zinc-800 group-hover:text-amber-500/20 transition">
            <Flag className="w-5 h-5" />
          </div>
          <h4 className="text-3xl font-extrabold text-white font-numbers">{stats.chatsMonth}</h4>
          <div>
            <p className="text-[10px] font-bold text-zinc-500">Chats This Month</p>
            <p className="text-[10px] font-bold text-emerald-500 mt-1">+{stats.chatsWeek} this week</p>
          </div>
        </div>

        <div className="bg-[#111111] border border-[#242424] p-5 rounded-2xl flex flex-col gap-3 relative overflow-hidden group">
          <div className="absolute top-4 right-4 text-zinc-800 group-hover:text-amber-500/20 transition">
            <ImageIcon className="w-5 h-5" />
          </div>
          <h4 className="text-3xl font-extrabold text-white font-numbers">{stats.imagesTotal}</h4>
          <div>
            <p className="text-[10px] font-bold text-zinc-500">Images Created</p>
            <p className="text-[10px] font-bold text-emerald-500 mt-1">+{stats.imagesWeek} this week</p>
          </div>
        </div>

        <div className="bg-[#111111] border border-[#242424] p-5 rounded-2xl flex flex-col gap-3 relative overflow-hidden group">
          <div className="absolute top-4 right-4 text-zinc-800 group-hover:text-amber-500/20 transition">
            <Tv className="w-5 h-5" />
          </div>
          <h4 className="text-3xl font-extrabold text-white font-numbers">{stats.videosTotal}</h4>
          <div>
            <p className="text-[10px] font-bold text-zinc-500">Videos Created</p>
            <p className="text-[10px] font-bold text-emerald-500 mt-1">+{stats.videosWeek} this week</p>
          </div>
        </div>

        <div className="bg-[#111111] border border-[#242424] p-5 rounded-2xl flex flex-col gap-3 relative overflow-hidden group">
          <div className="absolute top-4 right-4 text-zinc-800 group-hover:text-amber-500/20 transition">
            <Zap className="w-5 h-5" />
          </div>
          <h4 className="text-3xl font-extrabold text-white font-numbers">{formatCredits(usedCredits)}</h4>
          <div>
            <p className="text-[10px] font-bold text-zinc-500">Credits Used</p>
            <p className="text-[10px] font-bold text-emerald-500 mt-1">{percentageUsed}% of plan</p>
          </div>
        </div>

      </div>

      {/* ROW 3: CHARTS & ACTIVITY */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Usage Chart (col-span-2) */}
        <div className="lg:col-span-2 bg-[#111111] border border-[#242424] rounded-2xl p-6 flex flex-col">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-sm font-bold text-white">Usage This Week</h3>
              <p className="text-[10px] text-zinc-500">Chats and images generated</p>
            </div>
            <div className="flex items-center gap-4 text-[10px] font-bold">
              <div className="flex items-center gap-1.5 text-zinc-400">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span> Chats
              </div>
              <div className="flex items-center gap-1.5 text-zinc-400">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span> Images
              </div>
            </div>
          </div>
          
          <div className="flex-1 min-h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.dynamicChartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorChats" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorImages" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#71717A' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#71717A' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#161616', borderColor: '#242424', borderRadius: '8px', fontSize: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="chats" stroke="#F59E0B" strokeWidth={2} fillOpacity={1} fill="url(#colorChats)" />
                <Area type="monotone" dataKey="images" stroke="#3B82F6" strokeWidth={2} fillOpacity={1} fill="url(#colorImages)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity (col-span-1) */}
        <div className="bg-[#111111] border border-[#242424] rounded-2xl p-6 flex flex-col">
          <div className="flex items-center gap-2 mb-6">
            <Clock className="w-4 h-4 text-amber-500" />
            <h3 className="text-sm font-bold text-white">Recent Activity</h3>
          </div>
          
          <div className="flex-1 space-y-6">
            {stats.dynamicRecentActivity.length === 0 ? (
              <div className="flex items-center justify-center h-full text-zinc-500 text-xs">No recent activity</div>
            ) : stats.dynamicRecentActivity.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.id} className="flex gap-4">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${item.bg} ${item.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-white">{item.action}</p>
                    <p className="text-[10px] text-zinc-500 mt-1">{item.type} &middot; {item.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
