"use client";
import React from "react";
import { HeroParticle } from "./HeroParticle";
import { TextAnimate } from "../magicui/text-animate";
import { motion } from "framer-motion";
import { ShimmerButton } from "../magicui/shimmer-button";
import { MoveUpRight } from "lucide-react";
import Link from "next/link";

export default function HeroSection() {
  return (
    <div className="relative h-screen">
      <div className="absolute top-0 w-full h-screen z-10 flex items-center justify-center flex-col space-y-10">
        <div>
          <TextAnimate
            className="text-center text-4xl font-bold tracking-tighter md:text-5xl lg:text-7xl"
            animation="blurInUp"
            by="character"
            once
          >
            Empower Your
          </TextAnimate>
          <TextAnimate
            className="text-center text-4xl font-bold tracking-tighter md:text-5xl lg:text-7xl"
            animation="blurInUp"
            by="character"
            once
          >
            Political Awareness
          </TextAnimate>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="text-center text-sm md:text-xl text-gray-500 lg:w-[40rem]"
        >
          Stay informed with your local political landscape by gaining a neutral
          understanding of political topics with AI-powered explanations.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <Link href="/auth?type=signup">
            <ShimmerButton
              className="gap-2"
              shimmerColor="#F56565"
              shimmerSize="0.2rem"
            >
              <span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10 lg:text-lg">
                Get Started
              </span>
              <MoveUpRight />
            </ShimmerButton>
          </Link>
        </motion.div>
      </div>
      <HeroParticle />
    </div>
  );
}
