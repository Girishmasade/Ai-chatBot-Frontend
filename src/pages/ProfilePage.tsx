import React, { useState, useEffect } from "react";
import { User as UserIcon, Shield, Laptop, Bell, Key, Settings2, RefreshCw, Trash2 } from "lucide-react";
import { User } from "../types";
import {
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
  useDeleteUserProfileMutation,
} from "../redux/api/userApi";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";

interface ProfilePageProps {
  currentUser: User;
  onUpdateName: (newName: string) => void;
}

export default function ProfilePage({ currentUser, onUpdateName }: ProfilePageProps) {
  const authUser = useSelector((state: RootState) => state.auth.currentUser);
  const userId = authUser?.id || "";

  // Fetch real profile from backend
  const {
    data: profileData,
    isLoading: profileLoading,
    isError: profileError,
  } = useGetUserProfileQuery(userId, { skip: !userId });

  const [updateProfile, { isLoading: isUpdating }] = useUpdateUserProfileMutation();
  const [deleteProfile, { isLoading: isDeleting }] = useDeleteUserProfileMutation();

  // Derive the displayed user from backend data (if available) or fallback to prop
  const backendUser = profileData?.data?.user;
  const displayName = backendUser?.username || currentUser.name;
  const displayEmail = backendUser?.email || currentUser.email;
  const displayRole = backendUser?.role || currentUser.role;
  const displayAvatar = backendUser?.avatar;

  const [nameInput, setNameInput] = useState(displayName);
  const [successMsg, setSuccessMsg] = useState(false);

  // Sync name input when backend data loads
  useEffect(() => {
    if (backendUser?.username) {
      setNameInput(backendUser.username);
    }
  }, [backendUser?.username]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim() || nameInput.trim().length < 6) return;

    try {
      await updateProfile({ username: nameInput }).unwrap();
      onUpdateName(nameInput);
      setSuccessMsg(true);
      setTimeout(() => setSuccessMsg(false), 2000);
    } catch (err) {
      console.error("Failed to update profile:", err);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6  p-1 text-left">
      {/* Settings Form */}
      <div className="lg:col-span-2 bg-[#111111] border border-[#242424] rounded-2xl p-6 space-y-6">
        <div className="space-y-1 pb-4 border-b border-[#1F1F1F]">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">Profile Specifications</h4>
          <p className="text-[10px] text-zinc-500">Update account preferences and system markers</p>
        </div>

        {profileLoading && (
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            Loading profile data from server...
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Public Nickname</label>
              <input
                id="profile-name-input"
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="w-full bg-[#1A1A1A] border border-[#242424] focus:border-amber-500/40 focus:outline-none rounded-xl p-3 text-xs text-white transition"
                minLength={6}
              />
              <p className="text-[9px] text-zinc-600">Minimum 6 characters</p>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Email Identity</label>
              <input
                id="profile-email-input"
                type="email"
                disabled
                value={displayEmail}
                className="w-full bg-[#1A1A1A]/50 border border-[#242424] rounded-xl p-3 text-xs text-zinc-500 cursor-not-allowed"
              />
            </div>
          </div>

          {/* Avatar display */}
          {displayAvatar && (
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Current Avatar</label>
              <div className="w-16 h-16 rounded-xl overflow-hidden border border-[#242424]">
                <img src={displayAvatar} alt="Avatar" className="w-full h-full object-cover" />
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-3">
            {successMsg ? (
              <span className="text-[10px] text-emerald-500 font-bold uppercase">✓ Credentials updated successfully</span>
            ) : (
              <span className="text-[9px] text-zinc-500 font-mono">// Changes save to backend server</span>
            )}

            <button
              id="profile-btn-save"
              type="submit"
              disabled={isUpdating || nameInput.trim().length < 6}
              className="px-5 py-2.5 text-xs font-bold text-black bg-amber-500 hover:bg-amber-400 rounded-lg transition shadow-lg shadow-amber-500/15 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
            >
              {isUpdating ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Credentials"
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Account Info Cards */}
      <div className="space-y-6">
        {/* Core Metadata card */}
        <div className="bg-[#111111] border border-[#242424] rounded-2xl p-5 space-y-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 h-full w-[2px] bg-gradient-to-b from-amber-500/0 via-amber-500/30 to-amber-500/0" />
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">Access Specifications</h4>

          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-500">Account ID</span>
              <span className="font-mono text-[10px] text-zinc-300">USER-{(userId || currentUser.id).toUpperCase()}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-500">Inference Role</span>
              <span className="font-semibold text-zinc-300 capitalize">{displayRole}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-500">Verified Status</span>
              <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                backendUser?.isVerified
                  ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-500"
                  : "bg-amber-500/10 border border-amber-500/20 text-amber-500"
              }`}>
                {backendUser?.isVerified ? "Verified" : "Pending"}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-500">Active Membership</span>
              <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-[9px] font-bold text-amber-500 uppercase tracking-wider">{currentUser.tier}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-500">Member Since</span>
              <span className="text-zinc-300">{currentUser.joined}</span>
            </div>
          </div>
        </div>

        {/* Active Device Logs */}
        <div className="bg-[#111111] border border-[#242424] rounded-2xl p-5 space-y-4">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">Active Credentials sessions</h4>

          <div className="space-y-3 pt-2">
            <div className="flex items-start gap-3 p-2.5 bg-[#1A1A1A]/40 rounded-xl border border-[#242424]">
              <Laptop className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-zinc-200">Chrome Browser (AI Studio Sandbox)</p>
                <p className="text-[10px] text-zinc-500">Development App Link established • Active</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
