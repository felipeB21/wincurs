"use client";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import axios from "axios";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";

  useEffect(() => {
    if (query) {
      const fetchData = async () => {
        try {
          const res = await axios.get(`/api/search`, {
            params: { query },
          });
          console.log(res.data);
        } catch (error) {
          console.error("Error fetching search results:", error);
        }
      };
      fetchData();
    }
  }, [query]);

  return <div></div>;
}
