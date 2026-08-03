import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { AlertTriangle, X } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDestructive?: boolean;
}

export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  isDestructive = true,
}: ConfirmModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onCancel}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative w-full max-w-sm bg-[#111111] border border-[#242424] rounded-2xl shadow-2xl overflow-hidden m-4"
          >
            {/* Header */}
            <div className="p-5 pb-4 border-b border-[#1F1F1F] flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl flex items-center justify-center shrink-0 ${isDestructive ? 'bg-rose-500/10 text-rose-500' : 'bg-amber-500/10 text-amber-500'}`}>
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">{title}</h3>
                </div>
              </div>
              <button
                onClick={onCancel}
                className="p-1 text-zinc-500 hover:text-zinc-300 bg-[#18181B] hover:bg-[#242424] rounded-lg transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-5">
              <p className="text-xs text-zinc-400 leading-relaxed">
                {message}
              </p>
            </div>

            {/* Footer */}
            <div className="p-5 pt-0 flex items-center justify-end gap-3">
              <button
                onClick={onCancel}
                className="px-4 py-2 rounded-lg text-xs font-bold text-zinc-400 hover:text-white bg-[#18181B] hover:bg-[#242424] transition"
              >
                {cancelText}
              </button>
              <button
                onClick={onConfirm}
                className={`px-4 py-2 rounded-lg text-xs font-bold text-white transition shadow-lg ${
                  isDestructive
                    ? "bg-rose-600 hover:bg-rose-500 shadow-rose-500/20"
                    : "bg-amber-600 hover:bg-amber-500 shadow-amber-500/20"
                }`}
              >
                {confirmText}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
