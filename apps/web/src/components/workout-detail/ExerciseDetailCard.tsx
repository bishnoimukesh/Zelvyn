import { useState } from "react";
import { Exercise, SetLog } from "@/types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Dumbbell,
  HelpCircle,
  Lightbulb,
  Minus,
  Plus,
  Trophy,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ExerciseDetailCardProps {
  exercise: Exercise;
  exerciseIndex: number;
  totalExercises: number;
  setLogs: SetLog[];
  onToggleSet: (
    setIndex: number,
    actualReps?: number,
    weightKg?: number,
    restSeconds?: number
  ) => void;
  onUpdateSetValues: (
    setIndex: number,
    actualReps: number,
    weightKg: number
  ) => void;
  onPrevExercise: () => void;
  onNextExercise: () => void;
  onFinishSession: () => void;
}

export function ExerciseDetailCard({
  exercise,
  exerciseIndex,
  totalExercises,
  setLogs,
  onToggleSet,
  onUpdateSetValues,
  onPrevExercise,
  onNextExercise,
  onFinishSession,
}: ExerciseDetailCardProps) {
  const [showInstructions, setShowInstructions] = useState(false);
  const isLast = exerciseIndex === totalExercises - 1;

  // Ensure set logs exists
  const activeSets =
    setLogs && setLogs.length > 0
      ? setLogs
      : Array.from({ length: exercise.sets }, (_, i) => ({
          setNumber: i + 1,
          targetReps: exercise.reps,
          actualReps: parseInt(exercise.reps) || 10,
          weightKg: 60,
          completed: false,
        }));

  const allCompleted =
    activeSets.length > 0 && activeSets.every((s) => s.completed);

  return (
    <div className="space-y-4" id="active-exercise-card">
      {/* Exercise Focus Card */}
      <Card className="p-4 sm:p-6 border-border bg-card relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

        {/* Top bar with progress and tags */}
        <div className="flex items-center justify-between gap-2 flex-wrap mb-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-primary px-2.5 py-1 rounded-md bg-primary/10 border border-primary/20">
              Exercise {exerciseIndex + 1} of {totalExercises}
            </span>
            <Badge variant="secondary" className="text-xs">
              {exercise.equipment}
            </Badge>
          </div>

          <button
            type="button"
            onClick={() => setShowInstructions(!showInstructions)}
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
          >
            <HelpCircle className="h-3.5 w-3.5" />
            {showInstructions ? "Hide Instructions" : "Instructions & Tips"}
          </button>
        </div>

        {/* Title & Muscle Target */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-black uppercase text-foreground tracking-wide">
              {exercise.name}
            </h2>
            <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1">
              <Dumbbell className="h-3.5 w-3.5 text-primary" />
              Primary Target:{" "}
              <span className="text-foreground font-semibold">
                {exercise.targetMuscle}
              </span>
            </p>
          </div>

          {/* Target pill */}
          <div className="bg-muted border border-border rounded-xl px-3 py-2 flex items-center gap-4 text-xs font-mono">
            <div>
              <span className="text-muted-foreground block text-[10px] uppercase">
                Sets
              </span>
              <span className="text-foreground font-bold">{exercise.sets}</span>
            </div>
            <div className="w-px h-6 bg-border" />
            <div>
              <span className="text-muted-foreground block text-[10px] uppercase">
                Target Reps
              </span>
              <span className="text-foreground font-bold">{exercise.reps}</span>
            </div>
            <div className="w-px h-6 bg-border" />
            <div>
              <span className="text-muted-foreground block text-[10px] uppercase">
                Rest
              </span>
              <span className="text-primary font-bold">
                {exercise.restSeconds}s
              </span>
            </div>
          </div>
        </div>

        {/* Collapsible Form Instructions & Tips */}
        {showInstructions && (
          <div className="mb-6 p-4 rounded-xl bg-muted border border-border space-y-3 animate-in fade-in duration-200">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-foreground mb-1.5 flex items-center gap-1.5">
                <Lightbulb className="h-3.5 w-3.5 text-primary" /> Form Cues &
                Technique
              </h4>
              <div className="flex flex-wrap gap-2">
                {exercise.formCues.map((cue, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-2.5 py-1 rounded-lg bg-card text-foreground border border-border"
                  >
                    • {cue}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-border">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                Execution Steps
              </h4>
              <ol className="text-xs text-muted-foreground space-y-1.5 list-decimal list-inside leading-relaxed">
                {exercise.instructions.map((step, idx) => (
                  <li key={idx} className="pl-1">
                    <span className="text-foreground">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        )}

        {/* Interactive Set Logger Table */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-display text-sm font-bold uppercase tracking-wider text-foreground">
              Log Sets & Volume
            </h3>
            <span className="text-xs font-mono text-muted-foreground">
              {activeSets.filter((s) => s.completed).length} of {activeSets.length}{" "}
              sets logged
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-border text-muted-foreground text-[11px] uppercase tracking-wider">
                  <th className="py-2.5 px-3">Set</th>
                  <th className="py-2.5 px-3">Target</th>
                  <th className="py-2.5 px-3 text-center">Weight (kg)</th>
                  <th className="py-2.5 px-3 text-center">Reps</th>
                  <th className="py-2.5 px-3 text-right">Complete</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {activeSets.map((set, setIdx) => (
                  <tr
                    key={set.setNumber}
                    id={`set-row-${exerciseIndex}-${setIdx}`}
                    className={cn(
                      "transition-colors",
                      set.completed
                        ? "bg-primary/10"
                        : "hover:bg-muted"
                    )}
                  >
                    {/* Set Number */}
                    <td className="py-3 px-3 font-bold">
                      <span
                        className={cn(
                          "h-6 w-6 rounded-md inline-flex items-center justify-center text-xs",
                          set.completed
                            ? "bg-primary text-primary-foreground font-black"
                            : "bg-muted text-muted-foreground"
                        )}
                      >
                        {set.setNumber}
                      </span>
                    </td>

                    {/* Target */}
                    <td className="py-3 px-3 text-muted-foreground font-medium">
                      {exercise.reps}
                    </td>

                    {/* Weight Input + Stepper */}
                    <td className="py-3 px-3 text-center">
                      <div className="inline-flex items-center gap-1.5 bg-muted p-1 rounded-lg border border-border">
                        <button
                          type="button"
                          onClick={() => {
                            const nextKg = Math.max(0, set.weightKg - 2.5);
                            onUpdateSetValues(setIdx, set.actualReps, nextKg);
                          }}
                          className="h-6 w-6 rounded bg-card text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors border border-border"
                          title="Decrease 2.5kg"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <input
                          type="number"
                          value={set.weightKg}
                          onChange={(e) => {
                            const val = parseFloat(e.target.value) || 0;
                            onUpdateSetValues(setIdx, set.actualReps, val);
                          }}
                          className="w-12 bg-transparent text-center font-mono font-bold text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-primary rounded"
                          step={2.5}
                          min={0}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const nextKg = set.weightKg + 2.5;
                            onUpdateSetValues(setIdx, set.actualReps, nextKg);
                          }}
                          className="h-6 w-6 rounded bg-card text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors border border-border"
                          title="Increase 2.5kg"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </td>

                    {/* Reps Input + Stepper */}
                    <td className="py-3 px-3 text-center">
                      <div className="inline-flex items-center gap-1.5 bg-muted p-1 rounded-lg border border-border">
                        <button
                          type="button"
                          onClick={() => {
                            const nextReps = Math.max(1, set.actualReps - 1);
                            onUpdateSetValues(setIdx, nextReps, set.weightKg);
                          }}
                          className="h-6 w-6 rounded bg-card text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors border border-border"
                          title="Decrease 1 rep"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <input
                          type="number"
                          value={set.actualReps}
                          onChange={(e) => {
                            const val = parseInt(e.target.value) || 0;
                            onUpdateSetValues(setIdx, val, set.weightKg);
                          }}
                          className="w-10 bg-transparent text-center font-mono font-bold text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-primary rounded"
                          min={1}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const nextReps = set.actualReps + 1;
                            onUpdateSetValues(setIdx, nextReps, set.weightKg);
                          }}
                          className="h-6 w-6 rounded bg-card text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors border border-border"
                          title="Increase 1 rep"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </td>

                    {/* Toggle Completion */}
                    <td className="py-3 px-3 text-right">
                      <button
                        type="button"
                        id={`toggle-set-${exerciseIndex}-${setIdx}`}
                        onClick={() =>
                          onToggleSet(
                            setIdx,
                            set.actualReps,
                            set.weightKg,
                            exercise.restSeconds
                          )
                        }
                        className={cn(
                          "h-8 w-8 rounded-lg inline-flex items-center justify-center transition-all duration-200 border",
                          set.completed
                            ? "bg-primary text-primary-foreground border-primary shadow-[0_0_12px_rgba(200,255,71,0.4)]"
                            : "bg-card text-muted-foreground border-border hover:border-primary hover:text-foreground"
                        )}
                      >
                        <Check
                          className={cn(
                            "h-4 w-4 stroke-[3]",
                            set.completed ? "text-primary-foreground" : "text-transparent"
                          )}
                        />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Navigation & Completion Action Buttons */}
        <div className="mt-6 pt-4 border-t border-border flex items-center justify-between gap-3">
          <Button
            id="prev-exercise-btn"
            variant="outline"
            size="sm"
            onClick={onPrevExercise}
            disabled={exerciseIndex === 0}
            className="border-border bg-card text-foreground hover:bg-muted disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4 mr-1" /> Previous
          </Button>

          {isLast ? (
            <Button
              id="finish-workout-btn"
              size="sm"
              onClick={onFinishSession}
              className="bg-primary text-primary-foreground font-black uppercase hover:opacity-95 shadow-[0_0_20px_rgba(200,255,71,0.3)] transition-all flex items-center gap-1.5"
            >
              <Trophy className="h-4 w-4" /> Finish Workout
            </Button>
          ) : (
            <Button
              id="next-exercise-btn"
              size="sm"
              onClick={onNextExercise}
              className={cn(
                "font-bold transition-all flex items-center gap-1",
                allCompleted
                  ? "bg-primary text-primary-foreground hover:opacity-95 shadow-[0_0_15px_rgba(200,255,71,0.25)]"
                  : "bg-foreground text-background hover:bg-foreground/90"
              )}
            >
              Next Exercise <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
