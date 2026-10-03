import { Link } from "react-router-dom";
import { Zap, ArrowRight, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between">
      {/* Top Bar */}
      <header className="px-6 h-16 flex items-center justify-between border-b border-border">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-black">
            <Zap className="h-5 w-5 fill-current" />
          </div>
          <span className="font-display text-2xl font-black tracking-wider text-foreground">
            FIT<span className="text-primary">SYNC</span>
          </span>
        </div>

        <Link to={ROUTES.DASHBOARD}>
          <Button size="sm" variant="default">
            Launch App
          </Button>
        </Link>
      </header>

      {/* Hero */}
      <main className="max-w-4xl mx-auto px-6 py-20 text-center flex flex-col items-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary mb-6">
          <Flame className="h-4 w-4 fill-current" />
          <span>Next-Gen Smart Fitness Platform</span>
        </div>

        <h1 className="font-display text-5xl sm:text-7xl font-black uppercase tracking-tight text-foreground leading-tight">
          SMART TRAINING. <br />
          <span className="text-primary">ADAPTIVE PROGRESS.</span>
        </h1>

        <p className="mt-6 max-w-xl text-sm sm:text-base text-muted-foreground leading-relaxed">
          FitSync brings AI-driven workout generation, progressive overload tracking, and personalized biometrics into a unified mobile-first ecosystem.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <Link to={ROUTES.DASHBOARD} className="w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto text-base gap-2">
              Enter Dashboard <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link to={ROUTES.WORKOUTS} className="w-full sm:w-auto">
            <Button variant="outline" size="lg" className="w-full sm:w-auto text-base">
              Browse Workouts
            </Button>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-6 px-6 text-center text-xs text-muted-foreground">
        © 2026 FitSync AI. Built with React, TypeScript, Vite & Tailwind CSS.
      </footer>
    </div>
  );
}
