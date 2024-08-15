import { LogOut, Settings, User } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { auth } from "../../auth";
import { signOut } from "../../auth";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import AvatarUser from "./avatar-user";
import LoginAlert from "./login-alert";
import Link from "next/link";
import ChangeUsernameAlert from "./change-username-alert";

export async function DropdownMenuNav() {
  const session = await auth();

  if (!session) {
    return <LoginAlert />;
  }

  return (
    <div className="py-1">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <AvatarUser
            image={session?.user?.image as string}
            name={session?.user?.name as string}
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <Link href={`/profile/${session?.user?.username}`}>
                <div className="flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </div>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent className="flex flex-col gap-1">
                <ChangeUsernameAlert username={session.user.username} />
                <ThemeToggle />
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <form
              action={async (formData) => {
                "use server";
                await signOut();
              }}
            >
              <button
                type="submit"
                className="flex items-center w-full cursor-default"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sign out</span>
              </button>
            </form>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
