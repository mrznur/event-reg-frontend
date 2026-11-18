import type { Metadata } from "next";
import { SignupForm } from "@/components/auth/signup-form";

export const metadata: Metadata = {
  title: "Organizer sign up",
  robots: { index: false, follow: false },
};

export default function SignupPage() {
  return (
    <div className="mx-auto max-w-[1440px] px-4 py-16 md:px-6 md:py-24 lg:px-8">
      <div className="grid gap-10 md:grid-cols-2 md:gap-16">
        <div>
          <h1 className="display-l">Organizer sign up</h1>
          <p className="mt-6 max-w-md text-stone-text">
            Create an organizer account to publish events, manage registrations
            and check attendees in. Attendees do not need an account to
            register.
          </p>
        </div>
        <SignupForm />
      </div>
    </div>
  );
}
