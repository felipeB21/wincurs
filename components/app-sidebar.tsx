// components/app-sidebar.client.tsx
"use client";

import {
  HouseIcon,
  MagnifyingGlassIcon,
  BinocularsIcon,
  FireIcon,
  UsersIcon,
  GearIcon,
  CoinVerticalIcon,
} from "@phosphor-icons/react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import NavSession from "./auth/nav-session";
import { usePathname } from "next/navigation";
import { Separator } from "./ui/separator";

const ITEMS = [
  { title: "Home", url: "/", icon: HouseIcon },
  { title: "Search", url: "/search", icon: MagnifyingGlassIcon },
  { title: "Explore", url: "/explore", icon: BinocularsIcon },
  { title: "Popular", url: "/popular", icon: FireIcon },
  { title: "Top Creators", url: "/top-creators", icon: UsersIcon },
];

const PRIVATE_ITEMS = [
  { title: "Pricing", url: "/pricing", icon: CoinVerticalIcon },
  { title: "Settings", url: "/settings", icon: GearIcon },
];

export function AppSidebar({
  user,
}: {
  user?: {
    username?: string | null;
    name: string | null;
    image: string | null;
  };
}) {
  const pathname = usePathname();
  return (
    <Sidebar variant="floating">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>wincurs</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {ITEMS.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link
                      href={item.url}
                      className={`${
                        pathname == item.url ? "text-primary font-bold" : ""
                      }`}
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
            <Separator className="my-2" />
            <SidebarMenu>
              {PRIVATE_ITEMS.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link
                      href={item.url}
                      className={`${
                        pathname == item.url ? "text-primary font-bold" : ""
                      }`}
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavSession user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
