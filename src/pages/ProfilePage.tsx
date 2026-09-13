import { User as UserIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAppSelector } from "@/app/hooks";

export function ProfilePage() {
  const profile = useAppSelector((state) => state.user.profile);

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-[#71717A]">
          Account
        </span>
        <h1 className="font-display text-3xl font-black uppercase text-white">
          Athlete Profile
        </h1>
      </div>

      <Card className="p-6">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-[#1A1A1F] border-2 border-[#C8FF47] flex items-center justify-center text-[#C8FF47]">
            <UserIcon className="h-8 w-8" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display text-2xl font-bold uppercase text-white">
                {profile?.name || "Alex Morgan"}
              </h2>
              <Badge variant="default">{profile?.fitnessLevel || "Intermediate"}</Badge>
            </div>
            <p className="text-xs text-[#71717A] mt-0.5">{profile?.email || "alex@fitsync.ai"}</p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-3">
        <Card className="p-4">
          <span className="text-xs font-semibold text-[#71717A]">Height</span>
          <p className="font-display text-2xl font-black text-white mt-1">
            {profile?.height || 175} cm
          </p>
        </Card>

        <Card className="p-4">
          <span className="text-xs font-semibold text-[#71717A]">Weight</span>
          <p className="font-display text-2xl font-black text-white mt-1">
            {profile?.weight || 70} kg
          </p>
        </Card>
      </div>
    </div>
  );
}
