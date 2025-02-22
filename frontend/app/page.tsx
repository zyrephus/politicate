import React from "react";
import { Navbar } from "@/components/Navbar";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="flex flex-col gap-8 items-center justify-center">
        <h1>Hello World</h1>
      </main>
    </div>
  );
}
