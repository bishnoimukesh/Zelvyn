import React from "react";
import { Target, TrendingUp, Award } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAppSelector } from "@/app/hooks";

export const GoalProgressWidget: React.FC = () => {
  const goals = useAppSelector((state) => state.dashboard.goals);

  const getIcon = (id: string) => {
    switch (id) {
      case "g1":
        return <TrendingUp className="h-3.5 w-3.5 text-primary" />;
      case "g2":
        return <Award className="h-3.5 w-3.5 text-amber-400" />;
      default:
        return <Target className="h-3.5 w-3.5 text-purple-400" />;
    }
  };

  return (
    <Card className="border border-border bg-card p-5">
      <CardHeader className="p-0 pb-3 flex flex-row items-center justify-between">
        <div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-muted-foreground">
            Milestones
          </span>
          <CardTitle className="font-display text-lg font-black uppercase text-foreground mt-0.5">
            Active Fitness Goals
          </CardTitle>
        </div>
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary shadow-[0_0_10px_rgba(200,255,71,0.15)]">
          <Target className="h-4 w-4" />
        </div>
      </CardHeader>

      <CardContent className="p-0 space-y-3.5 mt-2">
        {goals.map((goal) => (
          <div
            key={goal.id}
            className="rounded-lg border border-border bg-muted/60 p-3 transition-colors hover:border-primary/30"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-muted">
                  {getIcon(goal.id)}
                </div>
                <span className="text-xs font-bold text-foreground">
                  {goal.title}
                </span>
              </div>
              <span className="font-mono text-xs font-bold text-primary">
                {goal.progress}%
              </span>
            </div>

            <div className="mt-2.5 space-y-1">
              <Progress value={goal.progress} className="h-1.5 bg-muted" />
              <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground">
                <span>
                  Current:{" "}
                  <strong className="text-foreground">
                    {typeof goal.current === "number" ? goal.current.toLocaleString() : goal.current} {goal.unit}
                  </strong>
                </span>
                <span>
                  Target:{" "}
                  <strong className="text-foreground">
                    {typeof goal.target === "number" ? goal.target.toLocaleString() : goal.target} {goal.unit}
                  </strong>
                </span>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
