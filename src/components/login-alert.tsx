import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { signIn } from "../../auth";
import { LogIn } from "lucide-react";
import GoogleIcon from "./icons/google";

export default function LoginAlert() {
  return (
    <AlertDialog>
      <AlertDialogTrigger className="dark:bg-stone-700/70 bg-stone-300/70 py-2 px-4 rounded dark:hover:bg-stone-600/70 hover:bg-stone-400/70">
        Sign in
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-3">
            <LogIn className="dark:bg-stone-700/50 bg-stone-200/50 p-2 rounded-full w-8 h-8" />
            Welcome to AI Emojis
          </AlertDialogTitle>
          <AlertDialogDescription>
            Sign in for unlimeted acces, ability to save your emojis, and access
            them from your device.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <form
            className="dark:bg-stone-800 dark:hover:bg-stone-700/70 bg-stone-300 hover:bg-stone-400/70 flex items-center w-full rounded-md"
            action={async () => {
              "use server";
              await signIn("google");
            }}
          >
            <button
              type="submit"
              className="w-full h-full flex items-center justify-center gap-2"
            >
              <GoogleIcon />
              Continue with Google
            </button>
          </form>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
