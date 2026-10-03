import { useAppDispatch, useAppSelector } from "@/app/hooks";
import {
  setSelectedCategory,
  setSearchQuery,
} from "@/features/videos/videosSlice";
import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function VideoCategoryFilters() {
  const dispatch = useAppDispatch();
  const { selectedCategory, searchQuery, items } = useAppSelector(
    (state) => state.videos
  );

  const categories = [
    { key: "all", label: "All Sessions" },
    { key: "hiit", label: "HIIT" },
    { key: "strength", label: "Strength" },
    { key: "mobility", label: "Mobility" },
    { key: "yoga", label: "Yoga" },
    { key: "cardio", label: "Cardio" },
    { key: "core", label: "Core" },
  ] as const;

  const getCount = (cat: string) => {
    if (cat === "all") return items.length;
    return items.filter((v) => v.category === cat).length;
  };

  return (
    <div className="space-y-3" id="video-filters-container">
      {/* Search Bar */}
      <div className="relative w-full">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#71717A]" />
        <Input
          id="video-search-input"
          type="text"
          placeholder="Search guided routines, coaches, or equipment (e.g. HIIT, Kettlebell, Marcus)..."
          value={searchQuery}
          onChange={(e) => dispatch(setSearchQuery(e.target.value))}
          className="pl-10 pr-4 py-2.5 bg-[#121216] border-[#222228] text-white text-xs placeholder:text-[#52525B] focus:border-[#C8FF47] rounded-2xl"
        />
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        <SlidersHorizontal className="h-4 w-4 text-[#71717A] mr-1 flex-shrink-0" />
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.key;
          const count = getCount(cat.key);

          return (
            <button
              key={cat.key}
              id={`video-cat-btn-${cat.key}`}
              type="button"
              onClick={() => dispatch(setSelectedCategory(cat.key))}
              className={cn(
                "flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all whitespace-nowrap border",
                isSelected
                  ? "bg-[#C8FF47] text-black border-[#C8FF47] shadow-[0_0_15px_rgba(200,255,71,0.25)]"
                  : "bg-[#121216] text-[#A1A1AA] border-[#222228] hover:border-[#33333E] hover:text-white"
              )}
            >
              <span>{cat.label}</span>
              <span
                className={cn(
                  "text-[10px] px-1.5 py-0.2 rounded-md font-bold",
                  isSelected
                    ? "bg-black/15 text-black"
                    : "bg-[#1C1C24] text-[#71717A]"
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
