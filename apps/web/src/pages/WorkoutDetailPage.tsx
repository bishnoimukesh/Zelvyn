import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Clock,
  Flame,
  Play,
  Dumbbell,
  ShieldCheck,
  Sparkles,
  Layers,
  StopCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useAppSelector, useAppDispatch } from "@/app/hooks";
import { ROUTES } from "@/constants/routes";
import { PageContainer } from "@/components/layout/PageContainer";
import { ExerciseList } from "@/components/workout-detail/ExerciseList";
import { ExerciseDetailCard } from "@/components/workout-detail/ExerciseDetailCard";
import { RestTimer } from "@/components/workout-detail/RestTimer";
import { WorkoutCompletionModal } from "@/components/workout-detail/WorkoutCompletionModal";
import {
  startSession,
  toggleSetCompleted,
  updateSetValues,
  nextExercise,
  prevExercise,
  setExerciseIndex,
  tickElapsed,
  finishSession,
  resetSession,
} from "@/features/workouts/workoutSessionSlice";
import { Exercise, Workout } from "@/types";

function getFallbackExercises(workout: Workout): Exercise[] {
  return [
    {
      id: `${workout.id}-ex-1`,
      name: `${workout.title} Primer Set`,
      targetMuscle: workout.bodyPart || "Full Body",
      equipment: workout.equipment || "Bodyweight",
      sets: 3,
      reps: "12 reps",
      restSeconds: 60,
      instructions: [
        "Warm up with dynamic activation drills focusing on joint mobilization.",
        "Execute steady controlled repetitions emphasizing full range of motion.",
        "Maintain core bracing and control the eccentric tempo.",
      ],
      formCues: ["Maintain neutral spine", "Controlled eccentric phase", "Breathe on exertion"],
      thumbnail: workout.thumbnail,
    },
    {
      id: `${workout.id}-ex-2`,
      name: `${workout.bodyPart || "Core"} Hypertrophy Drive`,
      targetMuscle: workout.bodyPart || "Full Body",
      equipment: workout.equipment || "Dumbbells",
      sets: 4,
      reps: "10 reps",
      restSeconds: 60,
      instructions: [
        "Position yourself with stable footing and engage your kinetic chain.",
        "Initiate movement with primary agonist muscles, avoiding secondary momentum.",
        "Pause for a peak isometric hold at the apex of the contraction.",
      ],
      formCues: ["Squeeze at the peak", "Keep shoulders back and depressed", "Even tempo"],
      thumbnail: workout.thumbnail,
    },
    {
      id: `${workout.id}-ex-3`,
      name: "High Tension Finisher",
      targetMuscle: workout.bodyPart || "Full Body",
      equipment: workout.equipment || "Bodyweight",
      sets: 3,
      reps: "15 reps",
      restSeconds: 45,
      instructions: [
        "Perform rapid, controlled burn-out intervals to induce metabolic stress.",
        "Minimize rest between transitions to sustain elevated heart rate.",
        "Finish with full isometric lockout.",
      ],
      formCues: ["Consistent tempo", "Full range of motion", "Push past comfort zone"],
      thumbnail: workout.thumbnail,
    },
  ];
}

