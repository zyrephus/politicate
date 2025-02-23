"use client";

import { motion } from "framer-motion";
import { PoliticianCard } from "@/components/profile/PoliticianCard";
import { HeroParticle } from "@/components/hero/HeroParticle";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface Politicians {
  mayor_name: string;
  mayor_photo: string;
  premier_name: string;
  premier_photo: string;
  federal: string;
  federal_photo: string;
  province: string;
}

interface Score {
  score?: {
    error?: string;
  };
  summary: string;
}

export default function HomePage() {
  const [politicians, setPoliticians] = useState<Politicians | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [score, setScore] = useState<Score | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // First, get the current user
        const client = createClient();
        const {
          data: { user },
          error: userError,
        } = await client.auth.getUser();

        if (userError) throw new Error("Failed to get user");
        if (!user?.email) throw new Error("No user email found");

        // Then, get their postal code
        const postalResponse = await fetch(
          `http://localhost:8000/getPostal/${user.email}`
        );
        const postalData = await postalResponse.json();

        if (!postalData.postalCode) throw new Error("No postal code found");

        // Finally, get the politicians for that postal code
        const politiciansResponse = await fetch(
          `http://localhost:8000/getPoliticians/${postalData.postalCode}`
        );
        const politiciansData = await politiciansResponse.json();

        if (politiciansData.error) throw new Error(politiciansData.error);

        setPoliticians(politiciansData);

        // Then, get the score for the current user
        const scoreResponse = await fetch(
          `http://localhost:8000/getScore/${user.email}`
        );
        const scoreData = await scoreResponse.json();

        if (scoreData.error) throw new Error(scoreData.error);

        setScore(scoreData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="relative min-h-screen">
        <div className="absolute inset-0 w-full z-10 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
        <HeroParticle />
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative min-h-screen">
        <div className="absolute inset-0 w-full z-10 flex items-center justify-center">
          <p className="text-red-500">Error: {error}</p>
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
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold">Your Representatives</h1>
              {politicians?.province && (
                <Badge variant="secondary" className="text-base">
                  {politicians.province}
                </Badge>
              )}
            </div>
            <p className="text-gray-500 mt-2">
              Stay informed about your local, provincial, and federal leaders.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <PoliticianCard
              name={politicians?.mayor_name || ""}
              role="Municipal Leader"
              image={politicians?.mayor_photo || "/dummy-thumbnail.jpg"}
            />
            <PoliticianCard
              name={politicians?.premier_name || ""}
              role="Provincial Premier"
              image={politicians?.premier_photo || "/dummy-thumbnail.jpg"}
            />
            <PoliticianCard
              name={politicians?.federal || ""}
              role="Prime Minister"
              image={politicians?.federal_photo || "/dummy-thumbnail.jpg"}
            />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="bg-card rounded-lg p-6 shadow-sm"
          >
            <h2 className="text-2xl font-semibold mb-6">
              Your Political Alignment
            </h2>
            {score?.score?.error ? (
              <div className="flex gap-8 items-center">
                <div className="flex-1">
                  <div className="flex justify-between text-sm text-muted-foreground mb-2">
                    <span>Left (-100)</span>
                    <span>Right (100)</span>
                  </div>
                  <div className="relative h-8">
                    <Progress
                      value={50}
                      className="h-full rounded-full opacity-50"
                    />
                    <div className="absolute top-full mt-1 left-1/2 transform -translate-x-1/2 text-sm font-medium text-muted-foreground">
                      No Score Yet
                    </div>
                  </div>
                </div>
                <div className="w-1/3">
                  <p className="text-muted-foreground">{score.summary}</p>
                </div>
              </div>
            ) : (
              <div className="flex gap-8 items-center">
                <div className="flex-1">
                  <div className="flex justify-between text-sm text-muted-foreground mb-2">
                    <span>Left (-100)</span>
                    <span>Right (100)</span>
                  </div>
                  <div className="relative h-8">
                    <Progress
                      value={((score?.score as number) + 100) / 2}
                      className="h-full rounded-full"
                    />
                    <div className="absolute top-full mt-1 left-1/2 transform -translate-x-1/2 text-sm font-medium">
                      {score?.score}
                    </div>
                  </div>
                </div>
                <div className="w-1/3">
                  <p className="text-muted-foreground">{score?.summary}</p>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>
      <HeroParticle />
    </div>
  );
}
