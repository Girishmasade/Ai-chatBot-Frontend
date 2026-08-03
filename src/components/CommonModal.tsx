import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, AlertTriangle } from "lucide-react";

interface CommonModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  isDestructive?: boolean;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  children?: React.ReactNode;
}

export default function CommonModal({
  isOpen,
  onClose,
  title,
  isDestructive = false,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  children
}: CommonModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div id={`modal-${title.toLowerCase().replace(/\s+/g, "-")}`} className="fixed inset-0 flex items-center justify-center z-50 p-4">
          {/* Backdrop glass blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            transition={{ type: "spring", duration: 0.4 }}
            className="relative w-full max-w-md bg-[#151515] border border-[#242424] rounded-2xl overflow-hidden shadow-2xl z-10"
          >
            {/* Ambient orange background glow */}
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-48 h-12 bg-amber-500/10 blur-xl rounded-full" />

            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-[#1F1F1F]">
              <div className="flex items-center gap-2">
                {isDestructive && <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />}
                <h3 className="text-sm font-semibold text-white tracking-wide">{title}</h3>
              </div>
              <button
                id="modal-close-btn"
                onClick={onClose}
                className="p-1 rounded-md text-zinc-500 hover:text-white hover:bg-zinc-900 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-6 text-xs text-[#9B9B9B] leading-relaxed">
              {children}
            </div>

            {/* Action Buttons */}
            {onConfirm && (
              <div className="flex items-center justify-end gap-3 p-4 bg-[#111111]/90 border-t border-[#1F1F1F]">
                <button
                  id="modal-cancel-btn"
                  onClick={onClose}
                  className="px-3.5 py-1.5 text-xs font-medium text-zinc-400 hover:text-white bg-[#1A1A1A] border border-[#242424] rounded-lg transition"
                >
                  {cancelText}
                </button>
                <button
                  id="modal-confirm-btn"
                  onClick={() => {
                    onConfirm();
                    onClose();
                  }}
                  className={`px-4 py-1.5 text-xs font-semibold rounded-lg shadow-md transition duration-200 ${
                    isDestructive
                      ? "bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/10"
                      : "bg-amber-500 hover:bg-amber-400 text-black shadow-amber-500/15"
                  }`}
                >
                  {confirmText}
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
