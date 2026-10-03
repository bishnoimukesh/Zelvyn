import { Link } from "react-router-dom";
import { Zap, ArrowRight, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants/routes";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-[#08080A] text-[#F2F2F5] flex flex-col justify-between">
      {/* Top Bar */}
      <header className="px-6 h-16 flex items-center justify-between border-b border-[#222228]">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-[#C8FF47] flex items-center justify-center text-[#08080A] font-black">
            <Zap className="h-5 w-5 fill-current" />
          </div>
          <span className="font-display text-2xl font-black tracking-wider text-white">
            FIT<span className="text-[#C8FF47]">SYNC</span>
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
        <div className="inline-flex items-center gap-2 rounded-full border border-[#C8FF47]/30 bg-[#C8FF47]/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#C8FF47] mb-6">
          <Flame className="h-4 w-4 fill-current" />
          <span>Next-Gen Smart Fitness Platform</span>
        </div>

        <h1 className="font-display text-5xl sm:text-7xl font-black uppercase tracking-tight text-white leading-tight">
          SMART TRAINING. <br />
          <span className="text-[#C8FF47]">ADAPTIVE PROGRESS.</span>
        </h1>

        <p className="mt-6 max-w-xl text-sm sm:text-base text-[#71717A] leading-relaxed">
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
      <footer className="border-t border-[#222228] py-6 px-6 text-center text-xs text-[#71717A]">
        © 2026 FitSync AI. Built with React, TypeScript, Vite & Tailwind CSS.
      </footer>
    </div>
  );
}
