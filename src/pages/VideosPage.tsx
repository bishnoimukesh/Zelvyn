import { Play } from "lucide-react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppSelector } from "@/app/hooks";

export function VideosPage() {
  const workouts = useAppSelector((state) => state.workouts.items);

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-[#71717A]">
          Sessions
        </span>
        <h1 className="font-display text-3xl font-black uppercase text-white">
          Workout Video Library
        </h1>
        <p className="text-xs text-[#71717A] mt-1">
          Follow guided trainer workouts with real-time timers.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {workouts.map((w) => (
          <Card key={w.id} className="overflow-hidden">
            <div className="relative aspect-video w-full bg-[#1A1A1F]">
              <img src={w.thumbnail} alt={w.title} className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <div className="h-12 w-12 rounded-full bg-[#C8FF47] text-[#08080A] flex items-center justify-center font-bold">
                  <Play className="h-6 w-6 fill-current ml-0.5" />
                </div>
              </div>
            </div>
            <CardHeader className="p-4">
              <CardTitle>{w.title}</CardTitle>
              <p className="text-xs text-[#71717A] mt-1">{w.duration} mins • {w.calories} kcal</p>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
