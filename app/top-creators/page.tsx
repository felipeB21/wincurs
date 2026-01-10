import { Metadata } from "next";
import TopCreatorsClient from "./creators-client";

export const metadata: Metadata = {
  title: "Top Creators - wincurs",
  description: "Encuentra los mejores cursores personalizados.",
};

export default function Page() {
  return <TopCreatorsClient />;
}
