import { useState } from "react";
import { useAppDispatch } from "@/app/hooks";
import { logWeightEntry } from "@/features/progress/progressSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Scale, X, Check, Calendar, Activity } from "lucide-react";

interface LogWeightModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LogWeightModal({ isOpen, onClose }: LogWeightModalProps) {
  const dispatch = useAppDispatch();

  const [weight, setWeight] = useState("69.6");
  const [date, setDate] = useState("Today");
  const [bodyFat, setBodyFat] = useState("16.2");
  const [notes, setNotes] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedWeight = parseFloat(weight);
    if (isNaN(parsedWeight) || parsedWeight <= 0) return;

    const parsedBf = bodyFat ? parseFloat(bodyFat) : undefined;

    dispatch(
      logWeightEntry({
        weight: parsedWeight,
        bodyFatPercent: isNaN(parsedBf as number) ? undefined : parsedBf,
        notes: notes.trim() || undefined,
        date: date.trim() || "Today",
      })
    );

    onClose();
  };

  return (
    <div
      id="log-weight-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-md rounded-3xl bg-[#121216] border border-[#2A2A36] p-6 shadow-2xl overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#C8FF47]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-[#C8FF47]/10 text-[#C8FF47] border border-[#C8FF47]/20 flex items-center justify-center">
              <Scale className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-display text-lg font-bold text-white uppercase tracking-wide">
                Log New Weigh-In
              </h3>
              <p className="text-xs text-[#71717A]">
                Record your biometrics to update trend velocity
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="h-8 w-8 rounded-lg bg-[#181820] text-[#71717A] hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Weight */}
          <div>
            <label className="text-xs font-mono font-bold uppercase text-[#A1A1AA] block mb-1.5 flex items-center gap-1.5">
              <Scale className="h-3.5 w-3.5 text-[#C8FF47]" /> Weight (kg) *
            </label>
            <Input
              id="input-weight-kg"
              type="number"
              step="0.1"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="e.g. 69.6"
              className="bg-[#181820] border-[#2A2A36] text-white font-mono text-base font-bold focus:border-[#C8FF47]"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Body Fat % */}
            <div>
              <label className="text-xs font-mono font-bold uppercase text-[#A1A1AA] block mb-1.5 flex items-center gap-1.5">
                <Activity className="h-3.5 w-3.5 text-[#C8FF47]" /> Body Fat %
              </label>
              <Input
                id="input-bodyfat"
                type="number"
                step="0.1"
                value={bodyFat}
                onChange={(e) => setBodyFat(e.target.value)}
                placeholder="e.g. 16.2"
                className="bg-[#181820] border-[#2A2A36] text-white font-mono text-xs focus:border-[#C8FF47]"
              />
            </div>

            {/* Date */}
            <div>
              <label className="text-xs font-mono font-bold uppercase text-[#A1A1AA] block mb-1.5 flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-[#C8FF47]" /> Date Label
              </label>
              <Input
                id="input-date-label"
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="Today, Sep 13"
                className="bg-[#181820] border-[#2A2A36] text-white font-mono text-xs focus:border-[#C8FF47]"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-xs font-mono font-bold uppercase text-[#A1A1AA] block mb-1.5">
              Notes (Optional)
            </label>
            <Input
              id="input-weight-notes"
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Morning fasted state, post-hydration"
              className="bg-[#181820] border-[#2A2A36] text-white text-xs focus:border-[#C8FF47]"
            />
          </div>

          {/* Actions */}
          <div className="pt-2 flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="w-1/2 border-[#2A2A36] bg-[#181820] text-white hover:bg-[#22222C]"
            >
              Cancel
            </Button>
            <Button
              id="submit-log-weight-btn"
              type="submit"
              className="w-1/2 bg-[#C8FF47] text-black font-black uppercase hover:bg-[#b5f030] shadow-[0_0_15px_rgba(200,255,71,0.25)] flex items-center justify-center gap-1.5"
            >
              <Check className="h-4 w-4 stroke-[3]" /> Save Entry
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
