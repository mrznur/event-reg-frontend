import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Organizer login",
};

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-[1440px] px-4 py-16 md:px-6 md:py-24 lg:px-8">
      <div className="grid gap-10 md:grid-cols-2 md:gap-16">
        <div>
          <h1 className="display-l">Organizer login</h1>
          <p className="mt-6 max-w-md text-stone-text">
            Log in to create events and manage registrations. Attendees do not
            need an account to register.
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
