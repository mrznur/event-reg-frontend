"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as z from "zod";
import { ApiError } from "@/lib/api";
import { useSession } from "@/components/auth/session-provider";
import { FormField } from "@/components/shared/form-field";

const signupSchema = z.object({
  name: z
    .string()
    .min(2, { error: "Enter your name (at least 2 characters)." })
    .max(80, { error: "Name must be 80 characters or fewer." }),
  email: z.email({ error: "Enter a valid email address." }),
  password: z
    .string()
    .min(8, { error: "Password must be at least 8 characters." })
    .max(72, { error: "Password must be 72 characters or fewer." }),
});

type FieldErrors = { name?: string; email?: string; password?: string };

export function SignupForm() {
  const router = useRouter();
  const { status, signup } = useSession();
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formErrors, setFormErrors] = useState<string[]>([]);
  const [pending, setPending] = useState(false);

  // Covers both a fresh signup and someone who is already logged in.
  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/");
    }
  }, [status, router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    const input = {
      name: String(data.get("name") ?? "").trim(),
      email: String(data.get("email") ?? "").trim(),
      password: String(data.get("password") ?? ""),
    };

    const result = signupSchema.safeParse(input);
    if (!result.success) {
      const flat = z.flattenError(result.error).fieldErrors;
      setFieldErrors({
        name: flat.name?.[0],
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
      await signup(result.data);
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
        name="name"
        label="Full name"
        type="text"
        autoComplete="name"
        error={fieldErrors.name}
      />

      <FormField
        name="email"
        label="Email"
        type="email"
        autoComplete="email"
        error={fieldErrors.email}
      />

      <FormField
        name="password"
        label="Password"
        type="password"
        autoComplete="new-password"
        hint="8 to 72 characters."
        error={fieldErrors.password}
      />

      <button
        type="submit"
        disabled={pending}
        className="label-caps rounded-sm inline-flex cursor-pointer items-center justify-center bg-lime px-6 py-3.5 text-ink hover:bg-lime-400 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Creating account…" : "Create account"}
      </button>

      <p className="text-stone-text">
        Already have an account?{" "}
        <Link href="/login" className="text-ink hover:bg-lime px-2 py-2 rounded-sm">
          Log in
        </Link>
      </p>
    </form>
  );
}
