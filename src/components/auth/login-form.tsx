"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as z from "zod";
import { ApiError } from "@/lib/api";
import { useSession } from "@/components/auth/session-provider";
import { FormField } from "@/components/shared/form-field";

const loginSchema = z.object({
  email: z.email({ error: "Enter a valid email address." }),
  password: z.string().min(1, { error: "Enter your password." }),
});

type FieldErrors = { email?: string; password?: string };

export function LoginForm() {
  const router = useRouter();
  const { status, login } = useSession();
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [pending, setPending] = useState(false);

  // Covers both a fresh login and someone who is already logged in.
  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/");
    }
  }, [status, router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    const input = {
      email: String(data.get("email") ?? "").trim(),
      password: String(data.get("password") ?? ""),
    };

    const result = loginSchema.safeParse(input);
    if (!result.success) {
      const flat = z.flattenError(result.error).fieldErrors;
      setFieldErrors({
        email: flat.email?.[0],
        password: flat.password?.[0],
      });
      setFormErrors([]);
      return;
    }

    setFieldErrors({});
    setFormErrors([]);
    setPending(true);

    try {
      await login(result.data);
    } catch (error) {
      setFormErrors(
        error instanceof ApiError
          ? error.messages
          : ["Something went wrong. Please try again."],
      );
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="max-w-md space-y-6">
      {formErrors.length > 0 && (
        <div role="alert" className="border border-error px-4 py-3 text-error">
          {formErrors.map((message) => (
            <p key={message}>{message}</p>
          ))}
        </div>
      )}

      <FormField
        name="email"
        label="Email"
        type="email"
        autoComplete="email"
        placeholder="you@example.com"
        error={fieldErrors.email}
      />

      <FormField
        name="password"
        label="Password"
        type="password"
        autoComplete="current-password"
        placeholder="Your password"
        error={fieldErrors.password}
      />

      <button
        type="submit"
        disabled={pending}
        className="label-caps inline-flex cursor-pointer items-center justify-center bg-lime px-6 py-3.5 text-ink hover:bg-lime-400 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Logging in…" : "Log in"}
      </button>

      <p className="text-stone-text">
        No account yet?{" "}
        <Link href="/signup" className="text-ink underline-offset-4 hover:cursor hover:bg-lime px-2 py-2">
          Create one
        </Link>
      </p>
    </form>
  );
}
