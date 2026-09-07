
import { useState } from "react";
import {
  Eye,
  EyeOff,
  Lock,
  ShieldCheck,
  KeyRound,
  Fingerprint,
  Cpu,
  ShieldAlert,
  CheckCircle2,
  AlertCircle,
  Check,
  X
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ show: boolean; message: string; type: "success" | "error" } | null>(null);

  // --- LIVE VALIDATION LOGIC FIX ---
  const hasLength = newPassword.length >= 6;
  const hasUpper = /[A-Z]/.test(newPassword);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);

  // FIXED: Only evaluate as true if they have actually typed a new password
  const isDifferent = newPassword.length > 0 && currentPassword !== newPassword;

  const passwordsMatch = newPassword === confirmPassword;
  const showMatchError = confirmPassword.length > 0 && !passwordsMatch;

  const isFormValid =
    currentPassword.length > 0 &&
    hasLength &&
    hasUpper &&
    hasSpecial &&
    isDifferent &&
    passwordsMatch &&
    confirmPassword.length > 0;

  const showNotification = (message: string, type: "success" | "error") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid) return;

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/auth/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to change password");
      }

      showNotification("Password changed successfully!", "success");

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      showNotification(error.message || "An error occurred.", "error");
    } finally {
      setLoading(false);
    }
  };

  const CriteriaItem = ({ met, text }: { met: boolean; text: string }) => (
    <div className={`flex items-center gap-2 text-xs transition-colors duration-300 ${met ? "text-blue-600 font-medium" : "text-slate-400"}`}>
      {met ? <Check size={14} className="text-blue-500" /> : <X size={14} className="text-slate-300" />}
      <span>{text}</span>
    </div>
  );

  return (
    <div className="justify-center font-sans ">

      {/* Toast Notification */}
      <div
        className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 transform ${
          toast ? "translate-y-0 opacity-100" : "-translate-y-12 opacity-0 pointer-events-none"
        }`}
      >
        {toast && (
          <div className={`flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl backdrop-blur-md border ${
            toast.type === "success"
              ? "bg-blue-50/90 border-blue-200 text-blue-800 shadow-blue-500/20"
              : "bg-red-50/90 border-red-200 text-red-800 shadow-red-500/20"
          }`}>
            {toast.type === "success" ? (
              <CheckCircle2 className="w-5 h-5 text-blue-500 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
            )}
            <span className="font-semibold text-sm tracking-wide">{toast.message}</span>
          </div>
        )}
      </div>

      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 bg-white/70 backdrop-blur-2xl border border-white/80 rounded-[2.5rem] shadow-[0_20px_80px_rgba(59,130,246,0.15)] overflow-hidden">

        {/* Left Panel - Reduced padding to shrink height */}
        <div className="relative p-8 lg:p-12 flex flex-col items-center justify-center border-b lg:border-b-0 lg:border-r border-blue-100 bg-gradient-to-br from-blue-100/50 via-sky-50 to-blue-200/40 overflow-hidden">

          <div className="absolute top-0 left-0 w-full h-1/2 bg-white/60 rounded-full blur-[80px] pointer-events-none"></div>

          <div className="absolute bottom-0 right-0 w-full h-1/2 bg-blue-300/20 rounded-full blur-[100px] pointer-events-none"></div>

          <div className="relative z-10 flex flex-col items-center text-center">

            <div className="mb-4 relative">
              <div className="absolute inset-0 bg-blue-400 blur-[40px] opacity-20 rounded-full"></div>

              <ShieldCheck
                className="w-28 h-28 text-blue-600 relative z-10 drop-shadow-[0_10px_25px_rgba(59,130,246,0.3)] transition-transform duration-700 hover:scale-105"
                strokeWidth={1}
              />
            </div>

            <h2 className="text-2xl lg:text-3xl font-extrabold text-blue-950 mb-2 tracking-tight">
              Security Gateway
            </h2>

            <p className="text-blue-700/80 text-sm max-w-sm leading-relaxed font-medium">
              Update your authentication credentials securely through our protected protocol.
            </p>

            <div className="mt-6 flex gap-4 text-blue-600">

              <div className="p-2.5 rounded-2xl bg-white border border-blue-100 shadow-[0_10px_25px_rgba(59,130,246,0.1)] hover:scale-110 transition-transform">
                <Fingerprint className="w-5 h-5" />
              </div>

              <div className="p-2.5 rounded-2xl bg-white border border-blue-100 shadow-[0_10px_25px_rgba(59,130,246,0.1)] hover:scale-110 transition-transform">
                <Cpu className="w-5 h-5" />
              </div>

              <div className="p-2.5 rounded-2xl bg-white border border-blue-100 shadow-[0_10px_25px_rgba(59,130,246,0.1)] hover:scale-110 transition-transform">
                <ShieldAlert className="w-5 h-5" />
              </div>

            </div>
          </div>
        </div>

        {/* Right Panel - Reduced padding and gaps to shrink height */}
        <div className="p-8 lg:p-12 flex flex-col justify-center bg-white/40 relative">

          <div className="mb-4 text-center lg:text-left">
            <h3 className="text-xl font-bold text-blue-950 mb-1">
              Change Password
            </h3>

            <p className="text-blue-700/70 text-xs font-medium">
              Ensure your new password meets the security requirements.
            </p>
          </div>

          {/* Reduced space-y gap */}
          <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md mx-auto lg:mx-0">

            {/* Current Password */}
            <div className="space-y-1">

              <label className="text-[10px] font-bold tracking-widest text-blue-700 uppercase ml-2 flex items-center gap-1.5">
                <Lock size={12} /> Current Identity Key
              </label>

              <div className="relative group">

                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-blue-400 group-focus-within:text-blue-600 transition-colors duration-300">
                  <Lock size={16} />
                </div>

                <input
                  type={showCurrent ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="w-full bg-white/80 border border-blue-200/80 text-blue-950 rounded-full pl-10 pr-12 py-2.5 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 placeholder:text-blue-300 shadow-sm text-sm"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-blue-400 hover:text-blue-600 transition-colors bg-white rounded-full shadow-sm border border-blue-50"
                >
                  {showCurrent ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>

              </div>
            </div>

            <div className="h-px w-full bg-gradient-to-r from-blue-200/0 via-blue-200 to-blue-200/0 my-1"></div>

            {/* New Password & Live Checklist */}
            <div className="space-y-2">

              <div className="space-y-1">

                <label className="text-[10px] font-bold tracking-widest text-blue-700 uppercase ml-2 flex items-center gap-1.5">
                  <KeyRound size={12} /> New Identity Key
                </label>

                <div className="relative group">

                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-blue-400 group-focus-within:text-sky-600 transition-colors duration-300">
                    <KeyRound size={16} />
                  </div>

                  <input
                    type={showNew ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full bg-white/80 border border-blue-200/80 text-blue-950 rounded-full pl-10 pr-12 py-2.5 focus:outline-none focus:ring-4 focus:ring-sky-500/20 focus:border-sky-500 transition-all duration-300 placeholder:text-blue-300 shadow-sm text-sm"
                    required
                  />

                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-blue-400 hover:text-sky-600 transition-colors bg-white rounded-full shadow-sm border border-blue-50"
                  >
                    {showNew ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>

                </div>
              </div>

              {/* Live validation checklist - reduced padding */}
              <div className="bg-blue-50/50 rounded-xl p-2.5 border border-blue-100/50 space-y-1 ml-2 mr-2">
                <CriteriaItem met={hasLength} text="At least 6 characters long" />
                <CriteriaItem met={hasUpper} text="Contains 1 uppercase letter" />
                <CriteriaItem met={hasSpecial} text="Contains 1 special character" />
                <CriteriaItem met={isDifferent} text="Must be different from current password" />
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-1">

              <label className="text-[10px] font-bold tracking-widest text-blue-700 uppercase ml-2 flex items-center gap-1.5">
                <ShieldCheck size={12} /> Verify New Key
              </label>

              <div className="relative group">

                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-blue-400 group-focus-within:text-sky-600 transition-colors duration-300">
                  <ShieldCheck size={16} />
                </div>

                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className={`w-full bg-white/80 border ${
                    showMatchError
                      ? "border-red-300 focus:ring-red-500/20 focus:border-red-500"
                      : "border-blue-200/80 focus:ring-sky-500/20 focus:border-sky-500"
                  } text-blue-950 rounded-full pl-10 pr-12 py-2.5 focus:outline-none focus:ring-4 transition-all duration-300 placeholder:text-blue-300 shadow-sm text-sm`}
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-blue-400 hover:text-sky-600 transition-colors bg-white rounded-full shadow-sm border border-blue-50"
                >
                  {showConfirm ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>

              </div>

              {/* Inline mismatch error */}
              {showMatchError && (
                <p className="text-[10px] text-red-500 font-medium ml-4 mt-1 flex items-center gap-1">
                  <AlertCircle size={10} /> Passwords do not match
                </p>
              )}
            </div>

            {/* Locked/Unlocked Submit Button - reduced padding and margin */}
            <button
              type="submit"
              disabled={!isFormValid || loading}
              className={`w-full mt-4 px-6 py-3 rounded-full transition-all duration-500 flex justify-center items-center gap-2 uppercase text-xs font-bold tracking-wide
                ${
                  isFormValid
                    ? "bg-[length:200%_auto] bg-gradient-to-r from-blue-500 via-sky-500 to-blue-500 hover:bg-right text-white shadow-[0_10px_20px_rgba(59,130,246,0.2)] hover:shadow-[0_15px_30px_rgba(14,165,233,0.3)] cursor-pointer"
                    : "bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300"
                }`}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>

                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>

                  Authenticating...
                </>
              ) : (
                isFormValid
                  ? "Initialize Secure Override"
                  : "Complete Requirements to Unlock"
              )}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}

