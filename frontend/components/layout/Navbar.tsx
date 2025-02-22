"use client";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export function Navbar() {
  return (
    <motion.nav
      initial={{opacity: 0, y: 5}}
      animate={{opacity: 1, y: 0}}
      transition={{delay: 0.5, duration: 0.8,}}
      className="fixed top-0 w-full z-20 p-5"
    >
      <div className="relative container mx-auto flex h-16 items-center justify-between">
        <div className="flex items-center relative group z-10">
          <div className="absolute -inset-0.5 bg-red-500/30 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <Link href="/" className="relative">
            <Image
              src="/politicate.svg"
              alt="Politicate Logo"
              width={60}
              height={60}
              priority
            />
          </Link>
        </div>

        <div className="flex items-center space-x-4 z-20">
        <Link href="/signup">
          <Button variant="ghost">Sign up</Button>
        </Link>
        <Button>
          Login
          <LogIn className="h-4 w-4" />
        </Button>
        </div>
      </div>
    </motion.nav>
  );
}
