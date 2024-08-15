"use client";
import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();

  const renderIcon = () => {
    switch (theme) {
      case "dark":
        return <Moon className="h-[1rem] w-[1rem]" />;
      case "light":
        return <Sun className="h-[1rem] w-[1rem]" />;
      case "system":
        return <Monitor className="h-[1rem] w-[1rem]" />;
      default:
        return <Sun className="h-[1rem] w-[1rem]" />;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2 w-full">
          {renderIcon()}
          <p className="text-xs">Theme</p>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          <div className="flex items-center gap-2">
            <Sun className="h-[1rem] w-[1rem]" />
            <p className="text-sm">Light</p>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          <div className="flex items-center gap-2">
            <Moon className="h-[1rem] w-[1rem]" />
            <p className="text-sm">Dark</p>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          <div className="flex items-center gap-2">
            <Monitor className="h-[1rem] w-[1rem]" />
            <p className="text-sm">System</p>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
