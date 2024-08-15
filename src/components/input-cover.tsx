import { Input } from "@/components/ui/input";
import { forwardRef } from "react";

export const InputCover = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ onChange, onBlur, name, ...props }, ref) => (
  <div className="grid w-full max-w-sm items-center gap-1.5">
    <Input
      id={name}
      type="file"
      name={name}
      accept="image/*"
      onChange={onChange}
      onBlur={onBlur}
      ref={ref}
      {...props}
    />
  </div>
));

InputCover.displayName = "InputCover";
