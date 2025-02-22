import { AuthForm } from "@/components/auth/AuthForm";
import { HeroParticle } from "@/components/hero/HeroParticle";

export default function AuthPage() {
  return (
    <div className="relative h-screen">
      <div className="absolute top-0 w-full h-screen z-10 flex items-center justify-center">
        <AuthForm />
      </div>
      <HeroParticle />
    </div>
  );
}
