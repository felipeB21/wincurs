"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { Heart, Download } from "lucide-react";
import CursorIdSkeleton from "@/components/cursor-id-skeleton";

interface User {
  id: string;
  username: string;
  image: string;
}

interface Cursor {
  id: string;
  cover: string;
  name: string;
  file: string;
  price?: number;
  likes: number;
  download_count: number;
  user: User;
}

export default function CursorIdPage() {
  const params = useParams();
  const id = params?.id;

  const [cursor, setCursor] = useState<Cursor | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      try {
        const cursorRes = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/cursor/${id}`
        );
        setCursor(cursorRes.data);

        const userRes = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/current-user`
        );
        setCurrentUserId(userRes.data.id);
      } catch (error) {
        setError(error as string);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleDownload = async () => {
    if (!cursor || !currentUserId) return;

    try {
      // Record the download in the database
      await axios.put(`/api/download/${cursor.id}`, null, {
        headers: {
          "user-id": currentUserId,
        },
      });

      // Trigger file download
      const link = document.createElement("a");
      link.href = cursor.file; // Ensure this URL points to the actual file
      link.download = cursor.file.split("/").pop() || "download"; // Use the filename from URL or a default name
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading cursor:", error);
    }
  };

  const handleDelete = async () => {
    if (!id || !cursor) return;

    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/delete/${id}`);
      window.location.href = "/";
    } catch (error) {
      console.error("Error deleting cursor:", error);
    }
  };

  if (isLoading) return <CursorIdSkeleton />;

  if (!cursor) return <p>{error}</p>;

  if (error) return <p>{error}</p>;
  console.log(cursor);

  return (
    <div className="flex items-center justify-center p-4">
      <div>
        <h1 className="text-2xl font-bold mb-4">{cursor.name}</h1>
        <Image
          priority
          src={cursor.cover}
          alt={cursor.name}
          width={400}
          height={400}
          className="object-cover w-auto h-auto"
        />
        <div className="mt-4">
          <p className="text-sm">
            Uploaded by{" "}
            <Link href={`/profile/${cursor.user.username}`}>
              <span className="text-green-500 hover:underline">
                {cursor.user.username}
              </span>
            </Link>
          </p>
          <div className="flex items-center gap-3 mt-5 w-max">
            <button
              onClick={handleDownload}
              className="flex items-center gap-1 hover:text-green-400"
            >
              <p>{cursor.download_count || 0}</p>
              <Download className="w-4 h-4" />
            </button>
            <button className="flex items-center gap-1 hover:text-green-400">
              <p>{cursor.likes || 0}</p>
              <Heart className="w-4 h-4" />
            </button>
          </div>
          {currentUserId === cursor.user.id && (
            <button
              onClick={handleDelete}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Delete Cursor
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
