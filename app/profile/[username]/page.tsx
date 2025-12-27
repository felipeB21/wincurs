import { getSession } from "@/lib/auth-server";
import ProfileClient from "../../../components/auth/profile-client";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ username: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const username = (await params).username;

  return {
    title: `${username} - wincurs`,
    description: `Profile of ${username}, explore their cursors and collections.`,
  };
}

export default async function ProfilePage({ params }: Props) {
  const username = (await params).username;
  const session = await getSession();

  const isOwner = session?.user?.username === username;

  return <ProfileClient username={username} isOwner={isOwner} />;
}