export function WorkoutDetailPage() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const workouts = useAppSelector((state) => state.workouts.items);
  const workout = workouts.find((w) => w.id === id) || workouts[0];

  const session = useAppSelector((state) => state.workoutSession);
  const [showRoster, setShowRoster] = useState(false);

  // Normalize exercises
  const exercises: Exercise[] =
    workout.exercises && workout.exercises.length > 0
      ? workout.exercises
      : getFallbackExercises(workout);

  const isCurrentWorkoutActive =
    session.isSessionActive && session.activeWorkoutId === workout.id;

  // Session elapsed timer hook
  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | null = null;
    if (isCurrentWorkoutActive && !session.isCompleted) {
      timer = setInterval(() => {
        dispatch(tickElapsed());
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isCurrentWorkoutActive, session.isCompleted, dispatch]);

  const handleStartSession = () => {
    dispatch(startSession({ ...workout, exercises }));
  };

  const handleCancelSession = () => {
    if (window.confirm("Are you sure you want to end this workout session?")) {
      dispatch(resetSession());
    }
  };

  // Calculate session metrics
  const activeExercise = exercises[session.currentExerciseIndex] || exercises[0];
  const activeSetLogs = session.setLogs[activeExercise?.id] || [];

  let totalSetsCount = 0;
  let completedSetsCount = 0;
  Object.values(session.setLogs).forEach((sets) => {
    totalSetsCount += sets.length;
    completedSetsCount += sets.filter((s) => s.completed).length;
  });
  const overallProgressPercent =
    totalSetsCount > 0
      ? Math.round((completedSetsCount / totalSetsCount) * 100)
      : 0;

  const elapsedMins = Math.floor(session.elapsedSeconds / 60);
  const elapsedSecs = session.elapsedSeconds % 60;
  const formattedElapsed = `${String(elapsedMins).padStart(2, "0")}:${String(
    elapsedSecs
  ).padStart(2, "0")}`;

  return (
    <PageContainer>
      {/* Back Link */}
      <div className="flex items-center justify-between">
        <Link
          to={ROUTES.WORKOUTS}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#71717A] hover:text-[#C8FF47] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Workouts
        </Link>

        {isCurrentWorkoutActive && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCancelSession}
            className="text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 h-7"
          >
            <StopCircle className="h-3.5 w-3.5 mr-1" /> End Session
          </Button>
        )}
      </div>

      {/* ========================================================================= */}
      {/* MODE 1: ACTIVE LIVE SESSION                                               */}
      {/* ========================================================================= */}
      {isCurrentWorkoutActive ? (
        <div className="space-y-6" id="active-session-view">
          {/* Live Session Top Control Bar */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#121216] border border-[#222228] relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-[#C8FF47]/20 border border-[#C8FF47]/40 text-[#C8FF47] flex items-center justify-center font-mono font-bold">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C8FF47] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-[#C8FF47]"></span>
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#C8FF47] font-black">
                      Active Training Session
                    </span>
                    <Badge variant="secondary" className="text-[10px] py-0 px-1.5 font-mono">
                      {workout.category}
                    </Badge>
                  </div>
                  <h2 className="font-display text-lg font-bold text-white uppercase tracking-wide">
                    {workout.title}
                  </h2>
                </div>
              </div>

              {/* Session Counters */}
              <div className="flex items-center gap-4 font-mono text-xs">
                <div className="bg-[#181820] px-3 py-1.5 rounded-xl border border-[#2A2A36]">
                  <span className="text-[#71717A] text-[10px] uppercase block">Elapsed</span>
                  <span className="font-bold text-white text-sm" id="session-elapsed-timer">
                    {formattedElapsed}
                  </span>
                </div>

                <div className="bg-[#181820] px-3 py-1.5 rounded-xl border border-[#2A2A36]">
                  <span className="text-[#71717A] text-[10px] uppercase block">Volume Lifted</span>
                  <span className="font-bold text-[#C8FF47] text-sm" id="session-volume-display">
                    {session.totalVolumeKg.toLocaleString()} kg
                  </span>
                </div>

                <div className="bg-[#181820] px-3 py-1.5 rounded-xl border border-[#2A2A36]">
                  <span className="text-[#71717A] text-[10px] uppercase block">Progress</span>
                  <span className="font-bold text-emerald-400 text-sm">
                    {overallProgressPercent}%
                  </span>
                </div>
              </div>
            </div>

            {/* Overall Progress Line */}
            <div className="w-full bg-[#1F1F28] h-1.5 rounded-full mt-4 overflow-hidden">
              <div
                className="h-full bg-[#C8FF47] transition-all duration-300 rounded-full"
                style={{ width: `${overallProgressPercent}%` }}
              />
            </div>
          </div>

          {/* Active Exercise Detail Card */}
          <ExerciseDetailCard
            exercise={activeExercise}
            exerciseIndex={session.currentExerciseIndex}
            totalExercises={exercises.length}
            setLogs={activeSetLogs}
            onToggleSet={(setIdx, actualReps, weightKg, restSeconds) =>
              dispatch(
                toggleSetCompleted({
                  exerciseId: activeExercise.id,
                  setIndex: setIdx,
                  actualReps,
                  weightKg,
                  restSeconds,
                })
              )
            }
            onUpdateSetValues={(setIdx, actualReps, weightKg) =>
              dispatch(
                updateSetValues({
                  exerciseId: activeExercise.id,
                  setIndex: setIdx,
                  actualReps,
                  weightKg,
                })
              )
            }
            onPrevExercise={() => dispatch(prevExercise())}
            onNextExercise={() => dispatch(nextExercise(exercises.length))}
            onFinishSession={() => dispatch(finishSession())}
          />

          {/* Toggle Exercise Roster Drawer */}
          <div className="mt-4">
            <div className="flex items-center justify-between mb-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowRoster(!showRoster)}
                className="border-[#2A2A36] bg-[#121216] text-white hover:bg-[#1A1A22] text-xs flex items-center gap-1.5"
              >
                <Layers className="h-3.5 w-3.5 text-[#C8FF47]" />
                {showRoster ? "Hide Exercise Roster" : "View All Exercises in Routine"}
              </Button>
              <span className="text-xs text-[#71717A] font-mono">
                {completedSetsCount}/{totalSetsCount} Total Sets Completed
              </span>
            </div>

            {showRoster && (
              <div className="p-4 rounded-2xl bg-[#121216] border border-[#222228] animate-in fade-in duration-200">
                <ExerciseList
                  exercises={exercises}
                  activeExerciseIndex={session.currentExerciseIndex}
                  onSelectExercise={(idx) => dispatch(setExerciseIndex(idx))}
                  isSessionMode={true}
                  setLogs={session.setLogs}
                />
              </div>
            )}
          </div>

          {/* Floating/Docked Rest Timer */}
          <RestTimer />

          {/* Workout Completion Modal */}
          <WorkoutCompletionModal
            isOpen={session.isCompleted}
            workout={workout}
            elapsedSeconds={session.elapsedSeconds}
            totalVolumeKg={session.totalVolumeKg}
            setLogs={session.setLogs}
          />
        </div>
      ) : (
        /* ========================================================================= */
        /* MODE 2: WORKOUT OVERVIEW & PREVIEW                                        */
        /* ========================================================================= */
        <div className="space-y-6" id="workout-overview-view">
          {/* Header Metadata */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="default">{workout.category}</Badge>
              <Badge variant="secondary">{workout.difficulty}</Badge>
              {workout.targetGoal && (
                <Badge variant="outline" className="text-[#C8FF47] border-[#C8FF47]/30">
                  {workout.targetGoal}
                </Badge>
              )}
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-black uppercase text-white tracking-wide">
              {workout.title}
            </h1>
            <div className="flex items-center gap-5 text-xs font-semibold text-[#A1A1AA] mt-2 font-mono flex-wrap">
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-[#C8FF47]" /> {workout.duration} mins
              </span>
              <span className="flex items-center gap-1.5">
                <Flame className="h-4 w-4 text-[#C8FF47]" /> {workout.calories} kcal
              </span>
              <span className="flex items-center gap-1.5">
                <Dumbbell className="h-4 w-4 text-[#C8FF47]" /> {exercises.length} exercises
              </span>
              {workout.equipment && (
                <span className="flex items-center gap-1.5 text-[#71717A]">
                  <ShieldCheck className="h-4 w-4 text-[#C8FF47]" /> {workout.equipment}
                </span>
              )}
            </div>
          </div>

          {/* Hero Banner with Big Play Button */}
          <div className="relative aspect-video sm:aspect-[21/9] w-full rounded-3xl overflow-hidden bg-[#1A1A1F] border border-[#222228] group">
            <img
              src={workout.thumbnail}
              alt={workout.title}
              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/20 flex flex-col justify-end p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#C8FF47] font-bold block mb-1">
                    Ready to Train?
                  </span>
                  <h3 className="font-display text-xl sm:text-2xl font-bold uppercase text-white">
                    Start Guided Workout
                  </h3>
                </div>

                <Button
                  id="start-workout-hero-btn"
                  size="lg"
                  onClick={handleStartSession}
                  className="rounded-2xl px-6 py-6 bg-[#C8FF47] text-black font-black uppercase tracking-wider text-sm shadow-[0_0_25px_rgba(200,255,71,0.4)] hover:bg-[#b5f030] hover:scale-105 transition-all flex items-center gap-2 self-start sm:self-auto"
                >
                  <Play className="h-5 w-5 fill-current" /> Start Workout
                </Button>
              </div>
            </div>
          </div>

          {/* Workout Description Card */}
          <Card className="p-5 sm:p-6 border-[#222228] bg-[#121216]">
            <h3 className="font-display text-base font-bold uppercase text-white mb-2 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[#C8FF47]" /> Workout Architecture & Focus
            </h3>
            <p className="text-xs text-[#A1A1AA] leading-relaxed">
              {workout.description ||
                "Engineered compound movements combined with accessory isolation to trigger progressive muscular overload and optimal metabolic stimulus."}
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-[#222228] text-xs font-mono">
              <div>
                <span className="text-[#71717A] text-[10px] uppercase block">Target Muscle</span>
                <span className="text-white font-bold capitalize">{workout.bodyPart || "Full Body"}</span>
              </div>
              <div>
                <span className="text-[#71717A] text-[10px] uppercase block">Equipment</span>
                <span className="text-white font-bold capitalize">{workout.equipment || "Bodyweight"}</span>
              </div>
              <div>
                <span className="text-[#71717A] text-[10px] uppercase block">Rest Interval</span>
                <span className="text-[#C8FF47] font-bold">45-90s</span>
              </div>
              <div>
                <span className="text-[#71717A] text-[10px] uppercase block">Pacing</span>
                <span className="text-white font-bold">Progressive</span>
              </div>
            </div>
          </Card>

          {/* Exercise Roster Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-display text-xl font-bold uppercase text-white">
                  Exercise Breakdown ({exercises.length})
                </h2>
                <p className="text-xs text-[#71717A]">
                  Review sets, target reps, and rest intervals before lifting.
                </p>
              </div>

              <Button
                id="start-workout-bottom-btn"
                onClick={handleStartSession}
                className="bg-[#C8FF47] text-black font-black uppercase text-xs hover:bg-[#b5f030] shadow-[0_0_15px_rgba(200,255,71,0.25)] flex items-center gap-1.5"
              >
                <Play className="h-3.5 w-3.5 fill-current" /> Start Routine
              </Button>
            </div>

            <ExerciseList
              exercises={exercises}
              activeExerciseIndex={0}
              isSessionMode={false}
            />
          </div>
        </div>
      )}
    </PageContainer>
  );
}
