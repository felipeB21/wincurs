"use client";

import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import { z } from "zod";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "@/components/ui/label";
import Google from "./google";
import { Turnstile } from "@marsidev/react-turnstile";


const signInSchema = z.object({
  email: z.email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters").max(50),
});

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  const handleSubmit = async () => {
    setError(null);

    const parsed = signInSchema.safeParse({
      email,
      password,
    });

    if (!parsed.success) {
      setError(parsed.error.issues[0].message);
      return;
    }

    if (!captchaToken) {
      setError("Please complete the captcha");
      return;
    }

    setLoading(true);

    await authClient.signIn.email(
      {
        email,
        password,
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
        fetchOptions: {
          headers: {
            "x-captcha-response": captchaToken,
          },
        },
      }
    );
  };

  return (
    <div>
      <form action={handleSubmit} className="flex flex-col gap-3 max-w-sm">
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

        <div className="flex justify-center">
            <Turnstile
                siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
                onError={() => setCaptchaToken('error')}
      onExpire={() => setCaptchaToken('expired')}
      onSuccess={() => setCaptchaToken('solved')}
            />
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <Button type="submit" disabled={loading} aria-busy={loading}>
          {loading ? "Entering account..." : "Sign in"}
        </Button>
      </form>
      <Google />
    </div>
  );
}
