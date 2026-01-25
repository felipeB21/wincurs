import type { Metadata } from "next";
import { Geist, Geist_Mono, DM_Sans } from "next/font/google";
import "./globals.css";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebarServer from "@/components/server-sidebar";
import { Providers } from "@/components/provider";
import NextTopLoader from "nextjs-toploader";

const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Wincurs - Free Custom Cursors for Windows",
    template: "%s | Wincurs",
  },
  description: "Discover and download the best custom cursors for Windows. Browse thousands of unique mouse pointers created by the community. Free download for Windows 10 and 11.",
  keywords: ["custom cursors", "windows cursors", "mouse pointers", "cursor download", "cursor library", "windows 10", "windows 11", "anime cursors", "cute cursors"],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://wincurs.com",
    title: "Wincurs - Free Custom Cursors for Windows",
    description: "Discover and download the best custom cursors for Windows.",
    siteName: "Wincurs",
  },
  twitter: {
    card: "summary_large_image",
    title: "Wincurs - Free Custom Cursors for Windows",
    description: "Discover and download the best custom cursors for Windows.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} dark`}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextTopLoader showSpinner={false} color="oklch(0.645 0.246 16.439)" />
        <Providers>
          <SidebarProvider>
            <AppSidebarServer />
            <main className="p-2 w-full h-screen">
              <SidebarTrigger />
              <div className="p-2">{children}</div>
            </main>
          </SidebarProvider>
        </Providers>
      </body>
    </html>
  );
}
