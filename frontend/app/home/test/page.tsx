"use client";

import { useEffect, useState } from "react";
import { ThumbsUp, ThumbsDown, Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { HeroParticle } from "@/components/hero/HeroParticle";
import { BorderBeam } from "@/components/magicui/border-beam";
import { createClient } from "@/utils/supabase/client";
import { Badge } from "@/components/ui/badge";

type PolicySet = {
  [key: string]: {
    statement: string;
    rating: number;
  };
};

type RawData = {
  [key: string]: PolicySet[];
};

type PolicyTuple = [string, string, number]; // [statement, person, rating]

type Preference = {
  policy: string;
  person: string;
  liked: boolean;
  rating: number;
};

export default function PolicySwiper() {
  const [rawData, setRawData] = useState<RawData>({});
  const [policies, setPolicies] = useState<PolicyTuple[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [preferences, setPreferences] = useState<Preference[]>([]);
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const [direction, setDirection] = useState<number>(0);
  const [user, setUser] = useState<any>(null);
  const [isStarted, setIsStarted] = useState<boolean>(false);

  useEffect(() => {
    const client = createClient();

    const fetchUser = async () => {
      const { data, error } = await client.auth.getUser();
      if (error) {
        console.error("Error fetching user:", error);
        return;
      }
      if (data?.user) {
        setUser(data.user);
      }
    };

    const fetchPolicies = async () => {
      const res = await fetch("http://localhost:8000/swipe");
      const data: RawData = await res.json();
      console.log(data);
      setRawData(data);
      setPolicies(getAllPolicies(data));
    };

    fetchUser();
    fetchPolicies();
  }, []);

  const getAllPolicies = (data: RawData): PolicyTuple[] => {
    const policies: PolicyTuple[] = [];

    Object.entries(data).forEach(([person, personData]) => {
      personData.forEach((policySet: PolicySet) => {
        Object.values(policySet).forEach((policy: any) => {
          if (typeof policy === "object" && policy.statement) {
            policies.push([policy.statement, person, policy.rating]); // Include rating
          } else if (typeof policy === "string") {
            policies.push([policy, person, 0]); // Default rating if not provided
          }
        });
      });
    });

    for (let i = policies.length - 1; i > 0; i--) {
      const j = Math.floor(0.2 * (i + 1));
      [policies[i], policies[j]] = [policies[j], policies[i]];
    }

    return policies;
  };

  const handleVote = (liked: boolean): void => {
    const [policy, person, rating] = policies[currentIndex];
    setDirection(liked ? 1 : -1);

    setTimeout(() => {
      setPreferences((prev) => [...prev, { policy, person, liked, rating }]);
      if (currentIndex < policies.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        setIsComplete(true);
      }
      setDirection(0);
    }, 200);
  };

  if (!isStarted) {
    return (
      <div className="relative h-screen">
        <div className="absolute top-0 w-full h-screen z-10 flex flex-col items-center justify-center gap-4">
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex flex-col items-center gap-4"
          >
            <h1 className="text-4xl font-bold">Take the Test</h1>
            <p className="text-gray-500">
              See which politicians you most align with
            </p>
            <Button
              variant="default"
              size="lg"
              onClick={() => setIsStarted(true)}
            >
              Start Test
            </Button>
          </motion.div>
        </div>
        <HeroParticle />
      </div>
    );
  }

  if (isComplete) {
    return (
      <div className="relative h-screen">
        <div className="absolute top-0 w-full h-screen z-10 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <Card className="w-full max-w-2xl h-[700px] mx-auto relative">
              <BorderBeam duration={8} size={100} />
              <CardHeader className="text-xl font-bold">
                Your Policy Preferences
              </CardHeader>
              <CardContent className="overflow-y-auto h-[550px]">
                <div className="space-y-4">
                  {preferences.map((pref, index) => (
                    <div
                      key={index}
                      className="flex flex-col gap-2 p-4 border rounded transition-colors duration-200 hover:bg-red-50"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-blue-600">
                          {pref.person}
                        </span>
                        <Badge
                          variant="outline"
                          className={`${pref.liked
                            ? "bg-green-100 text-green-700 border-green-200 hover:bg-green-100"
                            : "bg-red-100 text-red-700 border-red-200 hover:bg-red-100"
                            }`}
                        >
                          {pref.liked ? "👍 Agree" : "👎 Disagree"}
                        </Badge>
                      </div>
                      <p className="text-sm mt-1">{pref.policy}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-center gap-4 mt-4 pb-6">
                <Button
                  variant="outline"
                  className="hover:bg-gray-100"
                  onClick={() => {
                    setCurrentIndex(0);
                    setPreferences([]);
                    setIsComplete(false);
                  }}
                >
                  Try Again
                </Button>

                <Button
                  variant="default"
                  onClick={async () => {
                    if (!user) {
                      console.error("No user is authenticated.");
                      return;
                    }

                    try {
                      const preferencesWithUserInfo = preferences.map(
                        (pref) => ({
                          ...pref,
                          email: user.email,
                        })
                      );

                      const response = await fetch(
                        "http://localhost:8000/postPolicy",
                        {
                          method: "POST",
                          headers: {
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify(preferencesWithUserInfo),
                        }
                      );

                      if (response.ok) {
                        console.log("Preferences submitted successfully!");
                        window.location.href = "/home";
                      } else {
                        console.error("Failed to submit preferences");
                      }
                    } catch (error) {
                      console.error("Error submitting preferences:", error);
                    }
                  }}
                >
                  Submit Preferences
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </div>
        <HeroParticle />
      </div>
    );
  }

  if (policies.length === 0) {
    return (
      <div className="relative h-screen">
        <div className="absolute top-0 w-full h-screen z-10 flex flex-col items-center justify-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-400-500" />
          <p className="text-center text-lg">Loading policies...</p>
        </div>
        <HeroParticle />
      </div>
    );
  }

  return (
    <div className="relative h-screen">
      <div className="absolute top-0 w-full h-screen z-10 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{
              opacity: 0,
              y: 20,
              rotateZ: 0,
              x: 0,
            }}
            animate={{
              opacity: direction === 0 ? 1 : 0,
              y: direction === 0 ? 0 : 20,
              rotateZ: direction * 20,
              x: direction * 200,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="w-full max-w-2xl h-[400px] mx-auto py-4 flex flex-col relative">
              <BorderBeam duration={8} size={100} />
              <CardHeader className="text-xl font-bold text-center">
                Policy {currentIndex + 1} of {policies.length}
              </CardHeader>
              <CardContent className="flex-1 flex items-center justify-center px-8">
                <p className="text-xl">{policies[currentIndex][0]}</p>
              </CardContent>
              <CardFooter className="flex justify-center gap-8 mt-auto">
                <Button
                  variant="outline"
                  className="bg-red-100 hover:bg-red-200"
                  onClick={() => handleVote(false)}
                >
                  <ThumbsDown className="w-6 h-6" />
                </Button>
                <Button
                  variant="outline"
                  className="bg-green-100 hover:bg-green-200"
                  onClick={() => handleVote(true)}
                >
                  <ThumbsUp className="w-6 h-6" />
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
      <HeroParticle />
    </div>
  );
}
