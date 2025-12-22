import { getSession } from "@/lib/auth-server";
import { AppSidebar } from "./app-sidebar";

export default async function AppSidebarServer() {
  const session = await getSession();

  const user = session?.user
    ? {
        username: session.user.username ?? null,
        name: session.user.name ?? null,
        image: session.user.image ?? null,
        tier: session.user.tier ?? null,
      }
    : undefined;

  return <AppSidebar user={user} />;
}
