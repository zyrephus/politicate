"use client";
import { AuthForm } from "@/components/auth/AuthForm";
import { HeroParticle } from "@/components/hero/HeroParticle";
import { createClient } from "@/utils/supabase/client";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import React from "react";

export default function AuthPage() {
  const router = useRouter();

  React.useEffect(() => {
    const client = createClient();

    const fetchUser = async () => {
      try {
        const { data } = await client.auth.getUser();
        if (data?.user) {
          router.push("/home");
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, [router]);

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
