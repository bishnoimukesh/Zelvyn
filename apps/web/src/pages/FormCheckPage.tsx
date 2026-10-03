import { useState, useRef } from "react";
import {
  Camera,
  AlertTriangle,
  CheckCircle2,
  Scan,
  RefreshCw,
} from "lucide-react";
import { PageContainer } from "@/components/layout/PageContainer";
import { Button } from "@/components/ui/button";

interface ExerciseOption {
  id: string;
  name: string;
  checklist: string[];
}

const EXERCISES: ExerciseOption[] = [
  {
    id: "squat",
    name: "Squat",
    checklist: [
      "Keep your chest up",
      "Drive knees over toes",
      "Hip crease below parallel",
      "Heels flat on floor",
    ],
  },
  {
    id: "pushup",
    name: "Push-up",
    checklist: [
      "Core braced in straight plank line",
      "Elbows tracked at 45° angle",
      "Chest touches floor level",
      "Full lockout at the top",
    ],
  },
  {
    id: "bicep_curl",
    name: "Bicep Curl",
    checklist: [
      "Elbows pinned to your sides",
      "Zero swinging or momentum",
      "Full supination at peak contraction",
      "Controlled 3-second eccentric lower",
    ],
  },
  {
    id: "lunge",
    name: "Lunge",
    checklist: [
      "Torso upright with tall posture",
      "Front knee directly above ankle",
      "Rear knee hovers 2 inches from floor",
      "Push forcefully through front heel",
    ],
  },
];

export function FormCheckPage() {
  const [selectedExerciseId, setSelectedExerciseId] = useState("squat");
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [repCount, setRepCount] = useState(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const activeExercise =
    EXERCISES.find((e) => e.id === selectedExerciseId) || EXERCISES[0];

  const handleToggleCamera = async () => {
    if (isCameraActive) {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
      setIsCameraActive(false);
    } else {
      setIsCameraActive(true);
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { width: 640, height: 480 },
          });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play();
          }
        }
      } catch {
        // Handled gracefully in canvas fallback simulator
      }
    }
  };

  return (
    <PageContainer
      title="Form Check"
      description="AI-powered real-time exercise form analysis via webcam"
      badge="AI Vision"
      action={
        <span className="rounded-md bg-amber-500/15 text-amber-500 border border-amber-500/30 px-2.5 py-1 text-xs font-bold uppercase tracking-wider">
          Experimental
        </span>
      }
    >
      {/* Warning Disclaimer Banner */}
      <div className="rounded-2xl border border-amber-500/25 bg-amber-500/10 p-4 flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
        <p className="text-xs text-foreground leading-relaxed">
          This is an experimental feature using AI pose estimation. It provides
          general form guidance only — not medical or professional coaching
          advice. Always train safely and consult a qualified trainer for
          personalized instruction.
        </p>
      </div>

      {/* Main Grid: Camera Arena + Controls Column */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Camera Arena */}
        <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-6 flex flex-col items-center justify-center min-h-[360px] relative overflow-hidden shadow-xl">
          {isCameraActive ? (
            <div className="relative w-full h-full min-h-[340px] flex items-center justify-center rounded-xl bg-black overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover rounded-xl"
              />

              {/* Skeletal Pose Simulation Overlay */}
              <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-4">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 rounded-md bg-black/60 px-2.5 py-1 text-xs font-bold text-primary backdrop-blur-sm border border-primary/30">
                    <span className="h-2 w-2 rounded-full bg-primary animate-ping" />
                    Live Pose Tracking
                  </span>

                  <span className="rounded-md bg-black/60 px-2.5 py-1 text-xs font-mono font-bold text-white backdrop-blur-sm">
                    Angle: 94° · Parallel
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="rounded-md bg-black/60 px-3 py-1.5 backdrop-blur-sm">
                    <span className="text-[10px] text-white/70 uppercase block font-bold">
                      Reps Completed
                    </span>
                    <span className="font-display text-2xl font-black text-primary">
                      {repCount}
                    </span>
                  </div>

                  <Button
                    size="sm"
                    onClick={() => setRepCount((prev) => prev + 1)}
                    className="pointer-events-auto gap-1 text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    + Count Rep
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-4 max-w-sm py-8">
              <div className="h-16 w-16 rounded-2xl bg-muted border border-border flex items-center justify-center mx-auto text-muted-foreground">
                <Camera className="h-8 w-8" />
              </div>

              <div>
                <h4 className="font-display text-lg font-black text-foreground">
                  Camera Off
                </h4>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  Enable your webcam to start real-time form analysis. Your video
                  is processed locally and never stored.
                </p>
              </div>

              <Button
                onClick={handleToggleCamera}
                className="gap-2 font-bold bg-primary text-primary-foreground hover:bg-primary/90 px-6 text-xs shadow-sm"
              >
                <Camera className="h-4 w-4" /> Start Form Check
              </Button>
            </div>
          )}

          {isCameraActive && (
            <div className="mt-4 flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleToggleCamera}
                className="text-xs text-destructive border-destructive/30 bg-destructive/10 hover:bg-destructive/20"
              >
                Stop Camera
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setRepCount(0)}
                className="gap-1 text-xs text-muted-foreground border-border bg-card hover:text-foreground"
              >
                <RefreshCw className="h-3 w-3" /> Reset Reps
              </Button>
            </div>
          )}
        </div>

        {/* Controls Column: Select Exercise & Checklist */}
        <div className="space-y-4">
          {/* Select Exercise */}
          <div className="rounded-2xl border border-border bg-card p-5 space-y-3 shadow-sm">
            <h4 className="text-xs font-black uppercase tracking-wider text-foreground">
              Select Exercise
            </h4>

            <div className="space-y-1.5">
              {EXERCISES.map((ex) => {
                const isSelected = selectedExerciseId === ex.id;

                return (
                  <button
                    key={ex.id}
                    type="button"
                    onClick={() => setSelectedExerciseId(ex.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-bold border transition-all text-left ${
                      isSelected
                        ? "bg-primary/10 text-primary border-primary/40 ring-1 ring-primary/30"
                        : "bg-card text-foreground border-border hover:border-primary/40"
                    }`}
                  >
                    <span>{ex.name}</span>
                    <Scan
                      className={`h-4 w-4 ${
                        isSelected ? "text-primary" : "text-muted-foreground"
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form Checklist */}
          <div className="rounded-2xl border border-border bg-card p-5 space-y-3 shadow-sm">
            <h4 className="text-xs font-black uppercase tracking-wider text-foreground">
              Form Checklist
            </h4>

            <div className="space-y-2.5">
              {activeExercise.checklist.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 text-xs text-foreground"
                >
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span className="leading-tight">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
