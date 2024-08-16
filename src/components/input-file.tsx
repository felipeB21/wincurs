import { Input } from "@/components/ui/input";
import { forwardRef } from "react";

// Forward refs to properly handle the `ref` prop from react-hook-form
export const InputFile = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ onChange, onBlur, name, ...props }, ref) => (
  <div className="grid w-full max-w-sm items-center gap-1.5">
    <Input
      id={name}
      type="file"
      name={name}
      accept=".zip, .rar"
      onChange={onChange}
      onBlur={onBlur}
      ref={ref}
      {...props}
    />
  </div>
));

InputFile.displayName = "InputFile";
