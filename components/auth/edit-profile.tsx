import { getSession } from "@/lib/auth-server";
import EditProfileClient from "./edit-profile-client";

export default async function EditProfile() {
  const session = await getSession();
  if (!session) return;

  return (
    <EditProfileClient
      userId={session.user.id}
      image={session.user.image as string}
      name={session.user.name}
      username={session.user.username as string}
      tier={session.user.tier}
    />
  );
}
