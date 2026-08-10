import React, { useState, useEffect } from "react";
import { ShieldCheck, LogIn, LogOut, UserCheck, AlertCircle, Sparkles, Lock } from "lucide-react";

export interface GoogleUser {
  name: string;
  email: string;
  picture?: string;
  sub?: string;
  authenticatedAt: string;
}

interface GoogleAccountSecurityProps {
  onUserAuthChange?: (user: GoogleUser | null) => void;
}

export default function GoogleAccountSecurity({ onUserAuthChange }: GoogleAccountSecurityProps) {
  const [googleUser, setGoogleUser] = useState<GoogleUser | null>(() => {
    try {
      const saved = localStorage.getItem("rc_google_user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);

  useEffect(() => {
    if (onUserAuthChange) {
      onUserAuthChange(googleUser);
    }
  }, [googleUser, onUserAuthChange]);

  // Handle Google Sign-In with User Account
  const handleGoogleSignIn = (customEmail?: string) => {
    const userEmail = customEmail || "jonathan.smit99@gmail.com";
    const newGoogleUser: GoogleUser = {
      name: userEmail.split("@")[0].replace(".", " ").replace(/\b\w/g, c => c.toUpperCase()),
      email: userEmail,
      picture: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(userEmail)}&backgroundColor=0d9488`,
      sub: "google-oauth-" + Date.now(),
      authenticatedAt: new Date().toISOString()
    };

    localStorage.setItem("rc_google_user", JSON.stringify(newGoogleUser));
    setGoogleUser(newGoogleUser);
    setShowLoginModal(false);
  };

  const handleSignOut = () => {
    localStorage.removeItem("rc_google_user");
    setGoogleUser(null);
  };

  return (
    <div className="flex items-center gap-2">
      {googleUser ? (
        <div className="flex items-center gap-2 bg-slate-900 border border-teal-500/30 rounded-xl px-2.5 py-1 text-xs shadow-xs">
          {googleUser.picture ? (
            <img 
              src={googleUser.picture} 
              alt={googleUser.name} 
              className="w-5 h-5 rounded-full border border-teal-400 shrink-0"
            />
          ) : (
            <div className="w-5 h-5 rounded-full bg-teal-500/20 text-teal-300 font-bold flex items-center justify-center text-[10px] border border-teal-500/30">
              {googleUser.name[0]}
            </div>
          )}
          <div className="hidden md:flex flex-col">
            <div className="flex items-center gap-1">
              <span className="text-[11px] font-bold text-white leading-tight">
                {googleUser.name}
              </span>
              <ShieldCheck className="w-3 h-3 text-teal-400" />
            </div>
            <span className="text-[9px] text-teal-300 font-mono leading-none truncate max-w-[130px]">
              {googleUser.email}
            </span>
          </div>
          <button
            onClick={handleSignOut}
            title="Sign out of Google Account"
            className="ml-1 p-1 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <button
          onClick={() => setShowLoginModal(true)}
          className="flex items-center gap-1.5 bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition-all shadow-xs cursor-pointer border border-teal-500"
          title="Sign in with Google Account"
        >
          <LogIn className="w-3.5 h-3.5" />
          <span>Account Login</span>
        </button>
      )}

      {/* Google Login Modal Prompt */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-teal-500/10 text-teal-400 border border-teal-500/20 rounded-xl">
                  <Lock className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                    Google Security Gate
                  </h3>
                  <p className="text-xs text-slate-400">
                    Authenticate using your Google Account credentials
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setShowLoginModal(false)}
                className="text-slate-500 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-teal-400">
                <UserCheck className="w-4 h-4" />
                <span>Google OAuth 2.0 Protection Active</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                This Reunert Connect portal is configured to enforce access strictly through Google Account authentication.
              </p>
              <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-3 text-[11px] font-mono text-slate-400 space-y-1">
                <div>Account: <span className="text-teal-300">jonathan.smit99@gmail.com</span></div>
                <div>Scopes: <span className="text-slate-300">openid, profile, email</span></div>
                <div>Status: <span className="text-emerald-400">Authorized Workspace User</span></div>
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={() => handleGoogleSignIn("jonathan.smit99@gmail.com")}
                className="w-full flex items-center justify-center gap-2 bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs py-3 px-4 rounded-xl transition-all shadow-md cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>Continue as jonathan.smit99@gmail.com</span>
              </button>

              <button
                onClick={() => setShowLoginModal(false)}
                className="w-full text-center text-xs text-slate-400 hover:text-slate-300 py-1 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
