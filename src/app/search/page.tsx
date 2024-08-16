"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { Heart, Download } from "lucide-react";
import CursorSkeleton from "@/components/cursor-skeleton";

interface User {
  id: string;
  username: string;
  image: string;
}

interface Cursor {
  id: string;
  cover: string;
  name: string;
  likes: number;
  download_count: number;
  user: User;
}

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";
  const [cursors, setCursors] = useState<Cursor[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (query) {
      const fetchData = async () => {
        try {
          const res = await axios.get(`/api/search`, {
            params: { query },
          });
          setCursors(res.data.cursors || []);
        } catch (error) {
          console.error("Error fetching search results:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();
    } else {
      setCursors([]);
      setIsLoading(false);
    }
  }, [query]);

  if (isLoading) return <CursorSkeleton />;

  if (cursors.length === 0)
    return (
      <div className="flex flex-col items-center justify-center h-[60dvh] text-xl">
        <p>{`:(`}</p>
        <span>No cursors found</span>
      </div>
    );

  return (
    <div>
      <ul className="grid xl:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-2">
        {cursors.map((cur) => (
          <li key={cur.id} className="relative group">
            <Link
              href={`/cursor/${cur.id}`}
              className="border block rounded-md"
            >
              <div className="relative">
                <Image
                  priority
                  src={cur.cover}
                  alt={cur.name}
                  width={400}
                  height={400}
                  className="object-cover w-auto h-auto"
                />
                <div className="absolute inset-0 dark:bg-stone-800/80 flex items-end justify-between gap-5 bg-stone-500/80 bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white p-4 rounded-md">
                  <div className="flex flex-col gap-2">
                    <h3 className="text-lg font-bold">{cur.name}</h3>
                    <div className="flex items-center gap-1 p-1">
                      <Image
                        className="rounded-full"
                        src={cur.user.image}
                        alt={cur.user.username}
                        width={32}
                        height={32}
                      />
                      <p className="text-sm">{cur.user.username}</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1">
                      <p>{cur.download_count || 0}</p>
                      <Download className="w-4 h-4" />
                    </div>
                    <div className="flex items-center gap-1">
                      <p>{cur.likes || 0}</p>
                      <Heart className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
