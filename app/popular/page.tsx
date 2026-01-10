import { Metadata } from "next";
import PopularClient from "./popular-client";

export const metadata: Metadata = {
  title: "Popular - wincurs",
  description: "Encuentra los mejores cursores personalizados.",
};

export default function Page() {
  return <PopularClient />;
}
