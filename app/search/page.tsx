// app/search/page.tsx
import { Metadata } from "next";
import SearchClient from "./search-client";

export const metadata: Metadata = {
  title: "Search - wincurs",
  description: "Encuentra los mejores cursores personalizados.",
};

export default function Page() {
  return <SearchClient />;
}
