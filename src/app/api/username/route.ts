import { db } from "@/lib/db";
import { auth } from "../../../../auth";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session?.user.id;

  if (!userId) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const body = await req.json();
  const { newUsername } = body;

  if (!newUsername || newUsername.length < 3 || newUsername.length > 15) {
    return NextResponse.json(
      { error: "Username must be between 3 and 15 characters" },
      { status: 400 }
    );
  }

  if (/\s/.test(newUsername)) {
    return NextResponse.json(
      { error: "Username cannot contain spaces" },
      { status: 400 }
    );
  }

  const existingUser = await db.user.findUnique({
    where: { username: newUsername },
  });

  if (existingUser) {
    return NextResponse.json(
      { error: "Username already taken" },
      { status: 409 }
    );
  }

  const user = await db.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const thirtyDays = 30 * 24 * 60 * 60 * 1000;
  const now = new Date();

  if (user.lastUsernameChange) {
    const lastChangeDate = new Date(user.lastUsernameChange);
    const timeSinceLastChange = now.getTime() - lastChangeDate.getTime();

    if (timeSinceLastChange < thirtyDays) {
      const remainingTime = thirtyDays - timeSinceLastChange;
      const remainingDays = Math.ceil(remainingTime / (24 * 60 * 60 * 1000));

      return NextResponse.json(
        {
          error: `You can change your username again in ${remainingDays} day(s).`,
        },
        { status: 403 }
      );
    }
  }

  try {
    const updatedUser = await db.user.update({
      where: { id: userId },
      data: {
        username: newUsername,
        lastUsernameChange: now,
      },
    });

    return NextResponse.json(
      { message: "Username updated successfully", user: updatedUser },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update username" },
      { status: 500 }
    );
  }
}
