"use server";
import { headers } from "next/headers";
import { auth } from "./auth";

export async function getSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return session;
}

export async function updateAvatar(newAvatar: string) {
  await auth.api.updateUser({
    headers: await headers(),
    body: {
      image: newAvatar,
    },
  });
}

export async function updateUser(name: string, username: string) {
  try {
    await auth.api.updateUser({
      headers: await headers(),
      body: {
        name,
        username,
      },
    });
  } catch (err) {
    throw err;
  }
}
