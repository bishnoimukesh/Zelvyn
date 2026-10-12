import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Zap, Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, AlertCircle, Sparkles } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { loginAsync, clearAuthError } from "@/features/auth/authSlice";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { ROUTES } from "@/constants/routes";

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();

  const { isAuthenticated, loading, error } = useAppSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // If already logged in, redirect to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      const from = (location.state as any)?.from?.pathname || ROUTES.DASHBOARD;
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!email.trim()) {
      setFormError("Please enter your email address.");
      return;
    }
    if (!password) {
      setFormError("Please enter your password.");
      return;
    }

    try {
      await dispatch(loginAsync({ email: email.trim(), password })).unwrap();
      navigate(ROUTES.DASHBOARD);
    } catch {
      // Error is caught by Redux authSlice
    }
  };

  const handleQuickDemoLogin = async () => {
    setEmail("alex@fitsync.ai");
    setPassword("password123");
    setFormError(null);

    try {
      await dispatch(loginAsync({ email: "alex@fitsync.ai", password: "password123" })).unwrap();
      navigate(ROUTES.DASHBOARD);
    } catch {
      // Handled in state
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between relative overflow-hidden selection:bg-primary selection:text-primary-foreground">
      {/* Ambient background glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Navbar */}
      <header className="px-6 h-16 flex items-center justify-between border-b border-border/60 bg-background/60 backdrop-blur-md relative z-10">
        <Link to={ROUTES.HOME} className="flex items-center gap-2 group">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-black group-hover:scale-105 transition-transform">
            <Zap className="h-5 w-5 fill-current" />
          </div>
          <span className="font-display text-2xl font-black tracking-wider text-foreground">
            FIT<span className="text-primary">SYNC</span>
          </span>
        </Link>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link to={ROUTES.SIGNUP}>
            <Button variant="outline" size="sm" className="font-bold text-xs">
              Sign Up
            </Button>
          </Link>
        </div>
      </header>

      {/* Center Auth Card */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 relative z-10">
        <div className="w-full max-w-md rounded-3xl border border-border bg-card/95 backdrop-blur-xl p-6 sm:p-8 shadow-2xl space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[11px] font-black uppercase tracking-wider mb-1">
              <Zap className="h-3 w-3 fill-current" /> Athlete Portal
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-black uppercase tracking-tight text-foreground">
              Welcome Back
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Sign in to access your workouts, AI coaching, and recovery metrics.
            </p>
          </div>

          {/* Error alerts */}
          {(formError || error) && (
            <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-3.5 flex items-start gap-2.5 text-xs text-destructive animate-in fade-in">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <p className="font-medium leading-relaxed">{formError || error}</p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label
                htmlFor="login-email"
                className="text-xs font-bold uppercase tracking-wider text-foreground/80 block"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  disabled={loading}
                  className="w-full h-11 pl-10 pr-3 rounded-xl border border-border bg-muted/50 focus:bg-background text-foreground text-sm font-medium placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="login-password"
                  className="text-xs font-bold uppercase tracking-wider text-foreground/80 block"
                >
                  Password
                </label>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  disabled={loading}
                  className="w-full h-11 pl-10 pr-10 rounded-xl border border-border bg-muted/50 focus:bg-background text-foreground text-sm font-medium placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-1 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 text-sm font-bold uppercase tracking-wider bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 rounded-xl gap-2 mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Signing In...
                </>
              ) : (
                <>
                  Sign In <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          {/* Quick Demo Login Preset Button */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleQuickDemoLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl border border-primary/30 bg-primary/10 hover:bg-primary/15 text-primary text-xs font-bold transition-all"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>One-Click Demo Athlete Login (Alex Hunter)</span>
            </button>
          </div>

          {/* Switch to Signup */}
          <div className="text-center pt-2 border-t border-border/80">
            <p className="text-xs text-muted-foreground">
              Don&apos;t have an account yet?{" "}
              <Link
                to={ROUTES.SIGNUP}
                className="font-bold text-primary hover:underline"
              >
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/60 py-4 px-6 text-center text-xs text-muted-foreground relative z-10">
        <Link to={ROUTES.HOME} className="hover:text-foreground transition-colors mr-4">
          ← Back to Homepage
        </Link>
        <span>·</span>
        <Link to={ROUTES.DASHBOARD} className="hover:text-foreground transition-colors ml-4">
          Explore as Guest
        </Link>
      </footer>
    </div>
  );
}
export default LoginPage;
