"use client";

import { motion } from "framer-motion";
import { PoliticianCard } from "@/components/profile/PoliticianCard";
import { HeroParticle } from "@/components/hero/HeroParticle";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Politicians {
  mayor_name: string;
  mayor_photo: string;
  premier_name: string;
  premier_photo: string;
  federal: string;
  federal_photo: string;
  province: string;
}

export default function HomePage() {
  const [politicians, setPoliticians] = useState<Politicians | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        </motion.div>
      </div>
      <HeroParticle />
    </div>
  );
}
