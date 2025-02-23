"use client";

import { motion } from "framer-motion";
import { PoliticianCard } from "@/components/profile/PoliticianCard";
import { HeroParticle } from "@/components/hero/HeroParticle";

export default function HomePage() {
  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 w-full z-10">
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="container mx-auto px-6 py-12"
        >
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Your Representatives</h1>
            <p className="text-gray-500 mt-2">
              Stay informed about your local, provincial, and federal leaders.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <PoliticianCard
              name="John Tory"
              role="Municipal Leader"
              image="/dummy-thumbnail.jpg"
            />
            <PoliticianCard
              name="Doug Ford"
              role="Provincial Premier"
              image="/dummy-thumbnail.jpg"
            />
            <PoliticianCard
              name="Justin Trudeau"
              role="Prime Minister"
              image="/dummy-thumbnail.jpg"
            />
          </div>
        </motion.div>
      </div>
      <HeroParticle />
    </div>
  );
}
