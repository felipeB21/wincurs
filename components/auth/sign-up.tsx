"use client";

import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import { z } from "zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { randomUserImage } from "@/lib/avatar";
import { Label } from "@/components/ui/label";
import Google from "./google";

const signUpSchema = z.object({
  name: z.string().min(2).max(50),
  username: z.string().min(2).max(100),
  email: z.email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters").max(50),
});

export default function SignUp() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setError(null);

    const parsed = signUpSchema.safeParse({
      name,
      username,
      email,
      password,
    });

    if (!parsed.success) {
      setError(parsed.error.issues[0].message);
      return;
    }

    setLoading(true);

    await authClient.signUp.email(
      {
        email,
        password,
        name,
        username,
        image: randomUserImage(),
      },
      {
        onRequest: () => {
          setLoading(true);
        },
        onSuccess: () => {
          setLoading(false);
          window.location.reload();
        },
        onError: (ctx) => {
          setLoading(false);
          setError(ctx.error.message);
        },
      }
    );
  };

  return (
    <div>
      <form action={handleSubmit} className="flex flex-col gap-3 max-w-sm">
        <div className="flex items-center gap-2">
          <div className="w-full">
            <Label htmlFor="name" className="mb-1">
              Name
            </Label>
            <Input
              id="name"
              placeholder="Jhon"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="w-full">
            <Label htmlFor="username" className="mb-1">
              Username
            </Label>
            <Input
              id="username"
              placeholder="@jhon62"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
        </div>
        <div>
          <Label htmlFor="email" className="mb-1">
            Email
          </Label>
          <Input
            id="email"
            placeholder="jhon@example.com"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="password" className="mb-1">
            Password
          </Label>
          <Input
            id="password"
            placeholder="********"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <Button type="submit" disabled={loading} aria-busy={loading}>
          {loading ? "Creating account..." : "Sign up"}
        </Button>
      </form>
      <Google />
    </div>
  );
}
