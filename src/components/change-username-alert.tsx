"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { AtSign } from "lucide-react";

interface ChangeUsernameAlertProps {
  username: string;
}

export default function ChangeUsernameAlert({
  username,
}: ChangeUsernameAlertProps) {
  const { update } = useSession();
  const [newUsername, setNewUsername] = useState(username || "");

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewUsername(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch("/api/username", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newUsername }),
      });

      if (response.ok) {
        update();
        toast.success("Username updated!");
        window.location.reload();
      } else {
        const errorData = await response.json();
        toast.error(errorData.error);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger className="text-xs font-medium flex items-center justify-center w-full border rounded-md py-3 px-2 dark:hover:bg-stone-800 hover:bg-stone-100">
        <AtSign className="mr-2 h-4 w-4" />
        Update Username
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-3">
            <AtSign className="dark:bg-stone-700/50 bg-stone-200/50 p-2 rounded-full w-8 h-8" />{" "}
            Update Username
          </AlertDialogTitle>
          <AlertDialogDescription>
            Your username should be between 3 to 15 characters long and can
            include lowercase letters, numbers and underscores.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <input
            className="w-full rounded-md px-2"
            type="text"
            placeholder="Username"
            value={newUsername}
            onChange={handleUsernameChange}
          />
          <AlertDialogAction onClick={handleSubmit}>Update</AlertDialogAction>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
