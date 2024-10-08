"use client";
import AvatarUser from "@/components/avatar-user";
import ProfileSkeleton from "@/components/profile-skeleton";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface UserData {
  username: string;
  image: string;
}

export default function UserPage() {
  const router = useParams();
  const { username } = router;

  const user = username.at(0);

  const [userData, setUserData] = useState<UserData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch(`/api/profile/${user}`);

        if (!res.ok) {
          throw new Error("User not found");
        }
        const data: UserData = await res.json();
        setUserData(data);
      } catch (error) {
        setError((error as Error).message);
      }
    };

    fetchUserData();
  }, [user, username]);

  if (error) {
    return <div className="center">{error}</div>;
  }

  if (!userData) {
    return (
      <div className="flex items-center justify-center">
        <ProfileSkeleton />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center">
      <div className="flex flex-col items-center justify-center gap-3">
        <AvatarUser
          w="w-16"
          h="h-16"
          image={userData.image}
          name={userData.username}
        />
        <p className="font-medium">{userData.username}</p>
      </div>
    </div>
  );
}
