// components/ClientSessionProvider.tsx
import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";

interface ClientSessionProviderProps {
  children: React.ReactNode;
}

export default function ClientSessionProvider({
  children,
}: ClientSessionProviderProps) {
  return <NextAuthSessionProvider>{children}</NextAuthSessionProvider>;
}
