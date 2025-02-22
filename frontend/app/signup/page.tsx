"use client";

import { SignUpForm } from "@/components/auth/SignUpForm";
import { HeroParticle } from "@/components/hero/HeroParticle";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <SignUpForm />
    </div>
  );
}
