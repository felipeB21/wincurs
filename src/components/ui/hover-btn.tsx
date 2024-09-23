import { Plus } from "lucide-react";
import { Button } from "./button";

export default function HoverBtn() {
  return (
    <Button variant="outline" className="flex items-center gap-2">
      Submit Cursor <Plus className="w-4 h-4" />
    </Button>
  );
}
