import { Plus } from "lucide-react";

export default function HoverBtn() {
  return (
    <button className="group relative py-[7.5px] overflow-hidden rounded bg-green-500 px-3 text-neutral-50 transition hover:bg-green-600">
      <span className="relative flex items-center gap-1 text-sm">
        Submit <Plus className="w-4 h-4" />
      </span>
      <div className="animate-shine-infinite absolute inset-0 -top-[20px] flex h-[calc(100%+40px)] w-full justify-center blur-[12px]">
        <div className="relative h-full w-8 bg-white/10"></div>
      </div>
    </button>
  );
}
