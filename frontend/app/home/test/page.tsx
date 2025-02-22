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

type PolicySet = {
  [key: string]: string;
};

type RawData = {
  [key: string]: PolicySet[];
};

type PolicyTuple = [string, string];

type Preference = {
  policy: string;
  person: string;
  liked: boolean;
};

export default function PolicySwiper() {
  const [rawData, setRawData] = useState<RawData>({});
  const [policies, setPolicies] = useState<PolicyTuple[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [preferences, setPreferences] = useState<Preference[]>([]);
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const [direction, setDirection] = useState<number>(0);

  useEffect(() => {
    fetch("http://localhost:8000/swipe")
      .then((res) => res.json())
      .then((data: RawData) => {
        setRawData(data);
        setPolicies(getAllPolicies(data));
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const getAllPolicies = (data: RawData): PolicyTuple[] => {
    const policies: PolicyTuple[] = [];

    Object.entries(data).forEach(([person, personData]) => {
      personData.forEach((policySet: PolicySet) => {
        Object.values(policySet).forEach((policy: string) => {
          policies.push([policy, person]);
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
    const [policy, person] = policies[currentIndex];
    setDirection(liked ? 1 : -1);

    setTimeout(() => {
      setPreferences((prev) => [...prev, { policy, person, liked }]);
      if (currentIndex < policies.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        setIsComplete(true);
      }
      setDirection(0);
    }, 200);
  };

  if (isComplete) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Card className="w-full max-w-2xl h-[600px] mx-auto">
          <CardHeader className="text-xl font-bold">
            Your Policy Preferences
          </CardHeader>
          <CardContent className="overflow-y-auto h-[500px]">
            <div className="space-y-4">
              {preferences.map((pref, index) => (
                <div
                  key={index}
                  className="flex flex-col gap-2 p-4 border rounded"
                >
                  <div className="flex items-center gap-2">
                    <span>{pref.liked ? "👍" : "👎"}</span>
                    <span className="font-medium text-blue-600">
                      {pref.person}
                    </span>
                  </div>
                  <p className="text-sm mt-1">{pref.policy}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (policies.length === 0) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        <p className="text-center text-lg">Loading policies...</p>
      </div>
    );
  }

  return (
    <div className="h-screen flex items-center justify-center">
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
          <Card className="w-full max-w-2xl h-[400px] mx-auto py-4 flex flex-col">
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
  );
}
