"use client";

import { HeroParticle } from "@/components/hero/HeroParticle";
import { motion } from "framer-motion";
import { NewsCard } from "@/components/news/NewsCard";
import { municipalNews } from "@/lib/dummy-news";

export default function ProvincialPage() {
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
            <h1 className="text-3xl font-bold">Provincial News</h1>
            <p className="text-gray-500 mt-2">
              Stay informed about Ontario provincial politics and regional
              policies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {municipalNews.items.map((item, index) => (
              <div key={index} className="h-full">
                <NewsCard news={item} />
              </div>
            ))}
          </div>
        </motion.div>
      </div>
      <HeroParticle />
    </div>
  );
}
