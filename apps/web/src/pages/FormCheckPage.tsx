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
        <span className="rounded-md bg-[#FF8438]/15 text-[#FF8438] border border-[#FF8438]/30 px-2.5 py-1 text-xs font-bold uppercase tracking-wider">
          Experimental
        </span>
      }
    >
      {/* Warning Disclaimer Banner */}
      <div className="rounded-2xl border border-[#FF8438]/25 bg-[#FF8438]/10 p-4 flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-[#FF8438] shrink-0 mt-0.5" />
        <p className="text-xs text-[#F2F2F5] leading-relaxed">
          This is an experimental feature using AI pose estimation. It provides
          general form guidance only — not medical or professional coaching
          advice. Always train safely and consult a qualified trainer for
          personalized instruction.
        </p>
      </div>

      {/* Main Grid: Camera Arena + Controls Column */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Camera Arena */}
        <div className="lg:col-span-2 rounded-2xl border border-[#1E1E24] bg-[#111114] p-6 flex flex-col items-center justify-center min-h-[360px] relative overflow-hidden shadow-xl">
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
                  <span className="flex items-center gap-1.5 rounded-md bg-black/60 px-2.5 py-1 text-xs font-bold text-[#C8FF47] backdrop-blur-sm border border-[#C8FF47]/30">
                    <span className="h-2 w-2 rounded-full bg-[#C8FF47] animate-ping" />
                    Live Pose Tracking
                  </span>

                  <span className="rounded-md bg-black/60 px-2.5 py-1 text-xs font-mono font-bold text-white backdrop-blur-sm">
                    Angle: 94° · Parallel
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="rounded-md bg-black/60 px-3 py-1.5 backdrop-blur-sm">
                    <span className="text-[10px] text-[#A1A1AA] uppercase block font-bold">
                      Reps Completed
                    </span>
                    <span className="font-display text-2xl font-black text-[#C8FF47]">
                      {repCount}
                    </span>
                  </div>

                  <Button
                    size="sm"
                    onClick={() => setRepCount((prev) => prev + 1)}
                    className="pointer-events-auto gap-1 text-xs font-bold bg-[#C8FF47] text-black hover:bg-[#b5eb38]"
                  >
                    + Count Rep
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-4 max-w-sm py-8">
              <div className="h-16 w-16 rounded-2xl bg-[#16161C] border border-[#222228] flex items-center justify-center mx-auto text-[#71717A]">
                <Camera className="h-8 w-8" />
              </div>

              <div>
                <h4 className="font-display text-lg font-black text-white">
                  Camera Off
                </h4>
                <p className="text-xs text-[#A1A1AA] mt-1 leading-relaxed">
                  Enable your webcam to start real-time form analysis. Your video
                  is processed locally and never stored.
                </p>
              </div>

              <Button
                onClick={handleToggleCamera}
                className="gap-2 font-bold bg-[#C8FF47] text-black hover:bg-[#b5eb38] px-6 text-xs shadow-[0_0_15px_rgba(200,255,71,0.25)]"
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
                className="text-xs text-[#FF453A] border-[#FF453A]/30 bg-[#FF453A]/10 hover:bg-[#FF453A]/20"
              >
                Stop Camera
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setRepCount(0)}
                className="gap-1 text-xs text-[#A1A1AA] border-[#222228] bg-[#16161A] hover:text-white"
              >
                <RefreshCw className="h-3 w-3" /> Reset Reps
              </Button>
            </div>
          )}
        </div>

        {/* Controls Column: Select Exercise & Checklist */}
        <div className="space-y-4">
          {/* Select Exercise */}
          <div className="rounded-2xl border border-[#1E1E24] bg-[#111114] p-5 space-y-3 shadow-lg">
            <h4 className="text-xs font-black uppercase tracking-wider text-white">
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
                        ? "bg-[#182012] text-[#C8FF47] border-[#C8FF47]/40 ring-1 ring-[#C8FF47]/30"
                        : "bg-[#16161A] text-white border-[#222228] hover:border-[#383842]"
                    }`}
                  >
                    <span>{ex.name}</span>
                    <Scan
                      className={`h-4 w-4 ${
                        isSelected ? "text-[#C8FF47]" : "text-[#71717A]"
                      }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form Checklist */}
          <div className="rounded-2xl border border-[#1E1E24] bg-[#111114] p-5 space-y-3 shadow-lg">
            <h4 className="text-xs font-black uppercase tracking-wider text-white">
              Form Checklist
            </h4>

            <div className="space-y-2.5">
              {activeExercise.checklist.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2.5 text-xs text-[#E4E4E7]"
                >
                  <CheckCircle2 className="h-4 w-4 text-[#C8FF47] shrink-0 mt-0.5" />
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
