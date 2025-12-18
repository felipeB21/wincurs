"use server";

import { getSession } from "@/lib/auth-server";
import ProfileClient from "../../../components/auth/profile-client";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const session = await getSession();

  const isOwner = Boolean(session?.user && session.user.username === username);

  return <ProfileClient username={username} isOwner={isOwner} />;
}
