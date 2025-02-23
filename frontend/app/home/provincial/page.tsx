"use client";

import { HeroParticle } from "@/components/hero/HeroParticle";
import { motion } from "framer-motion";
import { NewsCard } from "@/components/news/NewsCard";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

interface NewsItem {
  title: string;
  link: string;
  response: string;
  image?: string;
}

export default function ProvincialPage() {
  const [loading, setLoading] = useState(true);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const client = createClient();
        const {
          data: { user },
          error: userError,
        } = await client.auth.getUser();

        if (userError) throw new Error("Failed to get user");
        if (!user?.email) throw new Error("No user email found");

        const postalResponse = await fetch(
          `http://localhost:8000/getPostal/${user.email}`
        );
        const postalData = await postalResponse.json();

        if (!postalData.postalCode) {
          throw new Error("No postal code found");
        }

        const response = await fetch(
          `http://localhost:8000/getNews/Provincial/${postalData.postalCode}`
        );
        const data = await response.json();

        const transformedNews = data.map((item: NewsItem) => ({
          title: item.title,
          link: item.link,
          snippet: item.response,
          displayLink: new URL(item.link).hostname,
          image: item.image,
        }));

        setNews(transformedNews);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) {
    return (
      <div className="relative h-screen">
        <div className="absolute top-0 w-full h-screen z-10 flex flex-col items-center justify-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-400-500" />
          <p className="text-center text-lg">Loading news...</p>
        </div>
        <HeroParticle />
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative h-screen">
        <div className="absolute top-0 w-full h-screen z-10 flex flex-col items-center justify-center gap-4">
          <p className="text-center text-lg text-red-500">{error}</p>
        </div>
        <HeroParticle />
      </div>
    );
  }

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
              Stay informed about provincial politics and regional policies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.map((item, index) => (
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
