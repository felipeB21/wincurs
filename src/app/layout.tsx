import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import Navbar from "@/components/navbar";
import ClientSessionProvider from "@/components/session-proivder";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Wincurs",
  description:
    "Explore and download community-created cursors. Share and upload your custom cursors, and receive tips to enhance your work.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ClientSessionProvider>
            <Toaster position="bottom-right" />
            <Navbar />
            <main className="mt-32 xl:px-40 px-10">{children}</main>
          </ClientSessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
