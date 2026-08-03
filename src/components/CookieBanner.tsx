import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Shield, Settings, Check, X } from "lucide-react";
import { useLogConsentMutation } from "../redux/api/apiSlice";

export default function CookieBanner() {
  const [logConsent] = useLogConsentMutation();
  const [isOpen, setIsOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [categories, setCategories] = useState({
    essential: true,
    analytics: true,
    marketing: false
  });

  useEffect(() => {
    const consent = localStorage.getItem("gochat_cookie_consent");
    if (!consent) {
      // Open banner after brief delay
      const timer = setTimeout(() => setIsOpen(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = async () => {
    const selections = ["essential", "analytics", "marketing"];
    localStorage.setItem("gochat_cookie_consent", JSON.stringify(selections));
    
    // Save to server database
    try {
      await logConsent({ user: "devcoderm13@gmail.com", categories: selections }).unwrap();
    } catch (e) {
      console.error(e);
    }
    
    setIsOpen(false);
  };

  const handleSavePreferences = async () => {
    const selections = Object.entries(categories)
      .filter(([_, enabled]) => enabled)
      .map(([name]) => name);

    localStorage.setItem("gochat_cookie_consent", JSON.stringify(selections));

    try {
      await logConsent({ user: "devcoderm13@gmail.com", categories: selections }).unwrap();
    } catch (e) {
      console.error(e);
    }

    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          id="cookie-consent-banner"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="fixed bottom-6 right-6 left-6 md:left-auto md:w-[460px] bg-[#111111]/90 border border-[#242424] rounded-2xl p-5 shadow-2xl backdrop-blur-xl z-50 overflow-hidden"
        >
          {/* Subtle amber accent top-border line */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-amber-500/0 via-amber-500/60 to-amber-500/0" />

          <div className="flex items-start gap-4">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-white">Cookie Consent Preference</h3>
              <p className="text-xs text-[#71717A] mt-1 leading-relaxed">
                We use cookies to secure accounts, optimize AI inference, and elevate luxury interface transitions.
              </p>
            </div>
          </div>

          {!showSettings ? (
            <div className="flex items-center justify-end gap-3 mt-5">
              <button
                id="cookie-btn-settings"
                onClick={() => setShowSettings(true)}
                className="px-3.5 py-1.5 text-xs font-medium text-zinc-400 hover:text-white bg-[#1A1A1A] border border-[#242424] rounded-lg transition"
              >
                Customize
              </button>
              <button
                id="cookie-btn-accept"
                onClick={handleAcceptAll}
                className="px-4 py-1.5 text-xs font-semibold text-black bg-amber-500 hover:bg-amber-400 rounded-lg shadow-lg shadow-amber-500/15 transition duration-200"
              >
                Accept All
              </button>
            </div>
          ) : (
            <div className="mt-4 pt-4 border-t border-[#1D1D1D] space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-zinc-300">Essential (Security & State)</span>
                  <span className="text-[10px] uppercase tracking-wider text-amber-500/80 font-semibold">Required</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-zinc-300">Analytics (Inference Rates)</span>
                  <input
                    id="cookie-toggle-analytics"
                    type="checkbox"
                    checked={categories.analytics}
                    onChange={(e) => setCategories({ ...categories, analytics: e.target.checked })}
                    className="accent-amber-500 rounded border-[#242424] bg-zinc-900 cursor-pointer"
                  />
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-zinc-300">Marketing (Offers & VIP passes)</span>
                  <input
                    id="cookie-toggle-marketing"
                    type="checkbox"
                    checked={categories.marketing}
                    onChange={(e) => setCategories({ ...categories, marketing: e.target.checked })}
                    className="accent-amber-500 rounded border-[#242424] bg-zinc-900 cursor-pointer"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 mt-4 pt-3 border-t border-[#1D1D1D]">
                <button
                  id="cookie-btn-back"
                  onClick={() => setShowSettings(false)}
                  className="px-2.5 py-1 text-[11px] text-zinc-400 hover:text-white transition"
                >
                  Back
                </button>
                <button
                  id="cookie-btn-save"
                  onClick={handleSavePreferences}
                  className="px-3.5 py-1.5 text-xs font-semibold text-black bg-amber-500 hover:bg-amber-400 rounded-lg transition"
                >
                  Save Preferences
                </button>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
