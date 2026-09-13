import { Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageContainer } from "@/components/layout/PageContainer";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export function PlannerPage() {
  return (
    <PageContainer
      title="Workout Planner"
      description="Organize your 7-day training schedule, recovery windows, and routine splits."
      badge="Schedule"
      action={
        <Button size="sm" variant="outline" className="gap-1.5 font-bold">
          <Plus className="h-4 w-4" /> Add Routine
        </Button>
      }
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {DAYS.map((day, idx) => (
          <Card key={day} className="p-4 hover:border-[#C8FF47]/40 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <span className="font-display font-bold uppercase text-white">
                {day}
              </span>
              <span className="text-[10px] uppercase font-bold text-[#C8FF47]">
                {idx % 2 === 0 ? "Active Workout" : "Rest & Recovery"}
              </span>
            </div>
            <p className="text-xs text-[#71717A]">
              {idx % 2 === 0
                ? "Full Body Conditioning & Core"
                : "Active mobility, 20m walk & hydration"}
            </p>
          </Card>
        ))}
      </div>
    </PageContainer>
  );
}
