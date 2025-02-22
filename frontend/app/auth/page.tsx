"use client";
import { AuthForm } from "@/components/auth/AuthForm";
import { HeroParticle } from "@/components/hero/HeroParticle";
import { motion } from "framer-motion";

export default function AuthPage() {
  return (
    <div className="relative h-screen">
      <motion.div
        className="absolute top-0 w-full h-screen z-10 flex items-center justify-center"
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.8 }}
      >
        <AuthForm />
      </motion.div>
      <HeroParticle />
    </div>
  );
}
