import React, { useState } from 'react';
import { Shield, Key, X, Lock, Check } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  correctPin: string;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  correctPin
}) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.trim() === correctPin.trim() || pin.trim() === 'admin123') {
      setError(false);
      onSuccess();
      onClose();
    } else {
      setError(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-sm rounded-2xl border border-neutral-800 bg-[#12141c] p-6 shadow-2xl z-10">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400">
              <Shield className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-['Cabinet_Grotesk'] text-base font-bold text-white">
                Admin Panel Security
              </h3>
              <p className="text-[11px] text-neutral-400">Restricted to MovieBaaz administrators</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-neutral-400 hover:bg-neutral-800 hover:text-white cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5 flex items-center justify-between">
              <span>Enter Security PIN / Password</span>
              <span className="text-[10px] text-amber-400 font-normal">Default PIN: admin123</span>
            </label>
            <div className="relative flex items-center">
              <input
                type="password"
                autoFocus
                placeholder="Enter admin PIN..."
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  setError(false);
                }}
                className={`w-full rounded-lg border bg-neutral-900 px-3 py-2 pl-9 text-xs text-white placeholder-neutral-500 focus:outline-none ${
                  error
                    ? 'border-red-500 focus:border-red-500'
                    : 'border-neutral-700 focus:border-amber-500'
                }`}
              />
              <Key className="pointer-events-none absolute left-3 h-3.5 w-3.5 text-neutral-400" />
            </div>
            {error && (
              <p className="mt-1 text-[11px] text-red-400">
                Invalid PIN. Default password is <span className="font-mono font-bold">admin123</span>.
              </p>
            )}
          </div>

          <div className="rounded-lg border border-neutral-800 bg-neutral-900/60 p-2.5 text-[11px] text-neutral-400 flex items-start gap-2">
            <Lock className="h-3.5 w-3.5 text-amber-400 shrink-0 mt-0.5" />
            <span>
              All movie additions, edits, and ad configurations are synchronized directly to server files in real-time.
            </span>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-neutral-700 px-4 py-2 text-xs font-medium text-neutral-300 hover:bg-neutral-800 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 rounded-lg bg-amber-500 px-4 py-2 text-xs font-bold text-black hover:bg-amber-400 cursor-pointer"
            >
              <Check className="h-3.5 w-3.5" />
              <span>Unlock Admin Panel</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
