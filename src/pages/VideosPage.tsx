import { Play } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppSelector } from "@/app/hooks";
import { PageContainer } from "@/components/layout/PageContainer";

export function VideosPage() {
  const workouts = useAppSelector((state) => state.workouts.items);

  return (
    <PageContainer
      title="Workout Video Library"
      description="Follow guided coach sessions with form cues, tempo meters, and real-time timers."
      badge="Sessions"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {workouts.map((w) => (
          <Card key={w.id} className="overflow-hidden group hover:border-[#C8FF47]/40 transition-all cursor-pointer">
            <div className="relative aspect-video w-full bg-[#1A1A1F]">
              <img
                src={w.thumbnail}
                alt={w.title}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center transition-colors group-hover:bg-black/30">
                <div className="h-12 w-12 rounded-full bg-[#C8FF47] text-[#08080A] flex items-center justify-center font-bold shadow-[0_0_15px_rgba(200,255,71,0.5)] transition-transform group-hover:scale-110">
                  <Play className="h-6 w-6 fill-current ml-0.5" />
                </div>
              </div>
            </div>
            <CardHeader className="p-4">
              <CardTitle className="group-hover:text-[#C8FF47] transition-colors">{w.title}</CardTitle>
              <p className="text-xs text-[#71717A] mt-1 font-mono">{w.duration} mins • {w.calories} kcal</p>
            </CardHeader>
          </Card>
        ))}
      </div>
    </PageContainer>
  );
}
