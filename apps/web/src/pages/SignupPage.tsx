import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Zap, User, Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, AlertCircle, Dumbbell, Target } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { signupAsync, clearAuthError } from "@/features/auth/authSlice";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { ROUTES } from "@/constants/routes";

const FITNESS_LEVELS = [
  { id: "beginner", label: "Beginner", desc: "< 1 yr training" },
  { id: "intermediate", label: "Intermediate", desc: "1-3 yrs regular" },
  { id: "advanced", label: "Advanced", desc: "3+ yrs consistent" },
] as const;

const GOALS = [
  "Hypertrophy & Muscle Gain",
  "Fat Loss & Conditioning",
  "Strength & Power",
  "Endurance & Longevity",
];

export function SignupPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { isAuthenticated, loading, error } = useAppSelector((state) => state.auth);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fitnessLevel, setFitnessLevel] = useState<"beginner" | "intermediate" | "advanced">("intermediate");
  const [goal, setGoal] = useState("Hypertrophy & Muscle Gain");
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      navigate(ROUTES.DASHBOARD, { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!name.trim()) {
      setFormError("Please enter your full name.");
      return;
    }
    if (!email.trim()) {
      setFormError("Please enter your email address.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setFormError("Please enter a valid email address.");
      return;
    }
    if (!password || password.length < 6) {
      setFormError("Password must be at least 6 characters long.");
      return;
    }

    try {
      await dispatch(
        signupAsync({
          name: name.trim(),
          email: email.trim(),
          password,
          fitnessLevel,
          goal,
        })
      ).unwrap();
      navigate(ROUTES.DASHBOARD);
    } catch {
      // Handled in Redux slice
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between relative overflow-hidden selection:bg-primary selection:text-primary-foreground">
      {/* Background glow effects */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[140px] pointer-events-none" />

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
          <Link to={ROUTES.LOGIN}>
            <Button variant="outline" size="sm" className="font-bold text-xs">
              Sign In
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-4 relative z-10">
        <div className="w-full max-w-lg rounded-3xl border border-border bg-card/95 backdrop-blur-xl p-6 sm:p-8 shadow-2xl space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[11px] font-black uppercase tracking-wider mb-1">
              <Dumbbell className="h-3 w-3 fill-current" /> Start Your Fitness Journey
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-black uppercase tracking-tight text-foreground">
              Create Your Account
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Join FitSync to track progressive overload, generate AI workouts, and crush your goals.
            </p>
          </div>

          {/* Error Banner */}
          {(formError || error) && (
            <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-3.5 flex items-start gap-2.5 text-xs text-destructive animate-in fade-in">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <p className="font-medium leading-relaxed">{formError || error}</p>
            </div>
          )}

          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label
                htmlFor="signup-name"
                className="text-xs font-bold uppercase tracking-wider text-foreground/80 block"
              >
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  id="signup-name"
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Jordan Hayes"
                  disabled={loading}
                  className="w-full h-11 pl-10 pr-3 rounded-xl border border-border bg-muted/50 focus:bg-background text-foreground text-sm font-medium placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
                  required
                />
              </div>
            </div>

            {/* Email Address */}
            <div className="space-y-1.5">
              <label
                htmlFor="signup-email"
                className="text-xs font-bold uppercase tracking-wider text-foreground/80 block"
              >
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  id="signup-email"
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

            {/* Password */}
            <div className="space-y-1.5">
              <label
                htmlFor="signup-password"
                className="text-xs font-bold uppercase tracking-wider text-foreground/80 block"
              >
                Password <span className="text-[10px] text-muted-foreground font-normal">(min. 6 characters)</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  id="signup-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a secure password"
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

            {/* Experience Level */}
            <div className="space-y-1.5 pt-1">
              <label className="text-xs font-bold uppercase tracking-wider text-foreground/80 block">
                Experience Level
              </label>
              <div className="grid grid-cols-3 gap-2">
                {FITNESS_LEVELS.map((level) => {
                  const isSelected = fitnessLevel === level.id;
                  return (
                    <button
                      key={level.id}
                      type="button"
                      onClick={() => setFitnessLevel(level.id)}
                      className={`p-2.5 rounded-xl border text-center transition-all ${
                        isSelected
                          ? "border-primary bg-primary/10 text-primary font-bold shadow-sm ring-1 ring-primary/40"
                          : "border-border bg-muted/40 text-muted-foreground hover:border-primary/40 hover:text-foreground"
                      }`}
                    >
                      <div className="text-xs font-bold leading-tight">{level.label}</div>
                      <div className="text-[10px] opacity-75 mt-0.5">{level.desc}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Primary Goal */}
            <div className="space-y-1.5 pt-1">
              <label
                htmlFor="signup-goal"
                className="text-xs font-bold uppercase tracking-wider text-foreground/80 flex items-center gap-1.5"
              >
                <Target className="h-3.5 w-3.5 text-primary" /> Primary Focus
              </label>
              <select
                id="signup-goal"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                disabled={loading}
                className="w-full h-11 px-3 rounded-xl border border-border bg-muted/50 focus:bg-background text-foreground text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all"
              >
                {GOALS.map((g) => (
                  <option key={g} value={g} className="bg-card text-foreground">
                    {g}
                  </option>
                ))}
              </select>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-11 text-sm font-bold uppercase tracking-wider bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 rounded-xl gap-2 mt-3"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Creating Account...
                </>
              ) : (
                <>
                  Create Account <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          {/* Switch to Login */}
          <div className="text-center pt-2 border-t border-border/80">
            <p className="text-xs text-muted-foreground">
              Already have an account?{" "}
              <Link
                to={ROUTES.LOGIN}
                className="font-bold text-primary hover:underline"
              >
                Sign In
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
export default SignupPage;
