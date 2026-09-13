import { Link } from "react-router-dom";
import { Clock, Flame, Play } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/app/hooks";
import { PageContainer } from "@/components/layout/PageContainer";

export function WorkoutsPage() {
  const workouts = useAppSelector((state) => state.workouts.items);

  return (
    <PageContainer
      title="Workout Library"
      description="Explore tailored routines optimized for progressive overload and metabolic conditioning."
      badge="Catalog"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {workouts.map((w) => (
          <Card key={w.id} className="overflow-hidden flex flex-col justify-between hover:border-[#C8FF47]/40 transition-all">
            <div>
              <div className="relative aspect-video w-full overflow-hidden bg-[#1A1A1F]">
                <img
                  src={w.thumbnail}
                  alt={w.title}
                  className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                />
                <div className="absolute top-2 left-2 flex gap-1">
                  <Badge variant="default">{w.category}</Badge>
                  <Badge variant="secondary">{w.difficulty}</Badge>
                </div>
              </div>

              <CardHeader className="p-4 pb-2">
                <CardTitle className="line-clamp-1">{w.title}</CardTitle>
                <div className="flex items-center gap-3 text-xs text-[#71717A] mt-1 font-mono">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-[#C8FF47]" /> {w.duration}m
                  </span>
                  <span className="flex items-center gap-1">
                    <Flame className="h-3.5 w-3.5 text-[#C8FF47]" /> {w.calories} kcal
                  </span>
                </div>
              </CardHeader>
            </div>

            <CardContent className="p-4 pt-2">
              <Link to={`/workouts/${w.id}`}>
                <Button size="sm" className="w-full gap-1.5 font-bold">
                  <Play className="h-3.5 w-3.5 fill-current" /> View Details
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </PageContainer>
  );
}
